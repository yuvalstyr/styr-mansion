import { Transaction } from "@prisma/client"
import { Link, LoaderFunction, useLoaderData, useMatches } from "remix"
import { db } from "~/utils/db.server"
import { GrEdit } from "react-icons/gr"
import { HStack, Text, VStack } from "@chakra-ui/layout"
import { Button, Box } from "@chakra-ui/react"
import { getAllTransactions } from "~/models/transactions.server"

type LoaderData = {
  transactions: Transaction[]
}

export const loader: LoaderFunction = async () => {
  const transactions = await getAllTransactions()
  //   check if got transactions
  if (!transactions) {
    throw new Response("No transactions found", { status: 404 })
  }
  return { transactions }
}

export default function TransactionsListRoute() {
  const { transactions } = useLoaderData<LoaderData>()
  console.log("useMatches() :>> ", useMatches())
  return (
    <VStack>
      <HStack spacing={8}>
        <Link to="new">
          <Button maxW={100} w={100}>
            Add ➕
          </Button>
        </Link>
      </HStack>
      {transactions?.map((transaction) => {
        const { id, action, type, owner, amount, description, month, year } =
          transaction
        return (
          <HStack key={id}>
            <Text>{type}</Text>
            <Text>{action}</Text>
            <Text>{owner}</Text>
            <Text>{amount}</Text>
            <Text>{description}</Text>
            <Text>{year.toString().slice(2) + "-" + month}</Text>
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
