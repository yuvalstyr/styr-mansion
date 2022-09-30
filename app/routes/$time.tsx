import { Box, VStack } from "@chakra-ui/react"
import { BsPerson } from "react-icons/bs"
import { FiServer } from "react-icons/fi"
import { GoLocation } from "react-icons/go"
import {
  ActionFunction,
  LoaderArgs,
  Outlet,
  redirect,
  useLoaderData,
} from "remix"
import invariant from "tiny-invariant"
import { StatsCard } from "~/components/StatsCard"
import { TimeSelectBar } from "~/components/TimeSelectBar"
import { getPeriodBalance } from "~/logic/cost-balancer"
import { getTransactionsStats } from "~/models/transactions.server"
import { convertMonthIntToStr, getTimeSelectFormProps } from "~/utils/form"

export async function loader({ params }: LoaderArgs) {
  const { time } = params
  invariant(typeof time === "string", "time must be a string")
  const [year, month] = time.split("-")
  const yearFixed = year === "00" ? undefined : String(Number(year) + 2000)
  const monthFixed = month === "00" ? undefined : String(Number(month))
  const months = monthFixed
    ? [monthFixed, String(Number(monthFixed + 1))]
    : undefined
  const { title, yearInput, monthInput } = getTimeSelectFormProps({
    year,
    month,
  })
  const balance = await getPeriodBalance({ year: yearFixed, months })

  const stats = await getTransactionsStats()

  return { title, yearInput, monthInput, balance }
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const month = form.get("month") as string
  const year = form.get("year") as string
  invariant(typeof month === "string", "month must be a string")
  invariant(typeof year === "string", "year must be a string")

  const monthFixed = convertMonthIntToStr(month)

  return redirect(
    `/${year !== "" ? year.slice(2, 4) : "00"}-${monthFixed}/transactions`
  )
}

export default function StatisticRoute() {
  const { title, yearInput, monthInput, balance } =
    useLoaderData<typeof loader>()
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
          stat={""}
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
          title={"Rent"}
          stat={String(balance.tenantBalance.total_profit)}
          icon={<GoLocation size={"3em"} />}
          type="Income"
        />
        <pre>{JSON.stringify(balance, null, 2)}</pre>
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
