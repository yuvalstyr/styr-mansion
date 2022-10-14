import { Box, Button, HStack, Text } from "@chakra-ui/react"
import { Transaction } from "@prisma/client"
import { Form, Link } from "@remix-run/react"
import { GrEdit, GrTrash } from "react-icons/gr"
import { formatMonth } from "~/utils/time"

export function TransactionItem({
  transaction,
  isBusy,
}: {
  transaction: Transaction
  isBusy: boolean
}) {
  const { id, action, type, owner, amount, description, month } = transaction

  return (
    <Form method="post">
      <HStack>
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
}
