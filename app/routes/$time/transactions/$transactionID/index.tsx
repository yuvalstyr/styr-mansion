import {
  Button,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  VStack,
} from "@chakra-ui/react"
import {
  Transaction,
  TransactionAction,
  TransactionOwner,
  TransactionType,
} from "@prisma/client"
import {
  ActionFunction,
  Form,
  Link,
  LoaderFunction,
  Outlet,
  redirect,
  useLoaderData,
  useTransition,
} from "remix"
import { updateTransaction } from "~/models/transactions.server"
import { db } from "~/utils/db.server"
import { getOptions } from "~/utils/form"

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
  const month = form.get("month") ?? 0
  const year = form.get("year") ?? 0
  const id = params.transactionID

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
      month: Number(month),
      year: Number(year),
    },
    where: { id: id ?? "" },
  })

  return redirect("/transactions")
}
// todo change form inputs to be generic: if have a default value or not will be the only difference between the two forms: update and new
// todo check how to make error boundary as outlet

export default function UpdateTransactionRoute() {
  const data = useLoaderData<LoaderData>()
  const { state } = useTransition()
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
      <Form method="post">
        <label>
          Type:
          <Select placeholder=" " name="type" defaultValue={t.type}>
            {getOptions("TYPE")}
          </Select>
        </label>
        <label>
          Action:
          <Select placeholder=" " name="action" defaultValue={t.action}>
            {getOptions("ACTION")}
          </Select>
        </label>
        <label>
          Owner:
          <Select placeholder=" " name="owner" defaultValue={t.owner}>
            {getOptions("OWNER")}
          </Select>
        </label>
        <label>
          Amount (🇮🇱 NIS ₪) :
          <NumberInput
            precision={2}
            step={1}
            name="amount"
            defaultValue={t.amount}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </label>
        <label>
          Description:
          <Input
            name="description"
            defaultValue={t.description}
            placeholder="Description"
          />
        </label>
        <label>
          Month:
          <Select placeholder=" " name="month" defaultValue={t.month}>
            {getOptions("MONTH")}
          </Select>
        </label>
        <label>
          Year:
          <Select placeholder=" " name="year" defaultValue={t.year}>
            {getOptions("YEAR")}
          </Select>
        </label>
        <Button type="submit">Update</Button>
        <Link to="/transactions">
          <Button>Back</Button>
        </Link>
      </Form>
      <Outlet />
    </VStack>
  )
}
