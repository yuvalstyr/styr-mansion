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
    <div className="grid justify-items-center from-primary">
      <nav className="navbar bg-base-100 w-full sticky top-0 z-30">
        <div className="font-sans text-lg md:text-3xl">
          <span className="text-primary">Styr</span>
          <span className="text-base-content">Mansion</span>
        </div>
      </nav>
      <div className="w-screen h-[20vh] from-primary to-secondary bg-gradient-to-b"></div>
      <div className="text-primary-content text-2xl font-bold grid grid-cols-2 gap-4 p-6 glass w-9/12 -mt-20">
        <nav className="navbar  w-full sticky top-0 col-span-2">Dashboard</nav>
        <div className="bg-base-100 rounded-box p-20 lg:p-32">card</div>
        <div className="bg-base-100 rounded-box p-20 lg:p-32">card</div>
        <div className="bg-base-100 rounded-box p-20 lg:p-32">card</div>
        <div className="bg-base-100 rounded-box p-20 lg:p-32">card</div>
      </div>
    </div>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return <div>Uh oh. I did a whoopsies</div>
}
