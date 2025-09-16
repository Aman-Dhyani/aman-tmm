// app/api/posSales/route.ts
import { createHandler } from "@/utils/routeHandler";

export const POST = createHandler(async (body: any, connection) => {
  try {
    const { branch, period } = body;

    if (!branch || !Array.isArray(branch) || branch.length === 0) {
      throw new Error("Branch parameter is required and must be an array");
    }

    // You can expand this switch to apply different SQL when period === 'month' || 'year'
    // For now we'll send rows filtered by branch and (optionally) by created_at depending on period:
    let sql = `SELECT * FROM pos_sales WHERE branch IN (${branch.map(() => "?").join(", ")})`;
    const params: any[] = [...branch];

    if (period === "week") {
      // last 7 days
      sql += ` AND created_at >= ?`;
      const dt = new Date();
      dt.setDate(dt.getDate() - 7);
      params.push(dt.toISOString().split("T")[0] + " 00:00:00");
    } else if (period === "month") {
      // last 30 days
      sql += ` AND created_at >= ?`;
      const dt = new Date();
      dt.setDate(dt.getDate() - 30);
      params.push(dt.toISOString().split("T")[0] + " 00:00:00");
    } else if (period === "year") {
      // last 365 days (or you can choose group by year behavior)
      sql += ` AND created_at >= ?`;
      const dt = new Date();
      dt.setFullYear(dt.getFullYear() - 1);
      params.push(dt.toISOString().split("T")[0] + " 00:00:00");
    }

    sql += ` ORDER BY created_at ASC`;

    const [rows] = await connection.query(sql, params);
    return rows;
  } catch (err) {
    console.error("❌ Error in posSales route:", err);
    throw new Error("Failed to fetch pos_sales data");
  }
});
