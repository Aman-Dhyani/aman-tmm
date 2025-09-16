import { createHandler } from "@/utils/routeHandler";

export const POST = createHandler(async (reqData, connection) => {
  try {
    // Destructure page and branch directly from request body
    const { page = 1, branch } = reqData as { page?: number; branch?: string };

    const limit = 10;
    const offset = (Number(page) - 1) * limit;

    // Only filter if branch is provided
    const branchFilter = branch ? `WHERE branch = '${branch}'` : "";

    // Count total rows for pagination
    const [countResult] = await connection.query(
      `SELECT COUNT(*) as totalRows FROM pos_sales ${branchFilter}`
    );
    const totalRows = Number((countResult as any)[0].totalRows || 0);
    const totalPages = Math.ceil(totalRows / limit);

    // Fetch paginated rows
    const [rows] = await connection.query(
      `
      SELECT *
      FROM pos_sales
      ${branchFilter}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
      `,
      [limit, offset]
    );

    return { rows, totalRows, totalPages, currentPage: Number(page) };
  } catch (error) {
    console.error("❌ Error fetching paginated POS sales:", error);
    throw new Error("Failed to fetch paginated POS sales");
  }
});