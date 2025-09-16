import { createHandler } from "@/utils/routeHandler";
import { items } from "@/constants/items";

export const POST = createHandler(async (_data, connection) => {
  try {
    const queries = items.map((item) => {
      return `
        SELECT '${item.name}' AS key_name,
               COALESCE(SUM(CAST(${item.name} AS SIGNED)), 0) AS value
        FROM (
          SELECT ${item.name} FROM \`inventory-logs\`
          WHERE Type IN ('new-stock', 'correction')
          UNION ALL
          SELECT -${item.name} FROM Sales
        ) AS combined
      `;
    });

    const sql = queries.join("\nUNION ALL\n");
    const [rows] = await connection.query(sql);

    // Convert array of objects to key-value object
    const result: Record<string, string> = {};
    rows.forEach((row: any) => {
      result[row.key_name] = row.value.toString();
    });

    return result;
  } catch (error) {
    console.error("❌ Error fetching inventory:", error);
    throw new Error("Failed to fetch current inventory");
  }
});