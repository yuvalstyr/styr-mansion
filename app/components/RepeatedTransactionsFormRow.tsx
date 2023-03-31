import { useLocation, useNavigation } from "@remix-run/react"
import { v4 as uuid } from "uuid"
import { TransactionInput } from "~/models/transactions.server"
import { checkIfOnPath } from "~/routes/$time/transactions"
import { getOptions } from "~/utils/form"

type IProps = {
  transaction?: TransactionInput
  index?: number
}

export function RepeatedTransactionsFormRow(props: IProps) {
  const { transaction: t } = props
  const location = useLocation()
  const isOnNew = checkIfOnPath(location.pathname, "new")
  //  remix hooks
  const transition = useNavigation()

  const isSubmitting = Boolean(transition.state === "submitting")
  return (
    <>
      <div className="min-w-[100px] mr-2 mt-2 max-w-xs">
        <input
          type="checkbox"
          name={`include-${props.index}`}
          className="checkbox checkbox-primary"
          defaultChecked={true}
        />
      </div>
      <div className="min-w-[100px] mr-2 mt-2">
        <select
          placeholder=" "
          name="type"
          className="select w-full max-w-xs bg-gray-300 text-black"
          key={uuid()}
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
          key={uuid()}
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
          key={uuid()}
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
          key={uuid()}
          defaultValue={t?.amount}
          className={"input w-full max-w-xs bg-gray-300 text-black"}
          placeholder="please enter amount"
        />
      </div>
      <div className="min-w-[100px] mr-2 mt-2">
        <input
          name="description"
          defaultValue={t?.description}
          key={uuid()}
          placeholder="Please enter description"
          className="input w-full max-w-xs bg-gray-300 text-black"
        />
      </div>
      <input
        name="year"
        key={uuid()}
        defaultValue={t?.year}
        className="hidden"
      />
    </>
  )
}
