import { db } from "./db.server"

export async function getTransactionsStats() {
  const transactions = await db.transaction.findMany()
  const costs = transactions
    .filter((t) => t.type === "WITHDRAWAL")
    .reduce((acc, t) => acc + t.amount, 0)
  const income = transactions
    .filter((t) => t.type === "DEPOSIT")
    .reduce((acc, t) => acc + t.amount, 0)

  return { costs, income }
}
