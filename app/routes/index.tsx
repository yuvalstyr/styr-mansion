import { Box, Heading } from "@chakra-ui/react"
import { LoaderFunction, redirect } from "@remix-run/node"
import { convertMonthToMonthPeriod } from "~/utils/time"

export const loader: LoaderFunction = async ({}) => {
  const currentYear = new Date().getFullYear().toString()
  const currentMonth = new Date(2022, 10, 1).getMonth()
  const currentMonthStr = convertMonthToMonthPeriod(currentMonth)
  return redirect(`/${currentYear.slice(2, 4)}-${currentMonthStr}/transactions`)
}

export default function StatisticRoute() {
  return (
    <Box maxW="7xl" mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <Heading>You are not suppose to be here!!!!! 🤔🤔🤔🤔🛑🛑🛑</Heading>
    </Box>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return <div>Uh oh. I did a whoopsies</div>
}
