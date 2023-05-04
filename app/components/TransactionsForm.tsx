import { Transaction } from "@prisma/client"
import { Form, Link, useLocation, useNavigation } from "@remix-run/react"
import { useWindowSize } from "usehooks-ts"
import { LabelText } from "~/components/components"
import { checkIfOnPath } from "~/routes/$time/transactions"
import { getOptions } from "~/utils/form"

type IProps = {
  transaction?: Transaction
  year?: string
  month?: string
  link: string
}

export function TransactionsForm(props: IProps) {
  const { transaction: t, month, year, link } = props
  const { width } = useWindowSize()
  const location = useLocation()
  const isOnNew = checkIfOnPath(location.pathname, "new")
  const isMediumScreen = width < 1440
  //  remix hooks
  const transition = useNavigation()

  const isSubmitting = transition.state === "submitting"
  return (
    <Form
      method="post"
      className="grid grid-cols-1 gap-x-4 gap-y-2 lg:grid-cols-2"
    >
      <div className="min-w-[100px]">
        <div className="flex flex-wrap items-center gap-1">
          <LabelText>
            <label> Type:</label>
          </LabelText>
        </div>
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
      <div className="min-w-[100px]">
        <div className="flex flex-wrap items-center gap-1">
          <LabelText>
            <label>Action:</label>
          </LabelText>
        </div>
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
      <div className="min-w-[100px]">
        <div className="flex flex-wrap items-center gap-1">
          <LabelText>
            <label>Transaction Owner:</label>
          </LabelText>
        </div>
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
      <div className="min-w-[100px]">
        <div className="flex flex-wrap items-center gap-1">
          <LabelText>
            <label>Amount (🇮🇱 NIS ₪):</label>
          </LabelText>
        </div>
        <input
          type="number"
          name="amount"
          defaultValue={t?.amount}
          className={"input w-full max-w-xs bg-gray-300 text-black"}
          placeholder="please enter amount"
          min="0"
        />
      </div>
      <div className="min-w-[100px]">
        <div className="flex flex-wrap items-center gap-1">
          <LabelText>
            <label>Month:</label>
          </LabelText>
        </div>
        <select
          placeholder=" "
          name="month"
          className="select w-full max-w-xs bg-gray-300 text-black"
          key={t?.id ?? "new"}
          defaultValue={t?.month || Number(month)}
        >
          <option value="" className="disabled">
            --Please choose Month--
          </option>
          {getOptions("MONTH")}
        </select>
      </div>
      <div className="min-w-[100px]">
        <div className="flex flex-wrap items-center gap-1">
          <LabelText>
            <label>Year:</label>
          </LabelText>
        </div>
        <select
          placeholder=" "
          name="year"
          key={t?.id ?? "new"}
          className="select w-full max-w-xs bg-gray-300 text-black"
          defaultValue={t?.year || Number(year)}
        >
          <option value="" className="disabled">
            --Please choose Year--
          </option>
          {getOptions("YEAR")}
        </select>
      </div>
      <div className="min-w-[100px]">
        <div className="flex flex-wrap items-center gap-1">
          <LabelText>
            <label>Description:</label>
          </LabelText>
        </div>
        <input
          name="description"
          defaultValue={t?.description}
          key={t?.id ?? "new"}
          placeholder="Please enter description"
          className="input w-full max-w-xs bg-gray-300 text-black"
        />
      </div>
      <div className="col-span-1 lg:col-span-2">
        <div className="grid justify-center grid-cols-2 gap-2">
          <button
            type="submit"
            name="intent"
            value="create-transaction"
            className="justify-self-end btn btn-primary max-w-[150px] min-w-[150px]"
          >
            {false ? "Submitting..." : t ? "Update" : "Create"}
          </button>
          {t ? (
            <button
              type="reset"
              disabled={false}
              className={"btn btn-primary max-w-[150px] min-w-[150px]"}
            >
              <Link to={"../../new"}>Back</Link>
            </button>
          ) : (
            <Link to={"../../transactions"}>
              <button
                type="reset"
                disabled={false}
                className={`btn btn-primary max-w-[150px] min-w-[150px] ${
                  isOnNew ? "lg:hidden" : ""
                }`}
              >
                Back
              </button>
            </Link>
          )}
        </div>
      </div>
    </Form>
  )
}
