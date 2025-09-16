// app/api/pos-summary/route.ts
import { createHandler } from "@/utils/routeHandler";

export const POST = createHandler(async (_data, connection) => {
  try {
    // Step 1: fetch all distinct branches
    const [branchesRows] = await connection.query(`SELECT DISTINCT branch FROM pos_sales`);
    let branches = (branchesRows as Array<{ branch: string }>).map((b) => b.branch);

    // Step 2: sort branches: branch-1 first, branch-2 second, rest alphabetically
    branches.sort((a, b) => {
      if (a === "branch-1") return -1;
      if (b === "branch-1") return 1;
      if (a === "branch-2") return -1;
      if (b === "branch-2") return 1;
      return a.localeCompare(b);
    });

    const methods = ["cash", "online"];
    const selectClauses: string[] = [];

    // Step 3: build dynamic SUM(CASE...) clauses for each branch and payment method
    branches.forEach((branch) => {
      methods.forEach((method) => {
        selectClauses.push(`
          SUM(CASE WHEN branch = '${branch}' AND payment_method = '${method}' THEN CAST(total AS UNSIGNED) ELSE 0 END) AS \`${branch} (${method.charAt(0).toUpperCase() + method.slice(1)})\`
        `);
      });
      // Total per branch
      selectClauses.push(`
        SUM(CASE WHEN branch = '${branch}' THEN CAST(total AS UNSIGNED) ELSE 0 END) AS \`${branch} (Total)\`
      `);
    });

    // Step 4: Grand Total
    selectClauses.push(`SUM(CAST(total AS UNSIGNED)) AS \`Grand Total\``);

    // Step 5: build final query
    const sql = `
      SELECT 
        DATE_FORMAT(DATE(created_at), '%Y-%m-%d') AS \`Date\`,
        ${selectClauses.join(",\n")}
      FROM pos_sales
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) DESC
      LIMIT 10
    `;

    const [rows] = await connection.query(sql);
    return rows;
  } catch (error) {
    console.error("❌ Error fetching POS summary:", error);
    throw new Error("Failed to fetch POS summary");
  }
});
