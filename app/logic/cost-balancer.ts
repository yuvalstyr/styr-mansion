import { TransactionOwner, TransactionType } from "@prisma/client"
import { getTransactionsListByYearMonthGrouped } from "~/models/transactions.server"

export const MORAN_RAN = TransactionOwner.Moran + "+" + TransactionOwner.Ran

export type TenantSummary = {
  total_profit: number
  Tenant: {
    total_rent: number
    total_expenses: number
  }
}
export type StyrSummary = {
  [x: string]: {
    profit: number
    balance: number
    withdrawal: number
    expense: number
    remains: number
  }
}

export async function getPeriodSummary({
  year,
  months,
}: {
  year: string | undefined
  months: string[] | undefined
}) {
  //  get all transaction per period
  const summaryMap = await getTotalsPerPeriodMap(year, months)
  //  cost per period
  const costPerPeriod =
    summaryMap.EXPENSE[MORAN_RAN] +
    summaryMap.EXPENSE[TransactionOwner.Yuval] +
    summaryMap.EXPENSE[TransactionOwner.Tenant]
  const profit = summaryMap.DEPOSIT.all - costPerPeriod

  //  balance expenses between yuval and moranran
  const expenseMoranRan = summaryMap.EXPENSE[MORAN_RAN] * 0.41
  const expenseYuval = summaryMap.EXPENSE[TransactionOwner.Yuval] * 0.59

  //  balance withdrawal between yuval and moranran
  const yuvalBalance = expenseYuval - expenseMoranRan
  const moranRanBalance = yuvalBalance * -1

  const profitYuval = profit * 0.413
  const profitMoranRan = profit * 0.587

  const styrSummary: StyrSummary = {
    [MORAN_RAN]: {
      profit: profitMoranRan,
      balance: moranRanBalance,
      withdrawal: summaryMap.WITHDRAWAL[MORAN_RAN],
      expense: summaryMap.EXPENSE[MORAN_RAN],
      remains:
        profitMoranRan + moranRanBalance - summaryMap.WITHDRAWAL[MORAN_RAN],
    },
    [TransactionOwner.Yuval]: {
      profit: profitYuval,
      balance: yuvalBalance,
      withdrawal: summaryMap.WITHDRAWAL[TransactionOwner.Yuval],
      expense: summaryMap.EXPENSE[TransactionOwner.Yuval],
      remains:
        profitYuval +
        yuvalBalance -
        summaryMap.WITHDRAWAL[TransactionOwner.Yuval],
    },
  }
  const tenantSummary: TenantSummary = {
    total_profit: profit,
    [TransactionOwner.Tenant]: {
      total_rent: summaryMap.DEPOSIT.all,
      total_expenses: summaryMap.EXPENSE[TransactionOwner.Tenant],
    },
  }

  return { styrSummary, tenantSummary }
}

type Summary = {
  [key in TransactionType]: { [key: string]: number }
}

async function getTotalsPerPeriodMap(
  year: string | undefined,
  months: string[] | undefined
) {
  const transactions = await getTransactionsListByYearMonthGrouped({
    year,
    months,
  })

  const summaryMap: Summary = transactions.reduce(
    (balance, transaction) => {
      const amount = transaction._sum.amount
      if (!amount) return balance
      switch (transaction.type) {
        case "WITHDRAWAL":
          if (transaction.owner === "Moran" || transaction.owner === "Ran") {
            balance.WITHDRAWAL[MORAN_RAN] += amount
            return balance
          } else {
            balance.WITHDRAWAL[transaction.owner] += amount
            return balance
          }
        case "DEPOSIT":
          balance.DEPOSIT["all"] += amount
          return balance
        case "EXPENSE":
          switch (transaction.owner) {
            case TransactionOwner.Moran:
            case TransactionOwner.Ran:
              balance.EXPENSE[MORAN_RAN] += amount
              return balance
            case TransactionOwner.Yuval:
              balance.EXPENSE[TransactionOwner.Yuval] += amount
              return balance
            default:
              balance.EXPENSE[TransactionOwner.Tenant] += amount
              return balance
          }
      }
    },
    {
      DEPOSIT: { all: 0 },
      EXPENSE: {
        [MORAN_RAN]: 0,
        [TransactionOwner.Yuval]: 0,
        [TransactionOwner.Tenant]: 0,
      },
      WITHDRAWAL: { [MORAN_RAN]: 0, [TransactionOwner.Yuval]: 0 },
    } as Summary
  )
  return summaryMap
}
