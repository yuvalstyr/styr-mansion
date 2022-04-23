import {
  TransactionAction,
  TransactionOwner,
  TransactionType,
} from "@prisma/client"
import { add, format } from "date-fns"

export const monthObj = {
  1: "january-february",
  3: "march-april",
  5: "may-june",
  7: "july-august",
  9: "september-october",
  11: "november-december",
}

export const months = Array.from(new Array(6), (_, i) => {
  return format(new Date(2022, i * 2, 1), "LLLL")
})

function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop)
}

export function getMonthValueByName(monthInput: M) {
  if (hasOwnProperty(monthObj, monthInput)) {
    return monthObj[monthInput]
  }
  return undefined
}

export type TransactionsEnum = "ACTION" | "TYPE" | "OWNER" | "MONTH" | "YEAR"

function monthStrToInt(month: string): number {
  return months.indexOf(month) + 1
}

type FormProps = {
  month: string
  year: string
}

export type FormTitleResponse = {
  title: string
  yearInput: string | undefined
}

function getFormTitle({ month, year }: FormProps): FormTitleResponse {
  const yearInput = year === "00" ? undefined : 20 + year
  const monthInput = month === "00" ? "01" : month
  let title = `${year}: ${month}`
  const date = new Date(yearInput ? Number(yearInput) : 2022, +monthInput, 0)

  if (month === "00" && year === "00") {
    return { title: "all", yearInput }
  }
  console.log("month :>> ", { month, year })
  if (month !== "00" && year !== "00") {
    const nextMonthFormat = format(add(date, { months: 1 }), "MMMM")
    const thisMonthFormat = format(date, "MMMM")
    title = `${thisMonthFormat}&${nextMonthFormat} ${year} Summary`
    return { title, yearInput }
  }

  if (year === "00") {
    const nextMonthFormat = format(add(date, { months: 1 }), "MMMM")
    const thisMonthFormat = format(date, "MMMM")
    title = `${thisMonthFormat}&${nextMonthFormat}  Summary for all years`

    return { title, yearInput }
  }
  if (month === "00") {
    title = `${year} Summary`
    return { title, yearInput }
  }

  return { title: "No good", yearInput }
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
      return Object.entries(monthObj).map(([value, month]) => {
        return (
          <option key={month} value={value}>
            {month}
          </option>
        )
      })
    case "YEAR":
      const currentYear = new Date().getFullYear()
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

export { getOptions, monthStrToInt, getFormTitle }
