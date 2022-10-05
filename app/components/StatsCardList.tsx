import { HStack } from "@chakra-ui/react"
import { BsPerson } from "react-icons/bs"
import { FiServer } from "react-icons/fi"
import { GoLocation } from "react-icons/go"
import { StatsCard } from "./StatsCard"

export function StatsCardList() {
  return (
    <HStack alignItems={"stretch"}>
      <StatsCard
        title={"Cost"}
        stat={""}
        icon={<BsPerson size={"3em"} />}
        type="Cost"
        key={"das"}
      />
      <StatsCard
        title={"Servers"}
        stat={"1,000"}
        icon={<FiServer size={"3em"} />}
        type="Cost"
        key={"das1"}
      />
      <StatsCard
        title={"Rent"}
        stat={"dasd"}
        icon={<GoLocation size={"3em"} />}
        type="Income"
        key={"das2"}
      />
    </HStack>
  )
}
