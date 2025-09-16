import { createHandler } from "@/utils/routeHandler";

export const POST = createHandler(async (data, connection) => {
  try {
    const { branch, type, calcData } = data;

    if (!type) {
      throw new Error("type is required");
    }

    const cols = Object.keys(calcData).join(", ");
    const colValues = Object.keys(calcData).map((key) => `:${key}`).join(", ");

    const sql = `
      INSERT INTO \`tooljet_Sales\`
      (Date, Time, Type, Branch, user, ${cols})
      VALUES (CURDATE(), CURRENT_TIME(), :type, :branch, USER(), ${colValues})
    `;

    await connection.execute(sql, { type, branch, ...calcData });
    return { message: "Stock saved successfully" };
  } catch (error) {
    console.error("Error saving stock:", error);
    throw new Error("Failed to save stock");
  }
});
