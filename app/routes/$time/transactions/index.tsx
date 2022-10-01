import { Box, Button, Heading, HStack, Text, VStack } from "@chakra-ui/react"
import {
  TransactionAction,
  TransactionOwner,
  TransactionType,
} from "@prisma/client"
import { ActionFunction, json, LoaderArgs } from "@remix-run/node"
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react"
import { GrEdit, GrTrash } from "react-icons/gr"
import invariant from "tiny-invariant"
import { TransactionsForm } from "~/components/TransactionsForm"
import {
  createTransaction,
  deleteTransaction,
  getTransactionsListByYearMonth,
} from "~/models/transactions.server"
import { formatMonth } from "~/utils/time"

export async function loader({ params }: LoaderArgs) {
  const { time } = params
  invariant(typeof time === "string", "time must be a string")
  const [year, month] = time.split("-")
  const yearFixed = year === "00" ? undefined : String(Number(year) + 2000)
  const monthFixed = month === "00" ? undefined : String(Number(month))
  const months = monthFixed
    ? [monthFixed, String(Number(monthFixed + 1))]
    : undefined
  const transactions = await getTransactionsListByYearMonth({
    year: yearFixed,
    months,
  })

  // check if got transactions
  if (!transactions) {
    throw new Response("No transactions found", { status: 404 })
  }
  return json({ transactions })
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

      return new Response("ok")

    case "delete-transaction":
      const form = await request.formData()
      const id = form.get("id") as string
      invariant(typeof id === "string", "id must be a string")
      const transaction = await deleteTransaction(id)

      return json(transaction)

    default: {
      throw new Error(`Unsupported intent: ${intent}`)
    }
  }
}

export default function TransactionsListRoute() {
  const { transactions } = useLoaderData<typeof loader>()
  const transition = useTransition()
  const isBusy = transition.state === "submitting"

  return (
    <HStack overflow={"hidden"}>
      <VStack overflow={"scroll"}>
        {transactions?.map((transaction) => {
          const { id, action, type, owner, amount, description, month } =
            transaction
          return (
            <Form method="post">
              <HStack key={id}>
                <input type="hidden" name="id" value={id} />
                <Text>{type}</Text>
                <Text>{action}</Text>
                <Text>{owner}</Text>
                <Text>{amount}</Text>
                <Text>{description}</Text>
                <Text>{formatMonth(month)}</Text>
                <Link to={id}>
                  <Box my={"auto"} color={"gray.800"} alignContent={"center"}>
                    <Button disabled={isBusy}>
                      <GrEdit />
                    </Button>
                  </Box>
                </Link>
                <Button
                  type="submit"
                  disabled={isBusy}
                  name="intent"
                  value="delete-transaction"
                >
                  <GrTrash />
                </Button>
              </HStack>
            </Form>
          )
        })}
      </VStack>
      <VStack>
        <Heading>Add Transactions</Heading>
        <TransactionsForm />
      </VStack>
    </HStack>
  )
}
