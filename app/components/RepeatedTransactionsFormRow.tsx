import { Transaction } from "@prisma/client"
import { useLocation, useTransition } from "@remix-run/react"
import { checkIfOnPath } from "~/routes/$time/transactions"
import { getOptions } from "~/utils/form"

type IProps = {
  transaction?: Transaction
}

export function RepeatedTransactionsFormRow(props: IProps) {
  const { transaction: t } = props
  const location = useLocation()
  const isOnNew = checkIfOnPath(location.pathname, "new")
  //  remix hooks
  const transition = useTransition()

  const isSubmitting = Boolean(transition.submission)
  return (
    <>
      <div className="min-w-[100px] mr-2 mt-2 max-w-xs">
        <input
          type="checkbox"
          name="include"
          className="checkbox checkbox-primary"
          defaultChecked={true}
        />
      </div>
      <div className="min-w-[100px] mr-2 mt-2">
        <select
          placeholder=" "
          name="type"
          className="select w-full max-w-xs bg-gray-300 text-black"
          key={t?.id ?? "new"}
          defaultValue={t?.type}
        >
          <option value="" className="disabled">
            --Please choose Type--
          </option>
          {getOptions("TYPE")}
        </select>
      </div>
      <div className="min-w-[100px] mr-2 mt-2">
        <select
          key={t?.id ?? "new"}
          placeholder=" "
          name="action"
          className="select w-full max-w-xs bg-gray-300 text-black"
          defaultValue={t?.action}
        >
          <option value="" className="disabled">
            --Please choose Action--
          </option>
          {getOptions("ACTION")}
        </select>
      </div>
      <div className="min-w-[100px] mr-2 mt-2">
        <select
          placeholder=" "
          name="owner"
          defaultValue={t?.owner}
          key={t?.id ?? "new"}
          className="select w-full max-w-xs bg-gray-300 text-black"
        >
          <option value="" className="disabled">
            --Please choose Owner--
          </option>
          {getOptions("OWNER")}
        </select>
      </div>
      <div className="min-w-[100px] mr-2 mt-2">
        <input
          type="number"
          name="amount"
          defaultValue={t?.amount}
          className={"input w-full max-w-xs bg-gray-300 text-black"}
          placeholder="please enter amount"
        />
      </div>
      <div className="min-w-[100px] mr-2 mt-2">
        <input
          name="description"
          defaultValue={t?.description}
          key={t?.id ?? "new"}
          placeholder="Please enter description"
          className="input w-full max-w-xs bg-gray-300 text-black"
        />
      </div>
      <input
        name="month"
        key={t?.month ?? "new"}
        defaultValue={t?.month}
        className="hidden"
      />
      <input
        name="year"
        key={t?.year ?? "new"}
        defaultValue={t?.year}
        className="hidden"
      />
    </>
  )
}
