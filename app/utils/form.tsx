import {
  TransactionAction,
  TransactionOwner,
  TransactionType,
} from "@prisma/client"
import { format, getYear } from "date-fns"

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

export function getTimePeriodList() {
  return Object.values(monthObj)
}

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

export const itemsYear = ["2020", "2021", "2022", "2023", "2024", "2025"]

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
  const date = new Date(yearInput ? Number(yearInput) : 2022, +monthInput, 1)

  if (month === "00" && year === "00") {
    title = "All"
  }
  if (month !== "00" && year !== "00") {
    title = format(date, "MMMM yyyy")
  }

  if (year === "00") {
    title = format(date, "MMMM")
  }
  if (month === "00") {
    title = format(date, "yyyy")
  }

  return { title, yearInput }
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

export { getOptions, monthStrToInt, getFormTitle }
