import { CashIcon, DollarIcon, ScaleIcon } from "~/components"

export interface StatsCardProps {
  profit: number
  withdrawal: number
  expense: number
  remains: number
  name: string
}

export function StatsCard(props: StatsCardProps) {
  const { profit, expense, remains, withdrawal, name } = props
  return (
    <div className="p-2 grid grid-cols-[1fr,7fr]">
      <div className="mask grid place-items-center bg-accent h-full rounded-box">
        <h2 className=" text-accent-content  max-h-fit">{name}</h2>
      </div>
      <div className="stats shadow w-full">
        <div className="stat max-w-1/6">
          <div className="stat-figure text-success">
            <DollarIcon />
          </div>
          <div className="stat-title text-sm">Profit</div>
          <div className="stat-value">{Math.round(profit)}</div>
          <div className="stat-desc invisible lg:visible max-w-[100px]">
            net income after expense reduction
          </div>
        </div>
        <div className="stat max-w-1/6">
          <div className="stat-figure text-error">
            <CashIcon />
          </div>
          <div className="stat-title text-sm">Expense</div>
          <div className="stat-value">{Math.round(expense)}</div>
          <div className="stat-desc invisible lg:visible max-w-[100px]">
            returning costs
          </div>
        </div>

        <div className="stat max-w-1/6">
          <div className="stat-figure text-secondary">
            <ScaleIcon />
          </div>
          <div className="stat-title text-sm">Remains</div>
          <div className="stat-value">{Math.round(remains)}</div>
          <div className="stat-desc invisible lg:visible max-w-[100px]">
            withdrawal funds
          </div>
        </div>
      </div>
    </div>
  )
}
