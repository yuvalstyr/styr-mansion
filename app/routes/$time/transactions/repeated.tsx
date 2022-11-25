import { Transaction } from "@prisma/client"
import { ActionArgs, json, redirect } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { RepeatedTransactionsList } from "~/components/RepeatedTransactionsList"
import { repeatedTransactions } from "~/logic/repeatedTransactions"
import { db } from "~/utils/db.server"
import { getTransactionsFromFormData } from "~/utils/form"
import { convertMonthToMonthPeriod, getCurrentPeriodPath } from "~/utils/time"

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const transactions = getTransactionsFromFormData(formData)

  await db.transaction.createMany({
    data: transactions,
  })
  return redirect(getCurrentPeriodPath("transactions"))
}

export async function loader() {
  const currentLinkPath = getCurrentPeriodPath("transactions")
  const currentFullYear = new Date().getFullYear().toString()
  const currentMonth = new Date().getMonth() + 1
  const currentMonthStr = convertMonthToMonthPeriod(currentMonth)

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
  return json({ backLink: currentLinkPath, transactions })
}

export default function RepeatedRoute() {
  const data = useLoaderData<typeof loader>()
  const transactions = data.transactions?.map((t) => {
    const transaction: Transaction = {
      ...t,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt),
    }
    return transaction
  })
  return (
    <div className="modal modal-open">
      <div className="w-[90vw] bg-base-100 rounded-lg">
        <div className="modal-action">
          <Link to={data.backLink}>
            <button className="btn btn-primary">X</button>
          </Link>
        </div>
        <RepeatedTransactionsList transactions={transactions} />
      </div>
    </div>
  )
}
