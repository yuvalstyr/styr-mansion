import { LoaderFunction } from "@remix-run/node"
import { convertMonthToMonthPeriod } from "~/utils/time"

export const loader: LoaderFunction = async ({}) => {
  const currentYear = new Date().getFullYear().toString()
  const currentMonth = new Date(2022, 10, 1).getMonth()
  const currentMonthStr = convertMonthToMonthPeriod(currentMonth)
  return null
}

export default function StatisticRoute() {
  return (
    <div>
      <h1>Welcome to Styr Mansion!!!</h1>
      <div className="hero-content">
        <img src="/house.png" />
      </div>
    </div>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return <div>Uh oh. I did a whoopsies</div>
}
