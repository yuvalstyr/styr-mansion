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
