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
import { Form, useNavigate, useTransition } from "@remix-run/react"
import {
  convertYearIntToFullYearStr,
  getMonthIndex,
  getOptions,
} from "~/utils/form"

type IProps = {
  transactions?: Transaction
  year?: string
  month?: string
}

export function TransactionsForm(props: IProps) {
  const { transactions: t, year, month } = props
  let navigate = useNavigate()
  const transition = useTransition()

  const isSubmitting = Boolean(transition.submission)
  function onBack() {
    navigate(-1)
  }
  return (
    <Form method="post" action={`/${year}-${month}/transactions?index`}>
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
        <Select
          placeholder=" "
          name="month"
          defaultValue={getMonthIndex(month)}
        >
          {getOptions("MONTH")}
        </Select>
      </label>
      <label>
        Year:
        <Select
          placeholder=" "
          name="year"
          defaultValue={t?.year ?? convertYearIntToFullYearStr(year)}
        >
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

      <Button onClick={onBack} disabled={isSubmitting}>
        Back
      </Button>
    </Form>
  )
}
