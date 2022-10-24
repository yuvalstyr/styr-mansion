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
      <div className="grid grid-cols-[3fr,4fr] border-base-content border-2 border-opacity-20 items-center">
        <h1 className="font-serif text-2xl font-normal leading-normal text-primary-content mt-0 mb-2">
          {title ?? "no title"}
        </h1>
        <div className="grid grid-cols-3 gap-1 items-center lg:grid-cols-[minmax(200px,1fr),minmax(200px,1fr),2fr] mt-0 mb-2">
          <div className="min-w-[150px]">
            <div className="flex flex-wrap items-center ">
              <LabelText>
                <label>Time Period:</label>
              </LabelText>
            </div>
            <select
              placeholder=" "
              name="month"
              defaultValue={Number(monthInput ?? 0)}
              className="select w-full max-w-xs input-ghost text-primary-content rounded-full border-opacity-30"
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
              className="select w-full max-w-xs input-ghost text-primary-content rounded-full border-opacity-30"
            >
              {getOptions("YEAR")}
            </select>
          </div>
          <button
            className="btn btn-primary max-w-[150px] min-w-[150px] mt-6 ml-2 rounded-lg"
            type="submit"
          >
            Select
          </button>
        </div>
      </div>
    </Form>
  )
}
