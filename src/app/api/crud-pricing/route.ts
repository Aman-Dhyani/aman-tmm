// app/api/pricings/route.ts
import { createHandler } from "@/utils/routeHandler";

export const POST = createHandler(async (body: any, connection) => {
  try {
    const { action, type } = body;

    if (action === "fetch") {
      // Fetch both cost and sell rows
      const sql = `
        SELECT *
        FROM tmm_pricings
        WHERE type IN ('cost', 'sell')
      `;
      const [rows] = await connection.query(sql);
      return rows;
    } 
    else if (action === "update" && type) {
      // Separate payload into cost and sell objects
      const costData: Record<string, any> = {};
      const sellData: Record<string, any> = {};

      Object.entries(type).forEach(([key, value]) => {
        if (key.endsWith("_cost")) {
          const col = key.replace("_cost", "");
          costData[col] = value;
        } else if (key.endsWith("_sell")) {
          const col = key.replace("_sell", "");
          sellData[col] = value;
        }
      });

      // Update cost row
      await connection.query(
        `UPDATE tmm_pricings SET ? WHERE type = 'cost'`,
        [costData]
      );

      // Update sell row
      await connection.query(
        `UPDATE tmm_pricings SET ? WHERE type = 'sell'`,
        [sellData]
      );

      return { message: "Pricing updated successfully!" };
    } 
    else {
      throw new Error("Invalid action or missing type");
    }
  } catch (err) {
    console.error("❌ Error in pricings route:", err);
    throw new Error("Failed to process pricings");
  }
});
