import { TransactionOwner } from "@prisma/client"
import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { v4 as uuid } from "uuid"
import { GoToIcon } from "~/components/components"
import { MORAN_RAN, getTotalsMap } from "~/logic/cost-balancer"
import {
  convertMonthToMonthPeriod,
  getCurrentDatePeriodPath,
  getMonthValueByName,
} from "~/utils/time"
import { NavBar } from "../components/NavBar"

type unbalanced = {
  year: string
  month: string
  owner: string
  remains: string
}

type totals = {
  [key: string]: number
}

export const loader = async () => {
  // current link is /{year}-{month}/transactions
  const { link: currentLinkPath } = getCurrentDatePeriodPath("transactions")
  //  calc remaining for all time
  const summaryMaps = await getTotalsMap()
  const unbalanced: { [key: string]: { [key: string]: unbalanced } } = {}
  const totals: totals = { [MORAN_RAN]: 0, [TransactionOwner.Yuval]: 0 }
  for (let summary of summaryMaps) {
    const month = summary.months[0]
    const year = summary.year
    const period = `${getMonthValueByName(Number(month))}`
    const yearPeriod = `${year}-${period}`
    const styrSummary = summary.StyrSummary.styrSummary
    const ranMoran = styrSummary[MORAN_RAN]
    const yuval = styrSummary[TransactionOwner.Yuval]
    let yuvalRemains = Number(yuval.remains.toFixed(0))
    let ranMoranRemains = Number(ranMoran.remains.toFixed(0))
    //add a check if yuval or ranMoran remains are between -2 to 2, it's considered 0
    if (yuvalRemains > -2 && yuvalRemains < 2) {
      yuvalRemains = 0
    }

    if (ranMoran.remains < -2 && ranMoran.remains > 2) {
      ranMoran.remains = 0
    }

    if (yuvalRemains || ranMoranRemains) {
      if (!unbalanced[yearPeriod]) {
        unbalanced[yearPeriod] = {}
      }
    }

    if (ranMoranRemains) {
      unbalanced[yearPeriod][MORAN_RAN] = {
        year,
        month,
        owner: MORAN_RAN,
        remains: ranMoran.remains.toFixed(0),
      }
      totals[MORAN_RAN] += ranMoranRemains
    }
    if (yuvalRemains) {
      unbalanced[yearPeriod][TransactionOwner.Yuval] = {
        year,
        month,
        owner: TransactionOwner.Yuval,
        remains: yuval.remains.toFixed(0),
      }
      totals[TransactionOwner.Yuval] += yuvalRemains
    }
  }

  return json({ unbalanced, currentLinkPath, totals })
}

export default function StatisticRoute() {
  const { unbalanced, currentLinkPath, totals } = useLoaderData<typeof loader>()
  console.log({ unbalanced, totals })
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
              <th>{MORAN_RAN}</th>
              <th>Yuval</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(unbalanced).map((key) => {
              const moranRan = unbalanced[key][MORAN_RAN] as unbalanced
              const yuval = unbalanced[key][
                TransactionOwner.Yuval
              ] as unbalanced
              const monthInt = Number(
                moranRan?.month !== undefined ? moranRan?.month : 1
              )
              const period = getMonthValueByName(monthInt)
              return (
                <tr key={uuid()}>
                  <td>
                    <div className="button stat-figure text-secondary">
                      <Link
                        to={`/${moranRan?.year.slice(
                          2,
                          4
                        )}-${convertMonthToMonthPeriod(monthInt)}/transactions`}
                      >
                        <GoToIcon />
                      </Link>
                    </div>
                  </td>
                  <td>{moranRan?.year}</td>
                  <td>{period}</td>
                  <td
                    className={`${
                      Number(moranRan?.remains) < 0
                        ? "text-error"
                        : "text-success"
                    }`}
                  >
                    {moranRan?.remains ?? 0}
                  </td>
                  <td
                    className={`${
                      Number(yuval?.remains) < 0 ? "text-error" : "text-success"
                    }`}
                  >
                    {yuval?.remains ?? 0}
                  </td>
                </tr>
              )
            })}
            <tr>
              <td>Summary</td>
              <td></td>
              <td></td>
              <td
                className={`${
                  Number(totals[MORAN_RAN]) < 0 ? "text-error" : "text-success"
                }`}
              >
                {totals[MORAN_RAN]}
              </td>
              <td
                className={`${
                  Number(totals[TransactionOwner.Yuval]) < 0
                    ? "text-error"
                    : "text-success"
                }`}
              >
                {totals[TransactionOwner.Yuval]}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
