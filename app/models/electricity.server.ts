import { db } from "~/utils/db.server"

export async function getLastMonthMeasurements(month: string, year: string) {
  const lastMonth = month === "1" ? "11" : String(Number(month) - 2)
  const lastYear = month === "1" ? String(Number(year) - 1) : year

  return await db.electricity.findFirst({
    where: {
      month: lastMonth,
      year: lastYear,
    },
  })
}
