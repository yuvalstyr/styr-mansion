import { Form } from "@remix-run/react"
import { LabelText } from "~/components"
import { FormTitleResponse, getOptions } from "~/utils/form"

export function TimeSelectBar({
  title,
  yearInput,
  monthInput,
}: FormTitleResponse) {
  return (
    <Form method="post">
      <div className="grid grid-cols-[4fr,2fr] border-base-content border-2 border-opacity-20">
        <div className="grid grid-cols-3 gap-1 items-center lg:grid-cols-[1fr,1fr,4fr]">
          <div className="min-w-[100px]">
            <div className="flex flex-wrap items-center ">
              <LabelText>
                <label>Time Period:</label>
              </LabelText>
            </div>
            <select
              placeholder=" "
              name="month"
              defaultValue={Number(monthInput ?? 0)}
              className="select w-full max-w-xs input-ghost text-primary-content rounded-full"
            >
              {getOptions("MONTH_PERIOD")}
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
              defaultValue={yearInput}
              className="select w-full max-w-xs input-ghost text-primary-content rounded-full"
            >
              {getOptions("YEAR")}
            </select>
          </div>
          <button className="btn btn-primary btn-circle self-end" type="submit">
            OK
          </button>
        </div>
        <h1>{title ?? "no title"}</h1>
      </div>
    </Form>
  )
}
