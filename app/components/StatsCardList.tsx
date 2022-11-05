import { TransactionOwner } from "@prisma/client"
import { MORAN_RAN, StyrSummary, TenantSummary } from "~/logic/cost-balancer"
import { StatsCard } from "./StatsCard"

type StatsCardListProps = {
  styrBalance: StyrSummary
  tenantBalance: TenantSummary
}

// round to 2 decimals
function round(value: number) {
  return Math.round(value * 100) / 100
}

export function StatsCardList({
  styrBalance,
  tenantBalance,
}: StatsCardListProps) {
  const ranMoran = styrBalance?.[MORAN_RAN]
  const yuval = styrBalance?.[TransactionOwner.Yuval]

  return (
    <div className="grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 ">
      <StatsCard
        expense={round(ranMoran.expense)}
        profit={round(ranMoran.profit)}
        remains={round(ranMoran.remains)}
        withdrawal={round(ranMoran.withdrawal)}
        key={MORAN_RAN}
        name={MORAN_RAN}
      />
      <StatsCard
        expense={round(yuval.expense)}
        profit={round(yuval.profit)}
        remains={round(yuval.remains)}
        withdrawal={round(yuval.withdrawal)}
        key={TransactionOwner.Yuval}
        name={TransactionOwner.Yuval}
      />
    </div>
  )
}
