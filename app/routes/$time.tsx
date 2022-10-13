import { Grid, GridItem } from "@chakra-ui/react"
import { ActionFunction, LoaderArgs, redirect } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import { StatsCardList } from "~/components/StatsCardList"
import { TimeSelectBar } from "~/components/TimeSelectBar"
import { getPeriodSummary } from "~/logic/cost-balancer"
import { convertMonthIntToStr, getTimeSelectFormProps } from "~/utils/form"

export async function loader({ params }: LoaderArgs) {
  const { time } = params
  invariant(typeof time === "string", "time must be a string")
  const [year, month] = time.split("-")
  const yearFixed = year === "00" ? undefined : String(Number(year) + 2000)
  const monthFixed = month === "00" ? undefined : String(Number(month))
  const months = monthFixed
    ? [monthFixed, String(Number(monthFixed) + 1)]
    : undefined
  const { title, yearInput, monthInput } = getTimeSelectFormProps({
    year,
    month,
  })
  const balance = await getPeriodSummary({ year: yearFixed, months })

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

const gridTemplateAreas = `"header header"
                           "stats stats"
                           "list form"`

export default function PeriodSummaryRoute() {
  const { title, yearInput, monthInput, balance } =
    useLoaderData<typeof loader>()
  return (
    <Grid
      gridTemplateAreas={gridTemplateAreas}
      gridTemplateColumns={"1fr 1fr"}
      gridTemplateRows={"auto auto 1fr"}
      maxH={"100vh"}
    >
      <GridItem area={"header"}>
        <TimeSelectBar
          yearInput={yearInput}
          title={title}
          monthInput={monthInput}
        />
      </GridItem>
      <GridItem area={"stats"}>
        <StatsCardList
          styrBalance={balance.styrSummary}
          tenantBalance={balance.tenantSummary}
        />
      </GridItem>
      <Outlet />
    </Grid>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return <div>Uh oh. I did a whoopsies</div>
}
