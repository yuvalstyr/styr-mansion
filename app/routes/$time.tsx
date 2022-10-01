import { Grid, GridItem, HStack, VStack } from "@chakra-ui/react"
import { ActionFunction, LoaderArgs, redirect } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import { BsPerson } from "react-icons/bs"
import { FiServer } from "react-icons/fi"
import { GoLocation } from "react-icons/go"
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

const gridTemplateAreas = `"bar bar bar"
                           "dashboard dashboard dashboard"
                           "transactions transactions transactions"`

export default function PeriodSummaryRoute() {
  const { title, yearInput, monthInput, balance } =
    useLoaderData<typeof loader>()
  return (
    <Grid
      gridTemplateAreas={gridTemplateAreas}
      gridTemplateRows={"10vh 20vh 1fr"}
      h="80vh"
      maxH={"80vh"}
    >
      <GridItem pl="2" bg="orange.300" area="bar">
        <TimeSelectBar
          yearInput={yearInput}
          title={title}
          monthInput={monthInput}
        />
      </GridItem>
      <GridItem pl="2" bg="blue.300" area="dashboard">
        <VStack>
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
        </VStack>
      </GridItem>
      <GridItem pl="2" bg="red.300" area="transactions">
        <PeriodSummary>
          <Outlet />
        </PeriodSummary>
      </GridItem>
    </Grid>
  )
}

function PeriodSummary({ children }: { children: React.ReactNode }) {
  return <HStack>{children}</HStack>
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return <div>Uh oh. I did a whoopsies</div>
}
