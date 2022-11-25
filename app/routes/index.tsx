import { TransactionOwner } from "@prisma/client"
import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { GoToIcon } from "~/components/components"
import { getTotalsMap, MORAN_RAN } from "~/logic/cost-balancer"
import {
  convertMonthToMonthPeriod,
  getCurrentDatePeriodPath,
  getMonthValueByName,
} from "~/utils/time"
import { NavBar } from "../components/NavBar"

export const loader = async () => {
  // current link is /{year}-{month}/transactions
  const { link: currentLinkPath } = getCurrentDatePeriodPath("transactions")
  //  calc remaining for all time
  const summaryMaps = await getTotalsMap()
  const unbalanced = []
  for (let summary of summaryMaps) {
    const month = summary.months[0]
    const year = summary.year
    const styrSummary = summary.StyrSummary.styrSummary
    const ranMoran = styrSummary[MORAN_RAN]
    const yuval = styrSummary[TransactionOwner.Yuval]
    const yuvalRemains = Number(yuval.remains.toFixed(0))
    const moranRemains = Number(ranMoran.remains.toFixed(0))

    if (moranRemains) {
      unbalanced.push({
        year,
        month,
        owner: MORAN_RAN,
        remains: ranMoran.remains.toFixed(0),
      })
    }
    if (yuvalRemains) {
      unbalanced.push({
        year,
        month,
        owner: TransactionOwner.Yuval,
        remains: yuval.remains.toFixed(0),
      })
    }
  }

  return json({ unbalanced, currentLinkPath })
}

export default function StatisticRoute() {
  const { unbalanced, currentLinkPath } = useLoaderData<typeof loader>()

  return (
    <div className="grid justify-items-center from-primary">
      <NavBar transactionsLink={currentLinkPath} />
      <div className="w-screen h-[20vh] from-primary to-secondary bg-gradient-to-b"></div>
      <div className="text-primary-content text-2xl font-bold grid grid-cols-2 gap-4 p-6 glass w-9/12 -mt-20">
        <nav className="navbar  w-full sticky top-0 col-span-2">
          Remains Balance
        </nav>
        <table className="table bg-base-100 rounded-lg w-full">
          <thead>
            <tr>
              <th></th>
              <th>Year</th>
              <th>Period</th>
              <th>Owner</th>
              <th>Unbalanced</th>
            </tr>
          </thead>
          <tbody>
            {unbalanced.map((item) => {
              const monthInt = Number(item.month)
              const period = getMonthValueByName(monthInt)
              const isDebt = Number(item.remains) < 0
              return (
                <tr key={period + item.owner}>
                  <td>
                    <div className="button stat-figure text-secondary">
                      <Link
                        to={`/${item.year.slice(
                          2,
                          4
                        )}-${convertMonthToMonthPeriod(monthInt)}/transactions`}
                      >
                        <GoToIcon />
                      </Link>
                    </div>
                  </td>
                  <td>{item.year}</td>
                  <td>{period}</td>
                  <td>{item.owner}</td>
                  <td className={`${isDebt ? "text-error" : "text-success"}`}>
                    {item.remains}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return <div>Uh oh. I did a whoopsies</div>
}
