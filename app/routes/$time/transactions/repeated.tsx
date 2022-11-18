import { json, LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { convertMonthToMonthPeriod } from "~/utils/time"

export async function loader(data: LoaderArgs) {
  const currentFullYear = new Date().getFullYear().toString()
  const currentYear = currentFullYear.slice(2, 4)
  const currentMonth = new Date().getMonth() + 1
  const currentMonthStr = convertMonthToMonthPeriod(currentMonth)
  const currentLinkPath = `/${currentYear}-${currentMonthStr}/transactions`
  return json({ backLink: currentLinkPath })
}

export default function TransactionsRoute() {
  const { backLink } = useLoaderData<typeof loader>()
  return (
    <div className="modal modal-open">
      <div className="modal-box border">
        <h3 className="text-lg font-bold">
          Congratulations random Internet user!
        </h3>
        <p className="py-4">
          You've been selected for a chance to get one year of subscription to
          use Wikipedia for free!
        </p>
        <div className="modal-action">
          <Link to={backLink}>
            <button className="btn btn-primary">Back</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
