import {
  TransactionAction,
  TransactionOwner,
  TransactionType,
} from "@prisma/client"
import { add, format } from "date-fns"
import invariant from "tiny-invariant"
import { repeatedTransactions } from "~/logic/repeatedTransData"
import { TransactionInput } from "~/models/transactions.server"
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

//  function convert month number to first string of a period
export function convertMonthIntToFirstPeriodMonth(month: string) {
  const monthInt = Number(month)
  const monthPeriod = monthInt % 2 === 0 ? monthInt - 1 : monthInt

  return convertMonthIntTo2CharStr(monthPeriod)
}

export function convertMonthIntTo2CharStr(month: number) {
  return month < 10 ? `0${month}` : month
}

export function convertYearIntToFullYearStr(year: string | undefined) {
  return year ? String(Number(year) + 2000) : getCurrentYear()
}

export function convertMonthStrTo2CharStr(month: string) {
  return month ? (Number(month) < 10 ? `0${month}` : month) : "00"
}
//  get current year
export function getCurrentYear() {
  return format(new Date(), "yyyy")
}

//  get current month
export function getCurrentMonth() {
  return format(new Date(), "MM")
}

//  get month or if month null return current month
export function getMonthIndex(month: string | undefined) {
  const monthName = month
    ? format(new Date(`2021-${month}-01`), "M")
    : format(new Date(), "M")

  return monthName
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
    const nextMonthFormat = format(add(date, { months: 1 }), "MMM")
    const thisMonthFormat = format(date, "MMM")
    title = `${thisMonthFormat}-${nextMonthFormat} Of ${year} Summary`
    return { title, yearInput, monthInput }
  }
  if (!yearInput) {
    const nextMonthFormat = format(add(date, { months: 1 }), "MMM")
    const thisMonthFormat = format(date, "MMM")
    title = `${thisMonthFormat}&${nextMonthFormat}  Summary for all years`

    return { title, yearInput, monthInput }
  }
  if (!monthInput) {
    title = `${year} Summary`
    return { title, yearInput, monthInput }
  }

  return { title: "No good", yearInput: undefined, monthInput: undefined }
}

export function getOptions(enumType: TransactionsEnum, withEmpty = false) {
  let options = []
  switch (enumType) {
    case "ACTION":
      options = Object.values(TransactionAction).map((key) => (
        <option key={key} value={key}>
          {key}
        </option>
      ))
      if (withEmpty) {
        options.unshift(<option key="empty" value=""></option>)
      }
      return options
    case "TYPE":
      options = Object.values(TransactionType).map((key) => (
        <option key={key} value={key}>
          {key}
        </option>
      ))
      if (withEmpty) {
        options.unshift(<option key="empty" value=""></option>)
      }
      return options
    case "OWNER":
      options = Object.values(TransactionOwner).map((key) => (
        <option key={key} value={key}>
          {key}
        </option>
      ))
      if (withEmpty) {
        options.unshift(<option key="empty" value=""></option>)
      }
      return options
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
          <option key={month + 1} value={month + 1}>
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

//  transform the big form to rows array per transaction
export function getTransactionsFromFormData(
  data: FormData
): TransactionInput[] {
  const rows = []
  //  loop over the number of repeated transactions
  const includes = []
  for (let i = 0; i < repeatedTransactions.length; i++) {
    includes[i] = data.get(`include-${i}`) ? "on" : "off"
  }
  const types = data.getAll("type")
  const actions = data.getAll("action")
  const owners = data.getAll("owner")
  const amounts = data.getAll("amount")
  const descriptions = data.getAll("description")
  const years = data.getAll("year")
  const monthSelect = data.get("month-select")
  invariant(monthSelect, "monthSelect is required")

  for (let i = 0; i < types.length; i++) {
    const include = includes[i] === "on"
    const type = types[i].toString()
    const action = actions[i].toString()
    const owner = owners[i].toString()
    const amount = amounts[i].toString()
    const description = descriptions[i].toString()
    const month = monthSelect.toString()
    const year = years[i].toString()
    if (type && action && owner && amount && description) {
      rows.push({
        include,
        type,
        action,
        owner,
        amount,
        description,
        month,
        year,
      })
    }
  }
  const filteredRows = rows.filter((row) => row.include)
  const transactions = filteredRows.map((row) => {
    const { type, action, owner, amount, description, month, year } = row
    return {
      type: type,
      action: action,
      owner: owner,
      amount: Number(amount),
      description: description,
      month: month,
      year: year,
    }
  }) as TransactionInput[]
  return transactions
}
