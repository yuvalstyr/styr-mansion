import { format } from "date-fns"

export function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop)
}

function monthStrToInt(month: string): number {
  return months.indexOf(month) + 1
}

export const monthsPeriodObj = {
  1: "jan-feb",
  3: "mar-apr",
  5: "may-jun",
  7: "jul-aug",
  9: "sep-oct",
  11: "nov-dec",
}

export function convertMonthToMonthPeriod(month: number): string {
  const checkedMonth = month % 2 === 0 ? month - 1 : month
  return checkedMonth < 10 ? `0${checkedMonth}` : `${checkedMonth}`
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

export function getLinkByYearMonthAndPath(
  year: string,
  month: string,
  path: string
) {
  return `/${year}-${month}/${path}`
}

// current link is /{year}-{month}/{path}
export function getCurrentDatePeriodPath(path: string) {
  const currentFullYear = new Date().getFullYear().toString()
  const currentMonth = new Date().getMonth() + 1
  const currentYear = currentFullYear.slice(2, 4)
  const currentMonthStr = convertMonthToMonthPeriod(currentMonth)
  return {
    link: getLinkByYearMonthAndPath(currentYear, currentMonthStr, path),
    currentYear,
    currentFullYear,
    currentMonthStr,
    currentMonth,
  }
}

// get time as param and create link to /{year}-{month}/{path}
export function getLinkByTime(time: string, path: string) {
  const [year, month] = time.split("-")
  const fullYear = year === "00" ? undefined : String(Number(year) + 2000)
  // if month is 00, then get all months, if month string is start with 0, then remove 0
  const monthFixed = month === "00" ? undefined : String(Number(month))
  const months = monthFixed
    ? [monthFixed, String(Number(monthFixed) + 1)]
    : undefined

  return {
    link: getLinkByYearMonthAndPath(year, month, path),
    fullYear,
    monthFixed,
    months,
  }
}
