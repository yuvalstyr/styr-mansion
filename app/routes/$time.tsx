import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react"
import { BsPerson } from "react-icons/bs"
import { FiServer } from "react-icons/fi"
import { GoLocation } from "react-icons/go"
import {
  ActionFunction,
  Form,
  LoaderFunction,
  Outlet,
  redirect,
  useLoaderData,
} from "remix"
import invariant from "tiny-invariant"
import { Autocomplete } from "~/components/Autocomplete"
import { StatsCard } from "~/components/StatsCard"
import {
  FormTitleResponse,
  getFormTitle,
  getMonthValueByName,
} from "~/utils/form"

type LoaderData = {
  month: string
  year: string
}

type ActionData = {
  month: string
  year: string
}

export const loader: LoaderFunction = async ({ params }) => {
  const { time } = params
  invariant(typeof time === "string", "time must be a string")
  const [year, month] = time.split("-")
  const { title, yearInput } = getFormTitle({ year, month })

  return { title, yearInput }
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const month = form.get("month") as string
  const year = form.get("year") as string
  invariant(typeof month === "string", "month must be a string")
  invariant(typeof year === "string", "year must be a string")
  const monthInt = String(getMonthValueByName(month))
  console.log("monthInt :>> ", monthInt)
  const monthAsNumber = month != "" ? monthInt : "0"

  return redirect(
    `/${year !== "" ? year.slice(2, 4) : "00"}-${
      monthAsNumber.length < 2 ? 0 + monthAsNumber : monthAsNumber
    }/transactions`
  )
}

export default function StatisticRoute() {
  const { title, yearInput } = useLoaderData<FormTitleResponse>()

  return (
    <Box maxW="7xl" mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <Form method="post">
        <HStack border={"2px"} p={5}>
          <label>
            Month:
            <Autocomplete name="month" />
          </label>
          <label>
            Year:
            <Autocomplete name="year" value={yearInput} />
          </label>
          <Button type="submit">OK</Button>
          <Text>{title ?? "no title"}</Text>
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

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return <div>Uh oh. I did a whoopsies</div>
}
