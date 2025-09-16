import { items } from "@/constants/items";
import { createHandler } from "@/utils/routeHandler";

export const POST = createHandler(async (data, connection) => {
  try {
    const { branch, period = "last7Days" } = data;

    if (!Array.isArray(branch) || branch.length === 0) {
      throw new Error("Branch must be a non-empty array");
    }

    // Determine start date + groupBy
    const today = new Date();
    let startDate: string | null = null;
    let groupBy = "Date"; // default = daily
    let selectPeriod = "Date"; // alias for frontend

    if (period === "last7Days") {
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      startDate = lastWeek.toISOString().split("T")[0];
      groupBy = "Date";
      selectPeriod = "Date";
    } else if (period === "last30Days") {
      const last30 = new Date(today);
      last30.setDate(today.getDate() - 30);
      startDate = last30.toISOString().split("T")[0];
      groupBy = "Date";
      selectPeriod = "Date";
    } else if (period === "month") {
      // group by month name
      groupBy = "YEAR(Date), MONTH(Date)";
      selectPeriod = "DATE_FORMAT(Date, '%M %Y')"; // Jan 2025, Feb 2025...
    } else if (period === "year") {
      // group by year only
      groupBy = "YEAR(Date)";
      selectPeriod = "YEAR(Date)";
    } else {
      throw new Error("Invalid period value");
    }

    // Build SUM columns dynamically
    const sumColumns = items
      .map(item => `SUM(${item.name}) AS ${item.name}`)
      .join(",\n    ");
    const placeholders = branch.map(() => "?").join(",");

    const sql = `
      SELECT
        ${selectPeriod} AS Period,
        ${sumColumns}
      FROM Sales
      WHERE Branch IN (${placeholders})
      ${startDate ? "AND Date >= ?" : ""}
      GROUP BY ${groupBy}
      ORDER BY MIN(Date);
    `;

    const [rows] = await connection.query(
      sql,
      startDate ? [...branch, startDate] : [...branch]
    );

    // 🔹 Compute Sales + Total across all rows
    const [pricingRows] = await connection.query(
      `SELECT * FROM tmm_pricings WHERE type = 'sell'`
    );
    const pricing = pricingRows[0] || {};

    let totalSales = 0;
    let totalRevenue = 0;

    rows.forEach((row: any) => {
      items.forEach((item) => {
        const qty = Number(row[item.name] || 0);
        totalSales += qty;
        totalRevenue += qty * (pricing[item.name] || 0);
      });
    });

    return {
      rows,
      Sales: totalSales,
      Total: Number(totalRevenue.toFixed(2)),
      branch: branch.length > 1 ? "branches" : branch[0],
    };
  } catch (error) {
    console.error("❌ Error fetching graph data:", error);
    throw new Error("Failed to fetch graph data");
  }
});
