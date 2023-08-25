import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { Form, Link, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import { InputFloatingLabel } from "~/components/components"
import { getLastMonthMeasurements } from "~/models/electricity.server"
import { db } from "~/utils/db.server"
import { debugRemix } from "~/utils/debug"
import { convertTimeToYearMonth, getTimeParameters } from "~/utils/time"

async function handleElectricityTransactions({
  month,
  year,
  basementAmount,
  frontAmount,
  mainAmount,
}: {
  year: string
  month: string
  basementAmount: number
  frontAmount: number
  mainAmount: number
}) {
  //  check if transactions exist
  const transactions = await db.transaction.findMany({
    where: { action: "ELECTRICITY", year, month },
  })
  //  if there is not a transaction, create one and return
  if (transactions.length === 0) {
    // create electricity transactions
    await db.transaction.create({
      data: {
        year,
        month,
        action: "ELECTRICITY",
        amount: frontAmount,
        description: "Electricity bill for front apartment",
        type: "EXPENSE",
        owner: "Tenant",
      },
    })
    await db.transaction.create({
      data: {
        year,
        month,
        action: "ELECTRICITY",
        amount: basementAmount,
        description: "Electricity bill for basement apartment",
        type: "EXPENSE",
        owner: "Tenant",
      },
    })
    //  create for main house
    await db.transaction.create({
      data: {
        year,
        month,
        action: "ELECTRICITY",
        amount: mainAmount,
        description: "Electricity bill for main house",
        type: "WITHDRAWAL",
        owner: "Ran",
      },
    })

    return { message: "created", status: 201 }
  }

  //  update transactions
  const tenantTransactions = transactions.filter((t) => t.owner === "Tenant")
  const ownerTransaction = transactions.filter((t) => t.owner !== "Tenant")[0]

  // update tenant transactions
  await db.transaction.update({
    where: { id: tenantTransactions[0].id },
    data: {
      amount: frontAmount,
      description: "Electricity bill for front apartment",
    },
  })
  await db.transaction.update({
    where: { id: tenantTransactions[1].id },
    data: {
      amount: basementAmount,
      description: "Electricity bill for basement apartment",
    },
  })

  //  update owners transaction
  await db.transaction.update({
    where: { id: ownerTransaction.id },
    data: {
      amount: mainAmount,
    },
  })

  return { message: "updated", status: 204 }
}

export async function loader({ params }: LoaderArgs) {
  const { time } = params
  invariant(typeof time === "string", "time must be a string")
  const { year, month } = convertTimeToYearMonth(time)
  const { link } = getTimeParameters(time, "transactions")
  const title = `Electricity for period: ${year} ${Number(month)}-${
    Number(month) + 1
  }`
  const electricity = await db.electricity.findFirst({
    where: { year: year, month: String(Number(month)) },
  })

  return { title, electricity, link }
}

export async function action({ request, params }: ActionArgs) {
  debugRemix()
  const formData = await request.formData()
  const intent = formData.get("intent")
  switch (intent) {
    case "calculate":
      // validate form
      const { time } = params
      invariant(typeof time === "string", "time must be a string")
      const { year, month } = convertTimeToYearMonth(time)
      invariant(typeof year === "string", "year must be a string")
      invariant(typeof month === "string", "month must be a string")
      const rate = formData.get("rate")
      invariant(typeof rate === "string", "rate must be a string")
      const totalBill = formData.get("bill")
      invariant(typeof totalBill === "string", "bill must be a string")
      const frontMeasurement = formData.get("front")
      invariant(typeof frontMeasurement === "string", "front must be a string")
      const basementMeasurement = formData.get("basement")
      invariant(
        typeof basementMeasurement === "string",
        "basement must be a string"
      )

      //  get previous months measurements and validate
      const lastBill = await getLastMonthMeasurements(month, year)
      if (!lastBill) {
        throw new Response("No last bill", { status: 500 })
      }
      if (
        Number(frontMeasurement) < lastBill.frontMeasurement ||
        Number(basementMeasurement) < lastBill.basementMeasurement
      ) {
        throw new Response("Invalid measurements", { status: 400 })
      }
      //  calculate consumption and cost
      const basementConsumption =
        Number(basementMeasurement) - lastBill.basementMeasurement
      const basementCost = (basementConsumption * Number(rate)) / 100
      const frontConsumption =
        Number(frontMeasurement) - lastBill.frontMeasurement
      const frontCost = (frontConsumption * Number(rate)) / 100
      const houseCost = Number(totalBill) - frontCost - basementCost

      // find if electricity measurements exists
      const electricity = await db.electricity.findFirst({
        where: { year, month },
      })
      // if bill exists, update
      if (electricity) {
        await db.electricity.update({
          where: { id: electricity.id },
          data: {
            frontMeasurement: Number(frontMeasurement),
            frontConsumption,
            frontCost,
            basementMeasurement: Number(basementMeasurement),
            basementConsumption,
            basementCost,
            houseCost,
            rate: Number(rate),
            totalBill: Number(totalBill),
          },
        })
      } else {
        // if bill does not exist, create
        await db.electricity.create({
          data: {
            year,
            month,
            frontMeasurement: Number(frontMeasurement),
            frontConsumption,
            frontCost,
            basementMeasurement: Number(basementMeasurement),
            basementConsumption,
            basementCost,
            houseCost,
            rate: Number(rate),
            totalBill: Number(totalBill),
          },
        })
      }

      //  handle transactions
      const transactions = await handleElectricityTransactions({
        basementAmount: basementCost,
        frontAmount: frontCost,
        mainAmount: houseCost,
        month,
        year,
      })

      return transactions
  }
}

export default function ElectricityRoute() {
  const data = useLoaderData<typeof loader>()

  const { electricity, title, link } = data

  return (
    <div className="modal modal-open">
      <div className="w-[90vw] bg-base-100 rounded-lg">
        <div className="relative p-10 m-6 bg-base-100 rounded-box">
          <Form method="post">
            <div className="flex flex-col bg-base-100 rounded-lg">
              <div className="grid grid-cols-2">
                <div className="text-3xl">{title}</div>
                <div className="modal-action m-0">
                  <Link to={link}>
                    <button className="btn btn-primary">X</button>
                  </Link>
                </div>
              </div>
              <InputFloatingLabel
                label="Monthly Rate"
                name="rate"
                defaultValue={electricity?.rate}
              />
              <InputFloatingLabel
                label="Month Bill"
                name="bill"
                defaultValue={electricity?.totalBill}
              />
              <InputFloatingLabel
                label="front measurement"
                name="front"
                defaultValue={electricity?.frontMeasurement}
              />
              <InputFloatingLabel
                label="basement measurement"
                name="basement"
                defaultValue={electricity?.basementMeasurement}
              />
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
                <div>
                  <div className="text-2xl">Front</div>
                  <div>Consumption: {electricity.frontConsumption}</div>
                  <div>Cost: {electricity.frontCost}</div>
                  <div className="text-2xl">Basement</div>
                  <div>Consumption: {electricity.basementConsumption}</div>
                  <div>Cost: {electricity.basementCost}</div>
                  <div className="text-2xl">House</div>
                  <div>Cost: {electricity.houseCost}</div>
                </div>
              ) : (
                <div>Please enter period data and press calculate</div>
              )}
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
