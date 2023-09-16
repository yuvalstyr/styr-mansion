import type { Prisma, Transaction } from "@prisma/client"
import { db } from "~/utils/db.server"

export type TransactionInput = Omit<
  Transaction,
  "id" | "createdAt" | "updatedAt"
>
export type TransactionsGrouped = Prisma.PickArray<
  Prisma.TransactionGroupByOutputType,
  ("type" | "action" | "owner")[]
> & {
  _sum: {
    amount: number | null
  }
}

export function getAllTransactions() {
  return db.transaction.findMany()
}

export function createTransaction(data: TransactionInput) {
  const { action, type, owner, amount, description, month, year } = data
  return db.transaction.create({
    data: {
      action,
      type,
      owner,
      amount: Number(amount),
      description,
      month: month,
      year: year,
    },
  })
}

type TransactionUpdateInput = {
  data: TransactionInput
  where: { id: string }
}

export function updateTransaction(input: TransactionUpdateInput) {
  const { data, where } = input
  const { action, type, owner, amount, description, month, year } = data
  return db.transaction.update({
    data: {
      action,
      type,
      owner,
      amount: Number(amount),
      description,
      month: month,
      year: year,
    },
    where,
  })
}

export function deleteTransaction(id: string) {
  return db.transaction.delete({ where: { id } })
}

export function getDBYearAndMonth() {
  return db.transaction.findMany({
    distinct: ["year"],
    select: { year: true },
    orderBy: { year: "asc" },
  })
}

export function getTransactionsListByYearMonth({
  year,
  months,
}: {
  year: string | undefined
  months: string[] | undefined
}) {
  return db.transaction.findMany({
    where: {
      month: { in: months },
      year: year,
    },
    orderBy: { type: "asc" },
  })
}

export function getTransactionsListByYearMonthGrouped({
  year,
  months,
}: {
  year: string | undefined
  months: string[] | undefined
}) {
  return db.transaction.groupBy({
    where: {
      month: { in: months },
      year: year,
    },
    by: ["owner", "type", "action"],
    _sum: {
      amount: true,
    },
  })
}

export function getAllTransactionsGrouped() {
  return db.transaction.groupBy({
    by: ["owner", "type", "action"],
    _sum: {
      amount: true,
    },
  })
}

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
