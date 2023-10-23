import { ActionFunctionArgs, json, redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import { RepeatedTransactionsForm } from "~/components/RepeatedTransactionsForm"
import { repeatedTransactions } from "~/logic/repeatedTransData"
import { db } from "~/utils/db.server"
import { getTransactionsFromFormData } from "~/utils/form"
import { getTimeParameters } from "~/utils/time"

export async function loader({ params }: ActionFunctionArgs) {
  const { time } = params
  invariant(typeof time === "string", "time must be a string")
  const { link, year, month, months } = getTimeParameters(time, "transactions")
  invariant(typeof months === "object", "months must be an array")
  invariant(typeof year === "string", "year must be a string")
  invariant(typeof month === "string", "month must be a string")
  // create transactions list
  const transactions = repeatedTransactions.map((t) => {
    return {
      ...t,
      month,
      year,
    }
  })
  return json({ backLink: link, transactions, months })
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData()
  const transactions = getTransactionsFromFormData(formData)
  const { time } = params
  invariant(typeof time === "string", "time must be a string")

  await db.transaction.createMany({
    data: transactions,
  })
  const { link } = getTimeParameters(time, "transactions")
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
