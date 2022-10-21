import { LoaderFunction, redirect } from "@remix-run/node"
import { convertMonthToMonthPeriod } from "~/utils/time"

export const loader: LoaderFunction = async ({}) => {
  const currentYear = new Date().getFullYear().toString()
  const currentMonth = new Date(2022, 10, 1).getMonth()
  const currentMonthStr = convertMonthToMonthPeriod(currentMonth)
  return redirect(`/${currentYear.slice(2, 4)}-${currentMonthStr}/transactions`)
}

export default function StatisticRoute() {
  return (
    <div>
      <h1>You are not suppose to be here!!!!! 🤔🤔🤔🤔🛑🛑🛑</h1>
    </div>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return <div>Uh oh. I did a whoopsies</div>
}
