import { Box, Button, HStack, VStack } from "@chakra-ui/react"
import { BsPerson } from "react-icons/bs"
import { FiServer } from "react-icons/fi"
import { GoLocation } from "react-icons/go"
import { ActionFunction, Form, Outlet, redirect } from "remix"
import { Autocomplete } from "~/components/Autocomplete"
import { StatsCard } from "~/components/StatsCard"

export const action: ActionFunction = async ({ request }) => {
  console.log("request :>> ", await request.formData())
  return redirect("/transactions")
}

export default function StatisticRoute() {
  return (
    <Box maxW="7xl" mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <Form method="post">
        <HStack border={"2px"}>
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
