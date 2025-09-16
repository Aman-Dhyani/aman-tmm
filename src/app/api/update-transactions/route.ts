import { createHandler } from "@/utils/routeHandler";

export const POST = createHandler(async (data, connection) => {
  try {
    const { branch, amount } = data;

    if (!branch || !amount) {
      throw new Error("All fields are required");
    }

    const sql = `
      INSERT INTO transactions (Date, Time, Branch, Entry, Amount, Type, Mode)
      VALUES (DATE_FORMAT(CURDATE(), '%m-%d-%Y'), CURRENT_TIME(), :branch, USER(), :amount, 'in', 'cash')
    `;

    await connection.execute(sql, { branch, amount });

    return { message: "Transaction saved successfully" };
  } catch (error) {
    console.error("Error saving transaction:", error);
    throw new Error("Failed to save transaction");
  }
});
