import {
  TransactionAction,
  TransactionOwner,
  TransactionType,
} from "@prisma/client"
import { format, getYear } from "date-fns"

export const months = Array.from(new Array(12), (_, i) =>
  format(new Date(2022, i, 1), "LLLL")
)

export const itemsYear = ["2020", "2021", "2022", "2023", "2024", "2025"]

type TransactionsEnum = "ACTION" | "TYPE" | "OWNER" | "MONTH" | "YEAR"

function monthStrToInt(month: string): number {
  return months.indexOf(month) + 1
}

function getOptions(enumType: TransactionsEnum) {
  switch (enumType) {
    case "ACTION":
      return Object.values(TransactionAction).map((key) => (
        <option key={key} value={key}>
          {key}
        </option>
      ))
    case "TYPE":
      return Object.values(TransactionType).map((key) => (
        <option key={key} value={key}>
          {key}
        </option>
      ))
    case "OWNER":
      return Object.values(TransactionOwner).map((key) => (
        <option key={key} value={key}>
          {key}
        </option>
      ))
    case "MONTH":
      const monthArray = Array.from({ length: 12 }, (_, i) => i + 1)
      return monthArray.map((month) => {
        const date = new Date(2020, month, 0)
        const monthName = format(date, "LLLL")

        return (
          <option key={month} value={month}>
            {monthName}
          </option>
        )
      })
    case "YEAR":
      const currentYear = getYear(new Date())
      const length = currentYear - 2020
      const yearArray = Array.from({ length }, (_, i) => i + 2022)
      return yearArray.map((year) => {
        return (
          <option key={year} value={year}>
            {year}
          </option>
        )
      })
    default:
      break
  }
}

export { getOptions, monthStrToInt }
