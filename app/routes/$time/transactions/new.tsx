import { Heading, VStack } from "@chakra-ui/react"
import {
  TransactionAction,
  TransactionOwner,
  TransactionType,
} from "@prisma/client"
import { ActionFunction, redirect } from "remix"
import invariant from "tiny-invariant"
import { TransactionsForm } from "~/components/Form"
import { createTransaction } from "~/models/transactions.server"
import { convertMonthIntToStr } from "~/utils/form"

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const type = form.get("type") as TransactionType
  const action = form.get("action") as TransactionAction
  const owner = form.get("owner") as TransactionOwner
  const amount = form.get("amount")
  const description = form.get("description")
  const month = form.get("month")
  const year = form.get("year")
  invariant(typeof month === "string", "month must be a string")
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

  return redirect(
    `${year.slice(2, 4)}-${convertMonthIntToStr(monthFix)}/transactions`
  )
}

export default function NewTransactionRoute() {
  return (
    <VStack>
      <Heading>Add Transactions</Heading>
      <TransactionsForm />
    </VStack>
  )
}
