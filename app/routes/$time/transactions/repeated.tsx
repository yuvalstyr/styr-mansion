import { ActionArgs, json, redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import { RepeatedTransactionsForm } from "~/components/RepeatedTransactionsForm"
import { repeatedTransactions } from "~/logic/repeatedTransData"
import { db } from "~/utils/db.server"
import { debugRemix } from "~/utils/debug"
import { getTransactionsFromFormData } from "~/utils/form"
import { getLinkByTime } from "~/utils/time"

export async function loader({ params }: ActionArgs) {
  debugRemix()
  const { time } = params
  invariant(typeof time === "string", "time must be a string")

  const [_, month] = time.split("-")
  const months = [Number(month), Number(month) + 1]
  const { link, fullYear, monthFixed } = getLinkByTime(time, "transactions")
  invariant(typeof fullYear === "string", "fullYear must be a string")
  invariant(typeof monthFixed === "string", "monthFixed must be a string")

  // create transactions list
  const transactions = repeatedTransactions.map((t) => {
    return {
      ...t,
      month: monthFixed,
      year: fullYear,
    }
  })
  return json({ backLink: link, transactions, months })
}

export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData()
  const transactions = getTransactionsFromFormData(formData)
  const { time } = params
  invariant(typeof time === "string", "time must be a string")

  await db.transaction.createMany({
    data: transactions,
  })
  const { link } = getLinkByTime(time, "transactions")
  return redirect(link)
}

export default function RepeatedRoute() {
  const data = useLoaderData<typeof loader>()
  const transactions = data.transactions

  return (
    <div className="modal modal-open">
      <div className="w-[90vw] bg-base-100 rounded-lg">
        <RepeatedTransactionsForm
          transactions={transactions}
          backLink={data.backLink}
          months={data.months}
          redirectLink={data.backLink}
        />
      </div>
    </div>
  )
}
