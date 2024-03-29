import {
  Transaction,
  TransactionAction,
  TransactionOwner,
  TransactionType,
} from "@prisma/client"
import { ActionFunction, LoaderFunctionArgs, json } from "@remix-run/node"
import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigation,
} from "@remix-run/react"
import invariant from "tiny-invariant"
import { TransactionsList } from "~/components/TransactionsList"
import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getTransactionsListByYearMonth,
} from "~/models/transactions.server"

export async function loader({ params }: LoaderFunctionArgs) {
  const { time } = params
  invariant(typeof time === "string", "time must be a string")
  if (time === "all") {
    const allTransactions = await getAllTransactions()
    console.log("length", allTransactions.length)
    return json({ transactions: allTransactions, year: "all", month: "all" })
  }
  const [year, month] = time.split("-")
  const yearFixed = year === "00" ? undefined : String(Number(year) + 2000)
  const monthFixed = month === "00" ? undefined : String(Number(month))
  const months = monthFixed
    ? [monthFixed, String(Number(monthFixed) + 1)]
    : undefined

  const transactions = await getTransactionsListByYearMonth({
    year: yearFixed,
    months,
  })

  // check if got transactions
  if (!transactions) {
    throw new Response("No transactions found", { status: 404 })
  }
  return json({ transactions, year, month })
}
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const intent = formData.get("intent")
  switch (intent) {
    case "create-transaction":
      const type = formData.get("type") as TransactionType
      invariant(typeof type === "string", "type must be a string")
      const action = formData.get("action") as TransactionAction
      invariant(typeof action === "string", "action must be a string")
      const owner = formData.get("owner") as TransactionOwner
      invariant(typeof owner === "string", "owner must be a string")
      const amount = formData.get("amount")
      invariant(typeof amount === "string", "amount must be a string")
      const description = formData.get("description")
      invariant(typeof description === "string", "description must be a string")
      const month = formData.get("month")
      invariant(typeof month === "string", "month must be a string")
      const year = formData.get("year")
      invariant(typeof year === "string", "year must be a string")
      if (typeof amount !== "string" || typeof description !== "string") {
        return `Form not submitted correctly.`
      }
      const created = await createTransaction({
        action,
        type,
        owner,
        amount: Number(amount),
        description,
        month: month,
        year: year,
      })

      return json({ created })

    case "delete-transaction":
      const id = formData.get("id") as string
      invariant(typeof id === "string", "id must be a string")
      const transaction = await deleteTransaction(id)

      return json(transaction)

    default: {
      throw new Error(`Unsupported intent: ${intent}`)
    }
  }
}

//  use for responsive design (hide transactions table when on mobile)
export function checkIfOnPath(url: string, path: string) {
  const routes = url.split("/")
  let length = routes.length
  routes[routes.length - 1] === "" ? --length : null
  const isOnTransactions = routes[length - 1] === path

  return isOnTransactions
}

export default function TransactionsRoute() {
  const data = useLoaderData<typeof loader>()
  const transition = useNavigation()
  const isBusy = transition.state === "submitting"
  const location = useLocation()

  const isOnTransactions = checkIfOnPath(location.pathname, "transactions")
  const isOnRepeated = checkIfOnPath(location.pathname, "repeated")

  // covert transactions serialized to model
  const transactions = data.transactions?.map((t) => {
    const transaction: Transaction = {
      ...t,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt),
    }
    return transaction
  })

  // sort by type, action, owner, month, year, amount
  transactions.sort((a, b) => {
    // Sort by year
    if (a.year !== b.year) {
      return Number(a.year) - Number(b.year)
    }

    // Sort by month
    if (a.month !== b.month) {
      return Number(a.month) - Number(b.month)
    }

    // Sort by owner
    const ownerComparison = a.owner.localeCompare(b.owner)
    if (ownerComparison !== 0) {
      return ownerComparison
    }

    // Sort by action
    const actionComparison = a.action.localeCompare(b.action)
    if (actionComparison !== 0) {
      return actionComparison
    }

    // Sort by type
    const typeComparison = a.type.localeCompare(b.type)
    if (typeComparison !== 0) {
      return typeComparison
    }

    // Sort by amount (ascending)
    return b.amount - a.amount
  })

  return (
    <section className="flex flex-1 max-h-[90vh] justify-center">
      <div
        className={`flex-1  overflow-auto ${
          isOnTransactions || isOnRepeated ? "block" : "hidden lg:block"
        }`}
      >
        <TransactionsList isBusy={isBusy} transactions={transactions} />
      </div>
      <div className="overflow-auto">
        <Outlet />
      </div>
    </section>
  )
}
