import { Box } from "@chakra-ui/react"
import { Outlet } from "@remix-run/react"

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
