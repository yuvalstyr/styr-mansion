import {
  TransactionAction,
  TransactionOwner,
  TransactionType,
} from "@prisma/client"
import { ActionFunction, LoaderArgs, redirect } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import { TransactionsForm } from "~/components/TransactionsForm"
import { updateTransaction } from "~/models/transactions.server"
import { db } from "~/utils/db.server"
import { convertMonthStrTo2CharStr } from "~/utils/form"

export async function loader({ params }: LoaderArgs) {
  const id = params.transactionID
  const transaction = await db.transaction.findFirst({ where: { id } })
  if (!transaction) {
    return { transaction: null }
  }
  return { transaction }
}

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData()
  const type = form.get("type") as TransactionType
  const action = form.get("action") as TransactionAction
  const owner = form.get("owner") as TransactionOwner
  const amount = form.get("amount")
  const description = form.get("description")
  const month = form.get("month") ?? "00"
  const year = form.get("year") ?? "00"
  const id = params.transactionID
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
    where: { id: id ?? "" },
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
  const { transaction } = data

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
      <TransactionsForm transaction={t} />
      <Outlet />
    </div>
  )
}
