import { TransactionOwner, TransactionType } from "@prisma/client"
import { getTransactionsListByYearMonthGrouped } from "~/models/transactions.server"

const MORAN_RAN = TransactionOwner.Moran + "+" + TransactionOwner.Ran

export type TenantBalance = {
  total_profit: number
  Tenant: {
    total_rent: number
    total_expenses: number
  }
}
export type StyrBalance = {
  [x: string]: {
    profit: number
    withdrawal: number
    expense: number
    remains: number
  }
}

export async function getPeriodBalance({
  year,
  months,
}: {
  year: string | undefined
  months: string[] | undefined
}) {
  //  get all transaction per period
  const balanceMap = await getTotalsPerPeriodMap(year, months)
  //  cost per period
  const costPerPeriod =
    balanceMap.EXPENSE[MORAN_RAN] +
    balanceMap.EXPENSE[TransactionOwner.Yuval] +
    balanceMap.EXPENSE[TransactionOwner.Tenant]
  const profit = balanceMap.DEPOSIT.all - costPerPeriod

  // todo check the proportion

  //  balance expenses between yuval and moranran
  const balanceMoranRan = balanceMap.EXPENSE[MORAN_RAN] * 0.413
  const balanceYuval = balanceMap.EXPENSE[TransactionOwner.Yuval] * 0.587

  //  balance withdrawal between yuval and moranran
  const difference = balanceYuval - balanceMoranRan

  const profitYuval = profit * 0.413 + difference
  const profitMoranRan = profit * 0.587 - difference

  const styrBalance: StyrBalance = {
    [MORAN_RAN]: {
      profit: profitMoranRan,
      withdrawal: balanceMap.WITHDRAWAL[MORAN_RAN],
      expense: balanceMap.EXPENSE[MORAN_RAN],
      remains: profitMoranRan - balanceMap.WITHDRAWAL[MORAN_RAN],
    },
    [TransactionOwner.Yuval]: {
      profit: profitYuval,
      withdrawal: balanceMap.WITHDRAWAL[TransactionOwner.Yuval],
      expense: balanceMap.EXPENSE[TransactionOwner.Yuval],
      remains: profitYuval - balanceMap.WITHDRAWAL[TransactionOwner.Yuval],
    },
  }
  const tenantBalance: TenantBalance = {
    total_profit: profit,
    [TransactionOwner.Tenant]: {
      total_rent: balanceMap.DEPOSIT.all,
      total_expenses: balanceMap.EXPENSE[TransactionOwner.Tenant],
    },
  }

  return { styrBalance, tenantBalance }
}

type Balance = {
  [key in TransactionType]: { [key: string]: number }
}

type Sum = { [key: string]: number }
async function getTotalsPerPeriodMap(
  year: string | undefined,
  months: string[] | undefined
) {
  const transactions = await getTransactionsListByYearMonthGrouped({
    year,
    months,
  })

  const balanceMap: Balance = transactions.reduce(
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
            case (TransactionOwner.Moran, TransactionOwner.Ran):
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
    } as Balance
  )
  return balanceMap
}
