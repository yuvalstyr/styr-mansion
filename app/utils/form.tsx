import {
  TransactionAction,
  TransactionOwner,
  TransactionType,
} from "@prisma/client"
import { format, getYear } from "date-fns"

type TransactionsEnum = "ACTION" | "TYPE" | "OWNER" | "MONTH" | "YEAR"
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

export { getOptions }
