import { Box, VStack } from "@chakra-ui/react"
import { BsPerson } from "react-icons/bs"
import { FiServer } from "react-icons/fi"
import { GoLocation } from "react-icons/go"
import {
  ActionFunction,
  LoaderFunction,
  Outlet,
  redirect,
  useLoaderData,
} from "remix"
import invariant from "tiny-invariant"
import { StatsCard } from "~/components/StatsCard"
import { TimeSelectBar } from "~/components/TimeSelectBar"
import { debugRemix } from "~/utils/debug"
import { FormTitleResponse, getTimeSelectFormProps } from "~/utils/form"

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
  const { title, yearInput, monthInput } = getTimeSelectFormProps({
    year,
    month,
  })

  return { title, yearInput, monthInput }
}

export const action: ActionFunction = async ({ request }) => {
  debugRemix()
  const form = await request.formData()
  const month = form.get("month") as string
  const year = form.get("year") as string
  invariant(typeof month === "string", "month must be a string")
  invariant(typeof year === "string", "year must be a string")

  const monthFixed = month ? (Number(month) < 10 ? `0${month}` : month) : "00"

  return redirect(
    `/${year !== "" ? year.slice(2, 4) : "00"}-${monthFixed}/transactions`
  )
}

export default function StatisticRoute() {
  const { title, yearInput, monthInput } = useLoaderData<FormTitleResponse>()

  return (
    <Box maxW="7xl" mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <TimeSelectBar
        yearInput={yearInput}
        title={title}
        monthInput={monthInput}
      />
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
