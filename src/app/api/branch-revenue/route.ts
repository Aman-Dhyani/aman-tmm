import { createHandler } from "@/utils/routeHandler";
import { items } from "@/constants/items";

export const POST = createHandler(async (data, connection) => {
  try {
    const { branch = [] } = data;

    if (!Array.isArray(branch) || branch.length === 0) {
      throw new Error("Branch must be a non-empty array");
    }

    // Only keep "double" items (remove single items not in pricing)
    const filteredItems = items.filter(i => i.type === "double");

    // Build branch condition
    let whereClause = "";
    let params: any[] = [];

    if (branch.length === 1) {
      whereClause = "s.Branch = ?";
      params.push(branch[0]);
    } else {
      const placeholders = branch.map(() => "?").join(", ");
      whereClause = `s.Branch IN (${placeholders})`;
      params.push(...branch);
    }

    // Build dynamic SUM columns
    const sumColumns = filteredItems
      .map(i => `SUM(COALESCE(s.${i.name}, 0)) AS ${i.name}`)
      .join(",\n    ");

    const salesColumns = filteredItems.map(i => `COALESCE(s.${i.name}, 0)`).join(" + ");
    const totalColumns = filteredItems
      .map(i => `COALESCE(s.${i.name}, 0) * p.${i.name}`)
      .join(" + ");

    // Grouping
    const groupBy = branch.length > 1 ? "s.Date" : "s.Date, s.Branch";
    const branchLabel = branch.length > 1 ? "'branches'" : "s.Branch";

    const sql = `
      SELECT 
          s.Date,
          ${sumColumns},
          SUM(${salesColumns}) AS Sales,
          SUM(${totalColumns}) AS Total,
          ${branchLabel} AS branch
      FROM Sales s
      CROSS JOIN tmm_pricings p ON p.type = 'sell'
      WHERE ${whereClause}
      GROUP BY ${groupBy}
      ORDER BY s.Date DESC;
    `;

    const [rows] = await connection.execute(sql, params);

    // Transform rows to wrap item columns inside "items"
    const transformed = rows.map((row: any) => {
      const itemsObj: Record<string, any> = {};
      filteredItems.forEach(i => {
        itemsObj[i.name] = row[i.name];
        delete row[i.name]; // remove original key
      });

      return {
        ...row,
        items: itemsObj,
      };
    });

    return transformed;
  } catch (error) {
    console.error("❌ Error fetching revenue data:", error);
    throw new Error("Failed to fetch revenue data");
  }
});
