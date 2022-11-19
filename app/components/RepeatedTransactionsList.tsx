import { Transaction } from "@prisma/client"
import { Form } from "@remix-run/react"
import { RepeatedTransactionsFormRow } from "./RepeatedTransactionsFormRow"

type IProps = {
  transactions: Transaction[]
}

export function RepeatedTransactionsList({ transactions }: IProps) {
  return (
    <div className="relative p-10 m-6 bg-base-100 rounded-box">
      <Form method="post" className="grid grid-cols-6">
        <label className="mr-2"></label>
        <label className="mr-2">Type</label>
        <label className="mr-2">Action</label>
        <label className="mr-2">Owner</label>
        <label className="mr-2">Amount</label>
        <label className="mr-2">Description</label>

        {transactions?.map((t) => {
          const transaction: Transaction = {
            ...t,
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt),
          }
          return (
            <RepeatedTransactionsFormRow transaction={transaction} key={t.id} />
          )
        })}
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </Form>
    </div>
  )
}
