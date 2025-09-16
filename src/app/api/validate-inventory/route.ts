// app/api/validate-inventory/route.ts
import { createHandler } from "@/utils/routeHandler";

export const POST = createHandler(async (data, connection) => {
  try {
    const { branch, calcData } = data;

    if (!branch) {
      throw new Error("Branch is required");
    }

    // generate dynamic SUM columns from calcData keys
    const cols = Object.keys(calcData)
      .map((col) => `SUM(\`${col}\`) AS \`${col}\``)
      .join(", ");

    // SQL query
    const sql = `
    WITH last_stock_in AS (
      SELECT t1.Time
      FROM \`tooljet_inventory-logs\` t1
      WHERE t1.Type = 'stock-in'
        AND t1.Branch = :branch
      ORDER BY t1.Time DESC
      LIMIT 1
    ),
    usable_stock_outs AS (
      SELECT so.*
      FROM \`tooljet_inventory-logs\` so
      LEFT JOIN last_stock_in lsi ON 1=1
      WHERE so.Type = 'stock-out'
        AND so.Branch = :branch
        AND (
          lsi.Time IS NULL OR so.Time > lsi.Time
        )
    )
    SELECT 
      COUNT(*) > 0 AS has_stock_out,
      ${cols}
    FROM usable_stock_outs;
  `;

    const [rows] = await connection.execute(sql, { branch });
    const result: any = Array.isArray(rows) ? rows[0] : rows;

    // First validation: stock-outs exist?
    if (!result.has_stock_out) {
      return { error: "Stock-out does not exist" };
    }

    // Second validation: calcData should not exceed stock-out totals
    for (const key of Object.keys(calcData)) {
      const requested = Number(calcData[key] || 0);
      const available = Number(result[key] || 0);

      if (requested > available) {
        return { error: "Stock-in exceeds out" };
      }
    }

    // If both validations pass, return stock-out totals (without has_stock_out)
    const { has_stock_out, ...stockData } = result;
    return stockData;
  } catch (error) {
    console.error("Error in validate-inventory:", error);
    return { error: (error as Error).message || "Unknown error" };
  }
});
