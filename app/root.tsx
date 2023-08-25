import type { LinksFunction, V2_MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
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
