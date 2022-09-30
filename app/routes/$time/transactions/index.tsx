import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react"
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react"
import { GrEdit, GrTrash } from "react-icons/gr"
import { ActionFunction, json, LoaderArgs } from "remix"
import invariant from "tiny-invariant"
import {
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
export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData()
  const id = form.get("id") as string
  invariant(typeof id === "string", "id must be a string")
  const transaction = await deleteTransaction(id)
  return transaction
}

export default function TransactionsListRoute() {
  const { transactions } = useLoaderData<typeof loader>()
  const transition = useTransition()
  const isBusy = transition.state === "submitting"

  return (
    <VStack>
      <HStack spacing={8}>
        <Link to="./new">
          <Button maxW={100} w={100}>
            Add ➕
          </Button>
        </Link>
      </HStack>

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
              <Button type="submit" disabled={isBusy}>
                <GrTrash />
              </Button>
            </HStack>
          </Form>
        )
      })}
    </VStack>
  )
}
