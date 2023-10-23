import { ActionFunction, LoaderFunctionArgs, redirect } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import { StatsCardList } from "~/components/StatsCardList"
import { TimeSelectBar } from "~/components/TimeSelectBar"
import { getPeriodSummary } from "~/logic/cost-balancer"
import { convertMonthStrTo2CharStr, getTimeSelectFormProps } from "~/utils/form"

export async function loader({ params }: LoaderFunctionArgs) {
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

  const monthFixed = convertMonthStrTo2CharStr(month)

  return redirect(
    `/${year !== "" ? year.slice(2, 4) : "00"}-${monthFixed}/transactions`
  )
}

export default function PeriodSummaryRoute() {
  const { title, yearInput, monthInput, balance } =
    useLoaderData<typeof loader>()
  return (
    <main className="glass flex flex-col h-screen overflow-auto">
      <header>
        <TimeSelectBar
          yearInput={yearInput}
          title={title}
          monthInput={monthInput}
        />
      </header>
      <>
        <StatsCardList
          styrBalance={balance.styrSummary}
          tenantBalance={balance.tenantSummary}
        />
      </>
      <Outlet />
    </main>
  )
}
