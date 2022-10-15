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
import { Link, useFetcher, useNavigate, useTransition } from "@remix-run/react"
import { getOptions } from "~/utils/form"

type IProps = {
  transaction?: Transaction
  year?: string
  month?: string
}

export function TransactionsForm(props: IProps) {
  const { transaction: t, year, month } = props
  console.log({ year, month })
  //  remix hooks
  let navigate = useNavigate()
  const transition = useTransition()
  const fetcher = useFetcher()

  const isSubmitting = Boolean(transition.submission)
  function onBack() {
    navigate(-1)
  }
  return (
    <fetcher.Form method="post" action={`/${year}-${month}/transactions`}>
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
      <Link to={`/${year}-${month}/transactions/new`}>
        <Button disabled={isSubmitting}>Back</Button>
      </Link>
    </fetcher.Form>
  )
}
