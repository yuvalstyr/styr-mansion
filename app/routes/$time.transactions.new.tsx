import {
  TransactionAction,
  TransactionOwner,
  TransactionType,
} from "@prisma/client"
import { ActionFunction, json, LoaderArgs } from "@remix-run/node"
import { useLoaderData, useNavigation } from "@remix-run/react"
import invariant from "tiny-invariant"
import { TransactionsForm } from "~/components/TransactionsForm"
import {
  createTransaction,
  deleteTransaction,
} from "~/models/transactions.server"
import { convertMonthStrTo2CharStr } from "~/utils/form"
import { getTimeParameters } from "~/utils/time"

export async function loader({ params }: LoaderArgs) {
  const { time } = params
  invariant(typeof time === "string", "time must be a string")
  const { year, month, link } = getTimeParameters(time, "transactions")

  return json({ year, month, link })
}
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const intent = formData.get("intent")

  switch (intent) {
    case "create-transaction":
      const type = formData.get("type") as TransactionType
      invariant(typeof type === "string", "type must be a string")
      const action = formData.get("action") as TransactionAction
      invariant(typeof action === "string", "action must be a string")
      const owner = formData.get("owner") as TransactionOwner
      invariant(typeof owner === "string", "owner must be a string")
      const amount = formData.get("amount")
      invariant(typeof amount === "string", "amount must be a string")
      const description = formData.get("description")
      invariant(typeof description === "string", "description must be a string")
      const month = formData.get("month")
      invariant(typeof month === "string", "month must be a string")
      const year = formData.get("year")
      invariant(typeof year === "string", "year must be a string")
      if (typeof amount !== "string" || typeof description !== "string") {
        return `Form not submitted correctly.`
      }
      await createTransaction({
        action,
        type,
        owner,
        amount: Number(amount),
        description,
        month: month,
        year: year,
      })
      const monthFix = Number(month) % 2 ? month : String(Number(month) - 1)
      const redirectURL = `/${year.slice(2, 4)}-${convertMonthStrTo2CharStr(
        monthFix
      )}/transactions`
      return null

    case "delete-transaction":
      const id = formData.get("id") as string
      invariant(typeof id === "string", "id must be a string")
      const transaction = await deleteTransaction(id)

      return json(transaction)

    default: {
      throw new Error(`Unsupported intent: ${intent}`)
    }
  }
}

export default function TransactionsRoute() {
  const data = useLoaderData<typeof loader>()
  const transition = useNavigation()
  const isBusy = transition.state === "submitting"

  return (
    <div className="relative p-10 m-6 bg-base-100 rounded-box">
      <div className="text-[length:32px] font-bold">New Transaction</div>
      <TransactionsForm month={data.month} year={data.year} link={data.link} />
    </div>
  )
}
