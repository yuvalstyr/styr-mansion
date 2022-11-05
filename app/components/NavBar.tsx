import { NavLink } from "@remix-run/react"
import { useWindowSize } from "usehooks-ts"

export function NavBar({ transactionsLink }: { transactionsLink: string }) {
  const { width } = useWindowSize()
  const isMediumScreen = width < 1440
  return (
    <nav className="navbar bg-base-100 sticky top-0 z-30">
      <div className="flex-1 font-sans text-lg md:text-3xl">
        <a className="btn btn-ghost normal-case text-xl">
          <span className="text-primary">Styr</span>
          <span className="text-base-content">Mansion</span>
        </a>
      </div>
      <div>
        <div className="btn gap-1 normal-case btn-ghost">
          <NavLink to="/">
            <span className="text-base-content">Dashboard</span>
          </NavLink>
        </div>
        <div className="btn gap-1 normal-case btn-ghost">
          <NavLink
            to={isMediumScreen ? transactionsLink : `${transactionsLink}/new`}
          >
            <span className="text-base-content">Transactions</span>
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
