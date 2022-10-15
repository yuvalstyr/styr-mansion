import { Center, Heading, VStack } from "@chakra-ui/react"
import { Transaction } from "@prisma/client"
import { TransactionItem } from "./TransactionItem"

type IProps = {
  transactions: Transaction[]
  isBusy: boolean
}

export function TransactionsList({ transactions, isBusy }: IProps) {
  return (
    <VStack alignItems={"center"}>
      <Heading
        position={"sticky"}
        top="0"
        width={"100%"}
        bg={"white"}
        zIndex={99}
      >
        <Center>Transactions</Center>
      </Heading>
      {transactions?.map((t) => {
        const transaction: Transaction = {
          ...t,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
        }
        return (
          <TransactionItem
            isBusy={isBusy}
            transaction={transaction}
            key={t.id}
          />
        )
      })}
    </VStack>
  )
}
