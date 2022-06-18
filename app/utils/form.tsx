import {
  TransactionAction,
  TransactionOwner,
  TransactionType,
} from "@prisma/client"
import { add, format } from "date-fns"
import { monthsPeriodObj } from "./time"

export type TransactionsEnum =
  | "ACTION"
  | "TYPE"
  | "OWNER"
  | "MONTH"
  | "YEAR"
  | "MONTH_PERIOD"

type FormProps = {
  month: string
  year: string
}

export type FormTitleResponse = {
  title: string
  yearInput: string | undefined
  monthInput: string | undefined
}

export function convertMonthIntToStr(month: string) {
  return month ? (Number(month) < 10 ? `0${month}` : month) : "00"
}

export function getTimeSelectFormProps({
  month,
  year,
}: FormProps): FormTitleResponse {
  const yearInput = year === "00" ? undefined : 20 + year
  const monthInput = month === "00" ? undefined : month
  let title = `${year}: ${month}`
  // if year or month are undefined, give them a default value
  const date = new Date(
    yearInput ? Number(yearInput) : 2022,
    Number(monthInput ?? 1),
    0
  )

  if (!monthInput && !yearInput) {
    return { title: "all", yearInput, monthInput }
  }
  if (monthInput && yearInput) {
    const nextMonthFormat = format(add(date, { months: 1 }), "MMMM")
    const thisMonthFormat = format(date, "MMMM")
    title = `${thisMonthFormat}&${nextMonthFormat} ${year} Summary`
    return { title, yearInput, monthInput }
  }
  if (!yearInput) {
    const nextMonthFormat = format(add(date, { months: 1 }), "MMMM")
    const thisMonthFormat = format(date, "MMMM")
    title = `${thisMonthFormat}&${nextMonthFormat}  Summary for all years`

    return { title, yearInput, monthInput }
  }
  if (!monthInput) {
    title = `${year} Summary`
    return { title, yearInput, monthInput }
  }

  return { title: "No good", yearInput: undefined, monthInput: undefined }
}

export function getOptions(enumType: TransactionsEnum) {
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
    case "MONTH_PERIOD":
      return Object.entries(monthsPeriodObj).map(([value, month]) => {
        return (
          <option key={month} value={value}>
            {month}
          </option>
        )
      })
    case "MONTH":
      // loop over number of months and return month name
      return Array.from({ length: 12 }, (_, i) => i).map((month) => {
        return (
          <option key={month} value={month + 1}>
            {format(new Date(2022, month, 1), "MMMM")}
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
