import { Button, HStack, Select, Text } from "@chakra-ui/react"
import { Form } from "@remix-run/react"
import { FormTitleResponse, getOptions } from "~/utils/form"

export function TimeSelectBar({
  title,
  yearInput,
  monthInput,
}: FormTitleResponse) {
  console.log({ title, yearInput, monthInput })
  return (
    <Form method="post">
      <HStack border={"2px"} p={5} flex={1}>
        <label>
          Time Period:
          <Select
            placeholder=" "
            name="month"
            defaultValue={Number(monthInput ?? 0)}
          >
            {getOptions("MONTH_PERIOD")}
          </Select>
        </label>
        <label>
          Year:
          <Select placeholder=" " name="year" defaultValue={yearInput}>
            {getOptions("YEAR")}
          </Select>
        </label>
        <Button type="submit">OK</Button>
        <Text>{title ?? "no title"}</Text>
      </HStack>
    </Form>
  )
}
