import { createHandler } from "@/utils/routeHandler";
import { items } from "@/constants/items";
import { filterOutItems } from "@/utils/filteroutItems";


export const POST = createHandler(async (data, connection) => {
  try {
    const { branch } = data;

    if (!branch || (Array.isArray(branch) && branch.length === 0)) {
      throw new Error("Branch must be provided");
    }

    const filteredItems = filterOutItems(items);

    const queries = filteredItems.map((item) => {
      return `
        SUM(s.${item.name}) AS sales_${item.name},
        COALESCE(
          SUM(
            JSON_UNQUOTE(JSON_EXTRACT(p.items, '$[0].plate.pieces')) *
            JSON_UNQUOTE(JSON_EXTRACT(p.items, '$[0].quantity'))
          ), 0
        ) AS pos_sales_${item.name}
      `;
    });

    const sql = `
      SELECT DATE(s.Time) AS Date,
             ${queries.join(",\n")}
      FROM Sales s
      LEFT JOIN pos_sales p
        ON DATE(s.Time) = DATE(p.created_at)
        AND s.Branch = p.branch
      WHERE s.Branch IN (:branch)
      GROUP BY DATE(s.Time)
      ORDER BY DATE(s.Time) DESC
      LIMIT 2
    `;

    const [rows] = await connection.query(sql, { branch });

    return rows;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch tally sales");
  }
});
