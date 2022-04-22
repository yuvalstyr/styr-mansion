import { Box } from "@chakra-ui/react"
import { LoaderFunction, Outlet } from "remix"
import invariant from "tiny-invariant"
import { getFormTitle } from "~/utils/form"

type LoaderData = {
  title: string
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const { time } = params
  invariant(typeof time === "string", "time must be a string")
  const [year, month] = time.split("-")
  const formDate = new Date(+year, month)
  const title = getFormTitle({ year, month })

  return { title }
}

export default function StatisticRoute() {
  return (
    <Box maxW="7xl" mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <Outlet />
    </Box>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return <div>Uh oh. I did a whoopsies</div>
}
