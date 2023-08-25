import type { LinksFunction, V2_MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react"
import styles from "./styles/app.css"

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }]
}

export const meta: V2_MetaFunction = () => [
  { charset: "utf-8" },
  { viewport: "width=device-width,initial-scale=1" },
  { title: "Styr Mansion" },
]

export function ErrorBoundary() {
  const error = useRouteError()
  if (isRouteErrorResponse(error)) return <div>Uh oh. I did a whoopsies</div>

  // Don't forget to typecheck with your own logic.
  // Any value can be thrown, not just errors!
  let errorMessage = "Unknown error"
  if (isDefinitelyAnError(error)) {
    errorMessage = error.message
  }
  return (
    <div>
      <h1>Uh oh ...</h1>
      <p>Something went wrong.</p>
      <pre>{errorMessage}</pre>
    </div>
  )
}

export function isDefinitelyAnError(error: unknown): error is Error {
  return error instanceof Error
}

function Document({
  children,
  title = "App title",
}: {
  children: React.ReactNode
  title?: string
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body className="h-screen max-h-screen">
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  )
}
