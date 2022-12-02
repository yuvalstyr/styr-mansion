import { ActionArgs, json, redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import { RepeatedTransactionsForm } from "~/components/RepeatedTransactionsForm"
import { repeatedTransactions } from "~/logic/repeatedTransData"
import { TransactionInput } from "~/models/transactions.server"
import { db } from "~/utils/db.server"
import { getTransactionsFromFormData } from "~/utils/form"
import { getCurrentDatePeriodPath } from "~/utils/time"

export async function loader({ params }: ActionArgs) {
  const { time } = params
  invariant(typeof time === "string", "time must be a string")

  const [_, month] = time.split("-")
  const months = [Number(month), Number(month) + 1]
  const { currentMonthStr, currentFullYear, link } =
    getCurrentDatePeriodPath("transactions")

  // create transactions list
  const transactions = repeatedTransactions.map((t) => {
    return {
      ...t,
      month: currentMonthStr,
      year: currentFullYear,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })
  return json({ backLink: link, transactions, months })
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const transactions = getTransactionsFromFormData(formData)

  await db.transaction.createMany({
    data: transactions,
  })
  const { link } = getCurrentDatePeriodPath("transactions")
  return redirect(link)
}

export default function RepeatedRoute() {
  const data = useLoaderData<typeof loader>()
  const transactions = data.transactions?.map((t) => {
    const transaction: TransactionInput = {
      ...t,
    }
    return transaction
  })
  return (
    <div className="modal modal-open">
      <div className="w-[90vw] bg-base-100 rounded-lg">
        <RepeatedTransactionsForm
          transactions={transactions}
          backLink={data.backLink}
          months={data.months}
        />
      </div>
    </div>
  )
}
