import {
  Transaction,
  TransactionAction,
  TransactionOwner,
  TransactionType,
} from "@prisma/client"
import { ActionFunction, json, LoaderArgs } from "@remix-run/node"
import {
  Outlet,
  useLoaderData,
  useLocation,
  useTransition,
} from "@remix-run/react"
import invariant from "tiny-invariant"
import { TransactionsList } from "~/components/TransactionsList"
import {
  createTransaction,
  deleteTransaction,
  getTransactionsListByYearMonth,
} from "~/models/transactions.server"
import { convertMonthStrTo2CharStr } from "~/utils/form"

export async function loader({ params, request }: LoaderArgs) {
  const { time } = params
  invariant(typeof time === "string", "time must be a string")
  const [year, month] = time.split("-")
  const yearFixed = year === "00" ? undefined : String(Number(year) + 2000)
  const monthFixed = month === "00" ? undefined : String(Number(month))
  const months = monthFixed
    ? [monthFixed, String(Number(monthFixed) + 1)]
    : undefined
  const url = new URL(request.url).pathname
  const routes = url.split("/")
  const isOnTransactions = ["transactions", "new"].includes(
    routes[routes.length - 1]
  )
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
      await createTransaction({
        action,
        type,
        owner,
        amount: Number(amount),
        description,
        month: month,
        year: year,
      })
      const monthFix = Number(month) % 2 ? month : String(Number(month) - 1)
      const redirectURL = `/${year.slice(2, 4)}-${convertMonthStrTo2CharStr(
        monthFix
      )}/transactions`
      console.log("here")
      return json({})

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
  const transition = useTransition()
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
