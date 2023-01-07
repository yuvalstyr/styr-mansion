import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { Form, useCatch, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import { ErrorFallback, InputFloatingLabel } from "~/components/components"
import { getLastMonthMeasurements } from "~/models/electricity.server"
import { db } from "~/utils/db.server"
import { convertTimeToYearMonth } from "~/utils/time"

export async function loader({ params }: LoaderArgs) {
  const { time } = params
  invariant(typeof time === "string", "time must be a string")
  const { year, month } = convertTimeToYearMonth(time)

  const title = `Electricity for period: ${year} ${Number(month)}-${
    Number(month) + 1
  }`
  const electricity = await db.electricity.findFirst({
    where: { year: year, month: String(Number(month)) },
  })

  return { title, electricity }
}

export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData()
  const intent = formData.get("intent")
  switch (intent) {
    case "calculate":
      const { time } = params
      invariant(typeof time === "string", "time must be a string")
      const { year, month } = convertTimeToYearMonth(time)
      invariant(typeof year === "string", "year must be a string")
      invariant(typeof month === "string", "month must be a string")
      const rate = formData.get("rate")
      invariant(typeof rate === "string", "rate must be a string")
      const totalBill = formData.get("bill")
      invariant(typeof totalBill === "string", "bill must be a string")
      const front = formData.get("front")
      invariant(typeof front === "string", "front must be a string")
      const basement = formData.get("basement")
      invariant(typeof basement === "string", "basement must be a string")

      const lastBill = await getLastMonthMeasurements(month, year)
      if (!lastBill) {
        throw new Response("No last bill", { status: 500 })
      }
      const basementConsumption =
        Number(basement) - lastBill.basementMeasurement
      const basementCost = (basementConsumption * Number(rate)) / 100
      const frontConsumption = Number(front) - lastBill.frontMeasurement
      const frontCost = (frontConsumption * Number(rate)) / 100
      const houseCost = Number(totalBill) - frontCost - basementCost
      // find if bill exists
      const electricity = await db.electricity.findFirst({
        where: { year, month },
      })
      // if bill exists, update
      if (electricity) {
        await db.electricity.update({
          where: { id: electricity.id },
          data: {
            frontMeasurement: Number(front),
            frontConsumption,
            frontCost,
            basementMeasurement: Number(basement),
            basementConsumption,
            basementCost,
            houseCost,
            rate: Number(rate),
            totalBill: Number(totalBill),
          },
        })
        return { message: "updated", status: 204 }
      }
      // if bill does not exist, create
      await db.electricity.create({
        data: {
          year,
          month,
          frontMeasurement: Number(front),
          frontConsumption,
          frontCost,
          basementMeasurement: Number(basement),
          basementConsumption,
          basementCost,
          houseCost,
          rate: Number(rate),
          totalBill: Number(totalBill),
        },
      })
      return { message: "created", status: 201 }
  }
}

export default function ElectricityRoute() {
  const data = useLoaderData<typeof loader>()

  const { electricity, title } = data

  return (
    // <div className="modal modal-open">
    <Form method="post">
      <div className="flex flex-col w-[90vw] bg-base-100 rounded-lg">
        <div className="text-3xl">{title}</div>
        <InputFloatingLabel label="Monthly Rate" name="rate" />
        <InputFloatingLabel label="Month Bill" name="bill" />
        <InputFloatingLabel label="front consumption" name="front" />
        <InputFloatingLabel label="basement consumption" name="basement" />
        <button
          type="submit"
          name="intent"
          value="calculate"
          className="btn btn-primary col-start-4 mt-3"
        >
          Calculate
        </button>
        <div className="divider-vertical bg-primary h-1" />
        {electricity ? (
          <div>"got bill"</div>
        ) : (
          <div>"Please enter period data and press calculate"</div>
        )}
      </div>
    </Form>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  if (caught.status === 500) {
    return (
      <ErrorFallback>
        For Calculate to work, you need to have a previous bill.
      </ErrorFallback>
    )
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return <ErrorFallback>There was a problem. Sorry.</ErrorFallback>
}
