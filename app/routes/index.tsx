import { Box, Heading } from "@chakra-ui/react"
import { LoaderFunction, redirect } from "remix"

export const loader: LoaderFunction = async ({}) => {
  const currentYear = new Date().getFullYear().toString()
  return redirect(`/${currentYear.slice(2, 4)}-00/transactions`)
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
