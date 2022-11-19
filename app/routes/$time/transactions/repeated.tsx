import { Transaction } from "@prisma/client"
import { ActionArgs, json, LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { v4 as uuid } from "uuid"
import { RepeatedTransactionsList } from "~/components/RepeatedTransactionsList"
import { db } from "~/utils/db.server"
import { convertMonthToMonthPeriod } from "~/utils/time"

const repeatedTransactions: Transaction[] = [
  {
    action: "MONTHLY_BILL",
    amount: 5800,
    description: "rent for front department",
    month: "please fill",
    owner: "Tenant",
    type: "DEPOSIT",
    year: "please fill",
    createdAt: new Date(),
    updatedAt: new Date(),
    id: uuid(),
  },
  {
    action: "MONTHLY_BILL",
    amount: 3800,
    description: "rent for basement department",
    month: "please fill",
    owner: "Tenant",
    type: "DEPOSIT",
    year: "please fill",
    createdAt: new Date(),
    updatedAt: new Date(),
    id: uuid(),
  },
  {
    action: "MONTHLY_BILL",
    amount: 450,
    description: "arnona department",
    month: "please fill",
    owner: "Tenant",
    type: "DEPOSIT",
    year: "please fill",
    createdAt: new Date(),
    updatedAt: new Date(),
    id: uuid(),
  },
  {
    action: "MONTHLY_BILL",
    amount: 385,
    description: "arnona department",
    month: "please fill",
    owner: "Tenant",
    type: "DEPOSIT",
    year: "please fill",
    createdAt: new Date(),
    updatedAt: new Date(),
    id: uuid(),
  },
  {
    action: "MONTHLY_BILL",
    amount: 1304,
    description: "rent for basement department",
    month: "please fill",
    owner: "Tenant",
    type: "DEPOSIT",
    year: "please fill",
    createdAt: new Date(),
    updatedAt: new Date(),
    id: uuid(),
  },
  {
    action: "MONTHLY_BILL",
    amount: 8000,
    description: "rent for front department",
    month: "please fill",
    owner: "Ran",
    type: "WITHDRAWAL",
    year: "please fill",
    createdAt: new Date(),
    updatedAt: new Date(),
    id: uuid(),
  },
  {
    action: "MONTHLY_BILL",
    amount: 1304,
    description: "arnona",
    month: "please fill",
    owner: "Ran",
    type: "WITHDRAWAL",
    year: "please fill",
    createdAt: new Date(),
    updatedAt: new Date(),
    id: uuid(),
  },
]

function getIncludeRows(data: FormData) {
  const rows = []
  const includes = data.getAll("include")
  const types = data.getAll("type")
  const actions = data.getAll("action")
  const owners = data.getAll("owner")
  const amounts = data.getAll("amount")
  const descriptions = data.getAll("description")
  const months = data.getAll("month")
  const years = data.getAll("year")

  for (let i = 0; i < types.length; i++) {
    const include = includes[i] === "on"
    const type = types[i].toString()
    const action = actions[i].toString()
    const owner = owners[i].toString()
    const amount = amounts[i].toString()
    const description = descriptions[i].toString()
    const month = months[i].toString()
    const year = years[i].toString()
    if (type && action && owner && amount && description) {
      rows.push({
        include,
        type,
        action,
        owner,
        amount,
        description,
        month,
        year,
      })
    }
  }
  return rows.filter((row) => row.include)
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const rows = getIncludeRows(formData)
  const transactions = rows.map((row) => {
    const { type, action, owner, amount, description, month, year } = row
    return {
      type,
      action,
      owner,
      amount: parseInt(amount),
      description,
      month,
      year,
    }
  })

  db.transaction.createMany({
    data: transactions,
  })
  return null
}

export async function loader(data: LoaderArgs) {
  //  create link
  const currentFullYear = new Date().getFullYear().toString()
  const currentYear = currentFullYear.slice(2, 4)
  const currentMonth = new Date().getMonth() + 1
  const currentMonthStr = convertMonthToMonthPeriod(currentMonth)
  const currentLinkPath = `/${currentYear}-${currentMonthStr}/transactions`

  // create transactions list
  const transactions = repeatedTransactions.map((t) => {
    return {
      ...t,
      month: currentMonthStr,
      year: currentFullYear,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })
  return json({ backLink: currentLinkPath, transactions })
}

export default function RepeatedRoute() {
  const data = useLoaderData<typeof loader>()
  const transactions = data.transactions?.map((t) => {
    const transaction: Transaction = {
      ...t,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt),
    }
    return transaction
  })
  return (
    <div className="modal modal-open">
      <div className="w-[90vw] bg-base-100 rounded-lg">
        <div className="modal-action">
          <Link to={data.backLink}>
            <button className="btn btn-primary">X</button>
          </Link>
        </div>
        <RepeatedTransactionsList transactions={transactions} />
      </div>
    </div>
  )
}
