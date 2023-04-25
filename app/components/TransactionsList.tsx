import {
  Transaction,
  TransactionAction,
  TransactionOwner,
  TransactionType,
} from "@prisma/client"
import { Link, useLocation, useSearchParams, useSubmit } from "@remix-run/react"
import { useRef } from "react"
import { getOptions } from "~/utils/form"
import { TransactionItem } from "./TransactionItem"
import { LabelText } from "./components"

type IProps = {
  transactions: Transaction[]
  isBusy: boolean
}

export function TransactionsList({ transactions, isBusy }: IProps) {
  const location = useLocation()
  const submit = useSubmit()
  const [searchParams, setSearchParams] = useSearchParams()
  const refAction = useRef<HTMLSelectElement>(null)
  const refType = useRef<HTMLSelectElement>(null)
  const refOwner = useRef<HTMLSelectElement>(null)

  const isOnNew = location.pathname.includes("new")
  const type = searchParams.get("type") as TransactionType
  const action = searchParams.get("action") as TransactionAction
  const owner = searchParams.get("owner") as TransactionOwner

  function clearForm() {
    setSearchParams({ type: "", action: "", owner: "" })
    refAction.current?.value && (refAction.current.value = "")
    refType.current?.value && (refType.current.value = "")
    refOwner.current?.value && (refOwner.current.value = "")
    submit(null, { method: "get", action: location.pathname, replace: true })
  }

  const transactionsFiltered = transactions?.filter((t) => {
    return (
      (type ? t.type === type : true) &&
      (action ? t.action === action : true) &&
      (owner ? t.owner === owner : true)
    )
  })

  return (
    <div className="relative p-6 m-3 bg-base-100 rounded-box">
      <div className="flex justify-between">
        <div className="flex">
          <div className="text-[length:32px] font-bold">Transactions</div>
          <form method="get" className="-mt-5 mb-2 ml-2 flex">
            <div className="flex flex-wrap items-center max-w-[150px]">
              <LabelText>
                <label className="ml-2">Type:</label>
              </LabelText>
              <select
                name="type"
                ref={refType}
                defaultValue={type || ""}
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
                ref={refAction}
                defaultValue={action || ""}
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
                ref={refOwner}
                defaultValue={owner || ""}
                className="select text-xs lg:text-sm w-full max-w-sm input-ghost text-primary-content rounded-full border-opacity-30"
              >
                {getOptions("OWNER", true)}
              </select>
            </div>
            <button type="submit" className="btn btn-primary ml-3 mt-5">
              filter
            </button>
            <button
              type="button"
              className="btn btn-primary ml-3 mt-5"
              onClick={clearForm}
            >
              clear
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
            {transactionsFiltered?.map((t) => {
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
