import { Transaction } from "@prisma/client"
import { db } from "~/utils/db.server"

export function getTransactionsListByYearMonth(
  year: string | undefined,
  month: string | undefined
): Promise<Transaction[]> {
  return db.transaction.findMany({
    where: {
      month: month,
      year: year,
    },
  })
}

export function getAllTransactions() {
  return db.transaction.findMany()
}

type TransactionInput = Omit<Transaction, "id" | "createdAt" | "updatedAt">

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
