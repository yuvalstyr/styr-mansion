import { Heading, VStack } from "@chakra-ui/react"
import { TransactionsForm } from "~/components/TransactionsForm"

export default function NewTransactionRoute() {
  return (
    <VStack>
      <Heading>Add Transactions</Heading>
      <TransactionsForm />
    </VStack>
  )
}
