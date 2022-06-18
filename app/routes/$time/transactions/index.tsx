import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react"
import { Transaction } from "@prisma/client"
import { Form, Link, useLoaderData } from "@remix-run/react"
import { GrEdit, GrTrash } from "react-icons/gr"
import { ActionFunction, LoaderFunction } from "remix"
import invariant from "tiny-invariant"
import {
  deleteTransaction,
  getTransactionsListByYearMonth,
} from "~/models/transactions.server"
import { formatMonth } from "~/utils/time"

type LoaderData = {
  transactions: Transaction[]
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const { time } = params
  invariant(typeof time === "string", "time must be a string")
  const [year, month] = time.split("-")
  const yearFixed = year === "00" ? undefined : String(Number(year) + 2000)
  const monthFixed = month === "00" ? undefined : String(Number(month))

  const transactions = await getTransactionsListByYearMonth(
    yearFixed,
    monthFixed
  )

  //   check if got transactions
  if (!transactions) {
    throw new Response("No transactions found", { status: 404 })
  }
  return { transactions }
}
// todo add pending UI
export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData()
  const id = form.get("id") as string
  invariant(typeof id === "string", "id must be a string")
  const transaction = await deleteTransaction(id)
  return transaction
}

export default function TransactionsListRoute() {
  const { transactions } = useLoaderData<LoaderData>()
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
                  <Button>
                    <GrEdit />
                  </Button>
                </Box>
              </Link>
              <Button type="submit">
                <GrTrash />
              </Button>
            </HStack>
          </Form>
        )
      })}
    </VStack>
  )
}
