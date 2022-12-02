import { Form, Link } from "@remix-run/react"
import { v4 as uuid } from "uuid"
import { TransactionInput } from "~/models/transactions.server"
import { LabelText } from "./components"
import { RepeatedTransactionsFormRow } from "./RepeatedTransactionsFormRow"

type IProps = {
  transactions: TransactionInput[]
  backLink: string
  months: number[]
}

export function RepeatedTransactionsForm({
  transactions,
  backLink,
  months,
}: IProps) {
  return (
    <div className="relative p-10 m-6 bg-base-100 rounded-box">
      <Form method="post">
        <div className="flex justify-between">
          <div className="min-w-[150px]">
            <div className="flex flex-wrap items-center ">
              <LabelText>
                <label>Month:</label>
              </LabelText>
            </div>
            <select
              placeholder=" "
              name="month-select"
              className="select text-xs lg:text-sm w-full max-w-sm input-ghost text-primary-content rounded-full border-opacity-30"
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-action">
            <Link to={backLink}>
              <button className="btn btn-primary">X</button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-[30px,repeat(5,1fr)] items-center">
          <label className="mr-2"></label>
          <label className="mr-2">Type</label>
          <label className="mr-2">Action</label>
          <label className="mr-2">Owner</label>
          <label className="mr-2">Amount</label>
          <label className="mr-2">Description</label>

          {transactions?.map((t) => {
            return <RepeatedTransactionsFormRow transaction={t} key={uuid()} />
          })}
          <button type="submit" className="btn btn-primary col-start-4 mt-3">
            Save
          </button>
        </div>
      </Form>
    </div>
  )
}
