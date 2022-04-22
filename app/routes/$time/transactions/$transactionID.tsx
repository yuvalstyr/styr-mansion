import { Heading, VStack } from "@chakra-ui/react"
import { Outlet } from "remix"

// todo change form inputs to be generic: if have a default value or not will be the only difference between the two forms: update and new
// todo check how to make error boundary as outlet

export default function UpdateTransactionRoute() {
  return (
    <VStack>
      <Heading>Update Transactions</Heading>
      <Outlet />
    </VStack>
  )
}
