import { createHandler } from "@/utils/routeHandler";
import { items } from "@/constants/items";

export const POST = createHandler(async (data, connection) => {
  try {
    const { branch = [], days = 15 } = data;

    // ✅ branch must always be an array (frontend responsibility)
    if (!Array.isArray(branch) || branch.length === 0) {
      throw new Error("Branch must be a non-empty array");
    }

    // Fetch rows for selected branches
    const placeholders = branch.map(() => "?").join(",");
    const sql = `
      SELECT Date, Branch, ${items.map(i => i.name).join(", ")}
      FROM Sales
      WHERE Branch IN (${placeholders})
    `;
    const [rows] = await connection.query(sql, branch);

    // Compute last N days cutoff
    const today = new Date();
    const cutoff = new Date();
    cutoff.setDate(today.getDate() - days);

    // Filter rows within last N days
    const lastNthRows = (rows as any[]).filter(r => {
      const [year, month, day] = r.Date.split("-").map(Number);
      const rowDate = new Date(year, month - 1, day);
      return rowDate >= cutoff && rowDate <= today;
    });

    // Aggregate sums across items
    const aggregated: Record<string, number> = {};
    items.forEach(i => (aggregated[i.name] = 0));

    lastNthRows.forEach(r => {
      items.forEach(i => {
        aggregated[i.name] += Number(r[i.name] || 0);
      });
    });

    return aggregated;

  } catch (error) {
    console.error("❌ Error fetching last No. of days aggregated sales:", error);
    throw new Error("Failed to fetch aggregated sales");
  }
});
