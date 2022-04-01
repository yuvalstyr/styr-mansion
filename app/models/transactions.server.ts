import { Transaction } from "@prisma/client"
import { db } from "~/utils/db.server"

export function getTransactionsListByYearMonth(yearMonth: string) {
  const [year, month] = yearMonth.split("-")
  return db.transaction.findMany({
    where: {
      month: Number(month),
      year: Number("20" + year),
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
      month: Number(month),
      year: Number(year),
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
      month: Number(month),
      year: Number(year),
    },
    where,
  })
}
