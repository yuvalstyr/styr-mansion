import { TransactionOwner, TransactionType } from "@prisma/client"
import { StyrSummary } from "~/logic/cost-balancer"
import {
  getDBYearAndMonth,
  getTransactionsListByYearMonthGrouped,
  TransactionsGrouped,
} from "~/models/transactions.server"
import { debugRemix } from "~/utils/debug"

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

type Summary = {
  [key in TransactionType]: { [key: string]: number }
}

export async function getAllTimeSummary() {
  const summaryMap = await getTotalsMap()
  return summaryMap
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
  const { profit, styrSummary }: { profit: number; styrSummary: StyrSummary } =
    mapToStyrSummary(summaryMap)

  const tenantSummary: TenantSummary = mapToTenantSummary(profit, summaryMap)

  return { styrSummary, tenantSummary }
}

function mapToTenantSummary(
  profit: number,
  summaryMap: Summary
): TenantSummary {
  return {
    total_profit: profit,
    [TransactionOwner.Tenant]: {
      total_rent: summaryMap.DEPOSIT.all,
      total_expenses: summaryMap.EXPENSE[TransactionOwner.Tenant],
    },
  }
}

function mapToStyrSummary(summaryMap: Summary) {
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

  const profitYuval = profit * 0.41
  const profitMoranRan = profit * 0.59

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
  return { profit, styrSummary }
}

async function getTotalsPerPeriodMap(
  year: string | undefined,
  months: string[] | undefined
): Promise<Summary> {
  const transactions = await getTransactionsListByYearMonthGrouped({
    year,
    months,
  })

  const summaryMap: Summary = fromGroupTransactionsSummary(transactions)
  return summaryMap
}

export async function getTotalsMap() {
  debugRemix()
  const dbTimes = await getDBYearAndMonth()

  const neededPeriods = []
  for (const dbTime of dbTimes) {
    const { year } = dbTime
    for (let i = 1; i <= 12; i = i + 2) {
      neededPeriods.push({ year, months: [String(i), String(i + 1)] })
    }
  }
  const promises = neededPeriods.map(async ({ year, months }) => {
    const grouped = await getTransactionsListByYearMonthGrouped({
      year: String(year),
      months,
    })
    const summary = fromGroupTransactionsSummary(grouped)
    const StyrSummary = mapToStyrSummary(summary)

    return { year, months, summary, StyrSummary }
  })

  const summaryMaps = await Promise.all(promises)

  return summaryMaps
}

function fromGroupTransactionsSummary(
  transactions: TransactionsGrouped[]
): Summary {
  return transactions.reduce(
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
}
