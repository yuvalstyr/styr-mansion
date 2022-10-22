import { Transaction } from "@prisma/client"
import { Form, Link } from "@remix-run/react"
import { EditIcon, TrashIcon } from "~/components"
import { formatMonth } from "~/utils/time"

export function TransactionItem({
  transaction,
  isBusy,
}: {
  transaction: Transaction
  isBusy: boolean
}) {
  const { id, action, type, owner, amount, description, month, year } =
    transaction

  return (
    <tr>
      <td>{type}</td>
      <td>{action}</td>
      <td>{owner}</td>
      <td>{amount}</td>
      <td>{year}</td>
      <td>{formatMonth(month)}</td>
      <td>{description}</td>
      <td>
        <div className="flex">
          <div>
            <Link to={id}>
              <EditIcon />
            </Link>
          </div>
          <Form method="post">
            <input type="hidden" name="id" value={id} />
            <button
              type="submit"
              disabled={isBusy}
              name="intent"
              value="delete-transaction"
            >
              <TrashIcon />
            </button>
          </Form>
        </div>
      </td>
    </tr>
  )
}
