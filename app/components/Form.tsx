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
import { Form, useNavigate } from "remix"
import { getOptions } from "~/utils/form"

type IProps = {
  transactions?: Transaction
}

export function TransactionsForm(props: IProps) {
  const { transactions: t } = props
  let navigate = useNavigate()
  function onBack() {
    navigate(-1)
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
        Owner:
        <Select placeholder=" " name="owner" defaultValue={t?.owner}>
          {getOptions("OWNER")}
        </Select>
      </label>
      <label>
        Amount (🇮🇱 NIS ₪) :
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
      <Button type="submit">Update</Button>

      <Button onClick={onBack}>Back</Button>
    </Form>
  )
}
