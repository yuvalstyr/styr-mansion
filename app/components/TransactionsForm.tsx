import {
  Button,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
} from "@chakra-ui/react"
import { Transaction } from "@prisma/client"
import { Form, Link, useNavigate, useTransition } from "@remix-run/react"
import { convertMonthIntToFirstPeriodMonth, getOptions } from "~/utils/form"

type IProps = {
  transaction?: Transaction
  year?: string
  month?: string
}

export function TransactionsForm(props: IProps) {
  const { transaction: t } = props

  //  remix hooks
  let navigate = useNavigate()
  const transition = useTransition()

  const isSubmitting = Boolean(transition.submission)
  function onBack() {
    if (t) {
      const fixYear = String(t.year).slice(2, 4)
      const fixMonth = convertMonthIntToFirstPeriodMonth(t.month)
      navigate(`/${fixYear}-${fixMonth}/transactions/new`)
    }
    throw new Error("back button without a transaction provided")
  }

  return (
    <Form method="post">
      <label>
        Type:
        <Select placeholder=" " name="type" defaultValue={t?.type}>
          {getOptions("TYPE")}
        </Select>
      </label>
      <label>
        Action:
        <Select placeholder=" " name="action" defaultValue={t?.action}>
          {getOptions("ACTION")}
        </Select>
      </label>
      <label>
        Transaction Owner:
        <Select placeholder=" " name="owner" defaultValue={t?.owner}>
          {getOptions("OWNER")}
        </Select>
      </label>
      <label>
        Amount (🇮🇱 NIS ₪):
        <NumberInput
          precision={2}
          step={1}
          name="amount"
          defaultValue={t?.amount}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </label>
      <label>
        Month:
        <Select placeholder=" " name="month" defaultValue={t?.month}>
          {getOptions("MONTH")}
        </Select>
      </label>
      <label>
        Year:
        <Select placeholder=" " name="year" defaultValue={t?.year}>
          {getOptions("YEAR")}
        </Select>
      </label>
      <label>
        Description:
        <Input
          name="description"
          defaultValue={t?.description}
          placeholder="Description"
        />
      </label>
      <Button
        type="submit"
        disabled={isSubmitting}
        name="intent"
        value="create-transaction"
      >
        {isSubmitting ? "Submitting..." : t ? "Update" : "Create"}
      </Button>
      {t ? (
        <Link to={"../../new"}>
          <Button onClick={onBack} disabled={isSubmitting}>
            Back
          </Button>
        </Link>
      ) : null}
    </Form>
  )
}
