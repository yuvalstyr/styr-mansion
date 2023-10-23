import {
  TransactionAction,
  TransactionOwner,
  TransactionType,
} from "@prisma/client"
import {
  ActionFunction,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import { TransactionsForm } from "~/components/TransactionsForm"
import { updateTransaction } from "~/models/transactions.server"
import { db } from "~/utils/db.server"
import { debugRemix } from "~/utils/debug"
import { convertMonthStrTo2CharStr } from "~/utils/form"
import { getTimeParameters } from "~/utils/time"

export async function loader({ params }: LoaderFunctionArgs) {
  const { transactionID: id, time } = params
  invariant(typeof time === "string", "time must be a string")
  const { link } = getTimeParameters(time, "transactions")
  invariant(typeof id === "string", "id must be a string")
  const transaction = await db.transaction.findFirst({ where: { id } })

  return json({ transaction, link })
}

export const action: ActionFunction = async ({ request, params }) => {
  debugRemix()
  const form = await request.formData()
  const type = form.get("type") as TransactionType
  const action = form.get("action") as TransactionAction
  const owner = form.get("owner") as TransactionOwner
  const amount = form.get("amount")
  const description = form.get("description")
  const month = form.get("month") ?? "00"
  const year = form.get("year") ?? "00"
  const id = params.transactionID
  invariant(typeof id === "string", "type must be a string")
  invariant(typeof month === "string", "month must be a string")
  invariant(typeof year === "string", "year must be a string")
  if (typeof amount !== "string" || typeof description !== "string") {
    return `Form not submitted correctly.`
  }
  await updateTransaction({
    data: {
      action: action,
      type: type,
      owner: owner,
      amount: Number(amount),
      description: description,
      month: String(Number(month)),
      year: String(Number(year)),
    },
    where: { id: id },
  })
  const monthFix = Number(month) % 2 ? month : String(Number(month) - 1)
  const redirectURL = `/${year.slice(2, 4)}-${convertMonthStrTo2CharStr(
    monthFix
  )}/transactions`
  return redirect(redirectURL)
}
// TODO check how to make error boundary as outlet

export default function UpdateTransactionRoute() {
  const data = useLoaderData<typeof loader>()
  const { transaction, link } = data

  if (!transaction) {
    return (
      <div>
        <div>Transaction not found</div>
      </div>
    )
  }
  const t = {
    ...transaction,
    createdAt: new Date(transaction.createdAt),
    updatedAt: new Date(transaction.updatedAt),
  }

  return (
    <div className="relative p-10 m-6 bg-base-100 rounded-box">
      <div className="text-[length:32px] font-bold">Update Transactions</div>
      <TransactionsForm transaction={t} link={link} />
      <Outlet />
    </div>
  )
}
