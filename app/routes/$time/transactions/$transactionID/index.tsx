import {
  TransactionAction,
  TransactionOwner,
  TransactionType,
} from "@prisma/client"
import { ActionFunction, LoaderArgs, redirect } from "@remix-run/node"
import { Link, Outlet, useFetcher, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import { LabelText } from "~/components"
import { updateTransaction } from "~/models/transactions.server"
import { db } from "~/utils/db.server"
import { convertMonthStrTo2CharStr, getOptions } from "~/utils/form"

export async function loader({ params }: LoaderArgs) {
  const id = params.transactionID
  const transaction = await db.transaction.findFirst({ where: { id } })
  if (!transaction) {
    return { transaction: null }
  }
  return { transaction }
}

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData()
  const type = form.get("type") as TransactionType
  const action = form.get("action") as TransactionAction
  const owner = form.get("owner") as TransactionOwner
  const amount = form.get("amount")
  const description = form.get("description")
  const month = form.get("month") ?? "00"
  const year = form.get("year") ?? "00"
  const id = params.transactionID
  invariant(typeof month === "string", "month must be a string")
  invariant(typeof year === "string", "year must be a string")
  if (typeof amount !== "string" || typeof description !== "string") {
    return `Form not submitted correctly.`
  }
  await updateTransaction({
    data: {
      action: action,
      type: type,
      owner: owner,
      amount: Number(amount),
      description: description,
      month: String(Number(month)),
      year: String(Number(year)),
    },
    where: { id: id ?? "" },
  })
  const monthFix = Number(month) % 2 ? month : String(Number(month) - 1)
  const redirectURL = `/${year.slice(2, 4)}-${convertMonthStrTo2CharStr(
    monthFix
  )}/transactions`
  return redirect(redirectURL)
}
// TODO check how to make error boundary as outlet

export default function UpdateTransactionRoute() {
  const data = useLoaderData<typeof loader>()
  const { transaction } = data
  const fetcher = useFetcher()

  if (!transaction) {
    return (
      <div>
        <div>Transaction not found</div>
      </div>
    )
  }
  const t = {
    ...transaction,
    createdAt: new Date(transaction.createdAt),
    updatedAt: new Date(transaction.updatedAt),
  }

  return (
    <div className="relative p-10 m-6 bg-base-100 rounded-box">
      <div className="text-[length:32px] font-bold">Update Transactions</div>
      <fetcher.Form
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
            className="select w-full max-w-xs text-black bg-white"
            key={t?.id ?? "new"}
          >
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
            className="select w-full max-w-xs text-black bg-white"
            defaultValue={t?.action}
          >
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
            className="select w-full max-w-xs text-black bg-white"
          >
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
            className={"input w-full max-w-xs text-black bg-white"}
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
            className="select w-full max-w-xs text-black bg-white"
            key={t?.id ?? "new"}
            defaultValue={t?.month}
          >
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
            className="select w-full max-w-xs text-black bg-white"
          >
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
            placeholder="Description"
            className="input w-full max-w-xs text-black bg-white"
          />
        </div>
        <div className="col-span-1 lg:col-span-2">
          <div className="grid justify-center grid-cols-2 gap-2">
            <button
              type="submit"
              disabled={false}
              name="intent"
              value="create-transaction"
              className="justify-self-end btn btn-primary max-w-[150px] min-w-[150px]"
            >
              {false ? "Submitting..." : t ? "Update" : "Create"}
            </button>
            {t ? (
              <button
                disabled={false}
                className={"btn btn-primary max-w-[150px] min-w-[150px]"}
              >
                <Link to={"../.."}>Back</Link>
              </button>
            ) : null}
          </div>
        </div>
      </fetcher.Form>
      <Outlet />
    </div>
  )
}
