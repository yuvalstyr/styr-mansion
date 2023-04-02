import { Transaction } from "@prisma/client"
import type { LoaderArgs } from "@remix-run/node"
import { Link, useFetcher, useLocation } from "@remix-run/react"
import { getOptions } from "~/utils/form"
import { LabelText } from "./components"
import { TransactionItem } from "./TransactionItem"

type IProps = {
  transactions: Transaction[]
  isBusy: boolean
}

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url)
  const action = url.searchParams.get("action")
  console.log({ action })
  return {}
}

export function TransactionsList({ transactions, isBusy }: IProps) {
  const location = useLocation()
  const filterFetcher = useFetcher()
  const isOnNew = location.pathname.includes("new")
  const filteredTransactions = transactions.filter(
    (t) => t.type === "WITHDRAWAL"
  )
  return (
    <div className="relative p-6 m-3 bg-base-100 rounded-box">
      <div className="flex justify-between">
        <div className="flex">
          <div className="text-[length:32px] font-bold">Transactions</div>
          <form method="get" className="flex -mt-5 mb-2 ml-2">
            <div className="flex flex-wrap items-center max-w-[150px]">
              <LabelText>
                <label className="ml-2">Type:</label>
              </LabelText>
              <select
                name="type"
                className="select text-xs lg:text-sm w-full max-w-sm input-ghost text-primary-content rounded-full border-opacity-30"
              >
                {getOptions("TYPE", true)}
              </select>
            </div>
            <div className="flex flex-wrap items-center max-w-[150px]">
              <LabelText>
                <label className="ml-2">Action:</label>
              </LabelText>
              <select
                name="action"
                className="select text-xs lg:text-sm w-full max-w-sm input-ghost text-primary-content rounded-full border-opacity-30"
              >
                {getOptions("ACTION", true)}
              </select>
            </div>
            <div className="flex flex-wrap items-center max-w-[150px]">
              <LabelText>
                <label className="ml-2">Owner:</label>
              </LabelText>
              <select
                name="owner"
                className="select text-xs lg:text-sm w-full max-w-sm input-ghost text-primary-content rounded-full border-opacity-30"
              >
                {getOptions("OWNER", true)}
              </select>
            </div>
            <button
              onClick={() => {
                filterFetcher.submit(
                  { query: "whatever" },
                  { method: "get", action: "/transactions" }
                )
              }}
              name="intent"
              value={"filter"}
              className="btn btn-primary ml-3 mt-5"
            >
              filter
            </button>
          </form>
        </div>
        <div className="grid grid-flow-col gap-2 mb-1">
          {!isOnNew ? (
            <Link to="new">
              <button
                type="submit"
                name="intent"
                value="create-transaction"
                className="justify-self-end btn btn-primary max-w-[150px] min-w-[150px]"
              >
                Add
              </button>
            </Link>
          ) : null}
          <Link to="repeated">
            <button
              type="submit"
              name="intent"
              value="create-transaction"
              className="justify-self-end btn btn-primary max-w-[150px] min-w-[150px]"
            >
              Repeated
            </button>
          </Link>
          <Link to="electricity">
            <button
              type="submit"
              name="intent"
              value="create-transaction"
              className="justify-self-end btn btn-primary max-w-[150px] min-w-[150px]"
            >
              Electricity
            </button>
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th>Type</th>
              <th>Action</th>
              <th>Owner</th>
              <th>Amount</th>
              <th>Month</th>
              <th>Year</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions?.map((t) => {
              const transaction: Transaction = {
                ...t,
                createdAt: new Date(t.createdAt),
                updatedAt: new Date(t.updatedAt),
              }
              return (
                <TransactionItem
                  isBusy={isBusy}
                  transaction={transaction}
                  key={t.id}
                />
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
