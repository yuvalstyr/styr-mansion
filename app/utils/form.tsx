import {
  TransactionAction,
  TransactionOwner,
  TransactionType,
} from "@prisma/client"
import { add, format } from "date-fns"

function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop)
}

export const monthsPeriodObj = {
  1: "january-february",
  3: "march-april",
  5: "may-june",
  7: "july-august",
  9: "september-october",
  11: "november-december",
}

export function getMonthsPeriodByMonth(monthInput: string) {
  const monthInt = Number(monthInput)
  const month = monthInt % 2 === 0 ? monthInt - 1 : monthInt
  return getMonthValueByName(month)
}

export function formatMonth(month: string): string {
  return format(new Date(2022, Number(month) - 1, 1), "MMMM")
}

export const months = Array.from(new Array(12), (_, i) => {
  return format(new Date(2022, i * 2, 1), "LLLL")
})

export function getMonthValueByName(monthInput: number) {
  if (hasOwnProperty(monthsPeriodObj, monthInput)) {
    const month = monthsPeriodObj[monthInput] as string
    return month
  }
  return undefined
}

export type TransactionsEnum =
  | "ACTION"
  | "TYPE"
  | "OWNER"
  | "MONTH"
  | "YEAR"
  | "MONTH_PERIOD"

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
