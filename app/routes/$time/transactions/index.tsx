import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react"
import { Transaction } from "@prisma/client"
import { Link, useLoaderData } from "@remix-run/react"
import { format } from "date-fns"
import { GrEdit } from "react-icons/gr"
import { LoaderFunction } from "remix"
import invariant from "tiny-invariant"
import { getTransactionsListByYearMonth } from "~/models/transactions.server"

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
          <HStack key={id}>
            <Text>{type}</Text>
            <Text>{action}</Text>
            <Text>{owner}</Text>
            <Text>{amount}</Text>
            <Text>{description}</Text>
            <Text>{format(new Date(2022, Number(month), 1), "MMMM")}</Text>
            <Link to={id}>
              <Box my={"auto"} color={"gray.800"} alignContent={"center"}>
                <GrEdit />
              </Box>
            </Link>
          </HStack>
        )
      })}
    </VStack>
  )
}
