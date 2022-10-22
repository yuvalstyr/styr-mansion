import { Transaction } from "@prisma/client"
import { TransactionItem } from "./TransactionItem"

type IProps = {
  transactions: Transaction[]
  isBusy: boolean
}

export function TransactionsList({ transactions, isBusy }: IProps) {
  return (
    <div>
      <div className="text-[length:32px] font-bold">Transactions</div>
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
