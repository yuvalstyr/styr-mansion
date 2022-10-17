import {
  Box,
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
  TransactionAction,
  TransactionOwner,
  TransactionType,
} from "@prisma/client"
import { ActionFunction, LoaderArgs, redirect } from "@remix-run/node"
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import { updateTransaction } from "~/models/transactions.server"
import { db } from "~/utils/db.server"
import { convertMonthStrTo2CharStr, getOptions } from "~/utils/form"

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
      <VStack>
        <Heading>Transaction not found</Heading>
      </VStack>
    )
  }
  const t = {
    ...transaction,
    createdAt: new Date(transaction.createdAt),
    updatedAt: new Date(transaction.updatedAt),
  }
  console.log("transaction :>> ", t)
  return (
    <VStack>
      <Heading>Update Transactions {`${t.id}`}</Heading>
      <Form method="post">
        <label>
          Type:
          <Box>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered input-primary w-full max-w-xs"
            />
          </Box>
        </label>
        <label>
          Type:
          <Select placeholder=" " name="type" defaultValue={t?.type}>
            {getOptions("TYPE")}
          </Select>
        </label>
        <label>
          Action:
          <Select placeholder=" " name="action" defaultValue={t?.action}>
            {getOptions("ACTION")}
          </Select>
        </label>
        <label>
          Transaction Owner:
          <Select placeholder=" " name="owner" defaultValue={t?.owner}>
            {getOptions("OWNER")}
          </Select>
        </label>
        <label>
          Amount (🇮🇱 NIS ₪):
          <NumberInput
            precision={2}
            step={1}
            name="amount"
            defaultValue={t?.amount}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </label>
        <label>
          Month:
          <Select placeholder=" " name="month" defaultValue={t?.month}>
            {getOptions("MONTH")}
          </Select>
        </label>
        <label>
          Year:
          <Select placeholder=" " name="year" defaultValue={t?.year}>
            {getOptions("YEAR")}
          </Select>
        </label>
        <label>
          Description:
          <Input
            name="description"
            defaultValue={t?.description}
            placeholder="Description"
          />
        </label>
        <Button
          type="submit"
          disabled={false}
          name="intent"
          value="create-transaction"
        >
          {false ? "Submitting..." : t ? "Update" : "Create"}
        </Button>
        {t ? (
          <Link to={"../../new"}>
            <Button disabled={false}>Back</Button>
          </Link>
        ) : null}
      </Form>
      <Outlet />
    </VStack>
  )
}
