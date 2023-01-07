import {
  CashIcon,
  DollarIcon,
  ScaleIcon,
  WithdrawalIcon,
} from "~/components/components"

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
      <div className="avatar">
        <div className="mask mask-decagon bg-base-100  p-">
          <img
            src={`${name === "Yuval" ? "/yuval.jpeg" : "/ran-moran.png"}`}
            alt="Avatar Tailwind CSS Component"
            className="mask mask-decagon"
          />
        </div>
      </div>
      <div className="stats shadow w-full">
        <div className="stat max-w-1/8">
          <div className="stat-figure text-success">
            <DollarIcon />
          </div>
          <div className="stat-title text-sm">Profit</div>
          <div className="stat-value">{Math.round(profit)}</div>
          <div className="stat-desc break-normal invisible lg:visible max-w-[100px]">
            net income
          </div>
        </div>
        <div className="stat max-w-1/8">
          <div className="stat-figure text-error">
            <CashIcon />
          </div>
          <div className="stat-title text-sm">Expense</div>
          <div className="stat-value">{Math.round(expense)}</div>
          <div className="stat-desc break-normal invisible lg:visible max-w-[100px]">
            costs for refund
          </div>
        </div>
        <div className="stat max-w-1/8">
          <div className="stat-figure text-error">
            <WithdrawalIcon />
          </div>
          <div className="stat-title text-sm">Withdrawal</div>
          <div className="stat-value">{Math.round(withdrawal)}</div>
          <div className="stat-desc break-normal invisible lg:visible max-w-[100px]">
            already withdrawn
          </div>
        </div>

        <div className="stat max-w-1/6">
          <div className="stat-figure text-secondary">
            <ScaleIcon />
          </div>
          <div className="stat-title text-sm">Remains</div>
          <div className="stat-value">{Math.round(remains)}</div>
          <div className="stat-desc break-normal invisible lg:visible max-w-[100px]">
            left to withdraw
          </div>
        </div>
      </div>
    </div>
  )
}
