import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react"
import { Transaction } from "@prisma/client"
import { Link, useLoaderData } from "@remix-run/react"
import { GrEdit } from "react-icons/gr"
import { LoaderFunction } from "remix"
import {
  getAllTransactions,
  getTransactionsListByYearMonth,
} from "~/models/transactions.server"
import { monthStrToInt } from "~/utils/form"

type LoaderData = {
  transactions: Transaction[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const month = url.searchParams.get("month")
  const monthInt = month ? monthStrToInt(month) : undefined
  const year = url.searchParams.get("year")
  const transactions =
    monthInt && year
      ? await getTransactionsListByYearMonth(year, monthInt)
      : await getAllTransactions()
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
        const { id, action, type, owner, amount, description, timePeriod } =
          transaction
        return (
          <HStack key={id}>
            <Text>{type}</Text>
            <Text>{action}</Text>
            <Text>{owner}</Text>
            <Text>{amount}</Text>
            <Text>{description}</Text>
            <Text>{timePeriod}</Text>
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
