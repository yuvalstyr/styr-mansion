import {
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  VStack,
} from "@chakra-ui/react"
import { Card } from "~/components/Card"

export interface StatsCardProps {
  profit: number
  withdrawal: number
  expense: number
  remains: number
  name: string
}

export function StatsCard(props: StatsCardProps) {
  const { profit, expense, remains, withdrawal, name } = props
  return (
    <Card type={name}>
      <StatGroup w={"100%"}>
        <Stat>
          <VStack>
            <StatLabel>Profit</StatLabel>
            <StatNumber>{profit}</StatNumber>
          </VStack>
        </Stat>
        <Stat alignSelf={"center"}>
          <VStack>
            <StatLabel>Expense</StatLabel>
            <StatNumber>{expense}</StatNumber>
          </VStack>
        </Stat>
        <Stat alignSelf={"center"}>
          <VStack>
            <StatLabel>Withdrawal</StatLabel>
            <StatNumber>{withdrawal}</StatNumber>
          </VStack>
        </Stat>
        <Stat alignSelf={"center"}>
          <VStack>
            <StatLabel>Remains</StatLabel>
            <StatNumber>{remains}</StatNumber>
          </VStack>
        </Stat>
      </StatGroup>
    </Card>
  )
}
