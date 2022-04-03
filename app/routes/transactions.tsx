import { Box, Button, HStack, VStack } from "@chakra-ui/react"
import { BsPerson } from "react-icons/bs"
import { FiServer } from "react-icons/fi"
import { GoLocation } from "react-icons/go"
import { ActionFunction, Form, json, Outlet, redirect } from "remix"
import { Autocomplete } from "~/components/Autocomplete"
import { StatsCard } from "~/components/StatsCard"
import { db } from "~/utils/db.server"
import { monthStrToInt } from "~/utils/form"

//todo change the year and month form from post one to parameters one
// after sending the url will look like this: transactions?year=2020&month=1
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const month = form.get("MONTH")
  const year = form.get("YEAR")
  if (typeof month !== "string" || typeof year !== "string") {
    return `Form not submitted correctly.`
  }

  const filteredTransactions = await db.transaction.findMany({
    where: { month: monthStrToInt(month), year: +Number(year) },
  })
  console.log("filteredTransactions :>> ", filteredTransactions)
  return json(filteredTransactions)
}

export default function StatisticRoute() {
  return (
    <Box maxW="7xl" mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <Form method="post">
        <HStack border={"2px"} p={5}>
          <label>
            Month:
            <Autocomplete name="MONTH" />
          </label>
          <label>
            Year:
            <Autocomplete name="YEAR" />
          </label>
          <Button type="submit">OK</Button>
        </HStack>
      </Form>
      <VStack>
        <StatsCard
          title={"Cost"}
          stat={"5,000"}
          icon={<BsPerson size={"3em"} />}
          type="Cost"
        />
        <StatsCard
          title={"Servers"}
          stat={"1,000"}
          icon={<FiServer size={"3em"} />}
          type="Cost"
        />
        <StatsCard
          title={"Datacenters"}
          stat={"7"}
          icon={<GoLocation size={"3em"} />}
          type="Income"
        />
        {/* <ChartCard title="dsa" /> */}
        <Outlet />
      </VStack>
    </Box>
  )
}
