import { Transaction } from "@prisma/client"
import { Link, useLocation } from "@remix-run/react"
import { TransactionItem } from "./TransactionItem"

type IProps = {
  transactions: Transaction[]
  isBusy: boolean
}

export function TransactionsList({ transactions, isBusy }: IProps) {
  const location = useLocation()
  const isOnNew = location.pathname.includes("new")
  return (
    <div className="relative p-10 m-6 bg-base-100 rounded-box">
      <div className="flex justify-between">
        <div className="text-[length:32px] font-bold">Transactions</div>
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
            {transactions?.map((t) => {
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
