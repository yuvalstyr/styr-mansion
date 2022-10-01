import { Heading, VStack } from "@chakra-ui/react"
import {
  Transaction,
  TransactionAction,
  TransactionOwner,
  TransactionType,
} from "@prisma/client"
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import { TransactionsForm } from "~/components/TransactionsForm"
import { updateTransaction } from "~/models/transactions.server"
import { db } from "~/utils/db.server"
import { convertMonthIntToStr } from "~/utils/form"

type LoaderData = { transactions: Transaction }
export const loader: LoaderFunction = async ({ params }) => {
  const id = params.transactionID
  const transactions = await db.transaction.findFirst({ where: { id } })
  if (!transactions) {
    return { transactions: null }
  }
  return { transactions }
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
  return redirect(
    `/${year.slice(2, 4)}-${convertMonthIntToStr(monthFix)}/transactions`
  )
}
// TODO change form inputs to be generic: if have a default value or not will be the only difference between the two forms: update and new
// TODO check how to make error boundary as outlet

export default function UpdateTransactionRoute() {
  const data = useLoaderData<LoaderData>()
  const { transactions: t } = data
  if (!t) {
    return (
      <VStack>
        <Heading>Transaction not found</Heading>
      </VStack>
    )
  }
  return (
    <VStack>
      <Heading>Update Transactions</Heading>
      <TransactionsForm transactions={t} />
      <Outlet />
    </VStack>
  )
}
