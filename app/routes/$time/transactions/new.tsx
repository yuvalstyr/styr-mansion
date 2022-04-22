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
  TransactionAction,
  TransactionOwner,
  TransactionType,
} from "@prisma/client"
import { ActionFunction, Form, Link, redirect } from "remix"
import { createTransaction } from "~/models/transactions.server"
import { getOptions } from "~/utils/form"

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const type = form.get("type") as TransactionType
  const action = form.get("action") as TransactionAction
  const owner = form.get("owner") as TransactionOwner
  const amount = form.get("amount")
  const description = form.get("description")
  const month = form.get("month") ?? 0
  const year = form.get("year") ?? 0
  if (typeof amount !== "string" || typeof description !== "string") {
    return `Form not submitted correctly.`
  }

  await createTransaction({
    action,
    type,
    owner,
    amount: Number(amount),
    description,
    month: Number(month),
    year: Number(year),
  })
  return redirect("/transactions")
}

export default function NewTransactionRoute() {
  return (
    <VStack>
      <Heading>Add Transactions</Heading>
      <Form method="post">
        <label>
          Type:
          <Select placeholder=" " name="type">
            {getOptions("TYPE")}
          </Select>
        </label>
        <label>
          Action:
          <Select placeholder=" " name="action">
            {getOptions("ACTION")}
          </Select>
        </label>
        <label>
          Owner:
          <Select placeholder=" " name="owner">
            {getOptions("OWNER")}
          </Select>
        </label>
        <label>
          Month:
          <Select placeholder=" " name="month">
            {getOptions("MONTH")}
          </Select>
        </label>
        <label>
          Year:
          <Select placeholder=" " name="year">
            {getOptions("YEAR")}
          </Select>
        </label>
        <label>
          Amount (🇮🇱 NIS ₪) :
          <NumberInput defaultValue={0} precision={2} step={1} name="amount">
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </label>
        <label>
          Description: <Input name="description" placeholder="Description" />
        </label>
        <Button type="submit">Add</Button>
        <Link to="/transactions">
          <Button>Back 👈</Button>
        </Link>
      </Form>
    </VStack>
  )
}
