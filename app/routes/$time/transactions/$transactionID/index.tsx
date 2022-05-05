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
  LoaderFunction,
  Outlet,
  redirect,
  useLoaderData,
  useNavigate,
  useTransition,
} from "remix"
import invariant from "tiny-invariant"
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

  return redirect(`/${year.slice(2, 4)}-${month}/transactions`)
}
// TODO change form inputs to be generic: if have a default value or not will be the only difference between the two forms: update and new
// TODO check how to make error boundary as outlet

export default function UpdateTransactionRoute() {
  const data = useLoaderData<LoaderData>()
  const navigate = useNavigate()
  function onBack() {
    navigate(-1)
  }
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

        <Button onClick={onBack}>Back</Button>
      </Form>
      <Outlet />
    </VStack>
  )
}
