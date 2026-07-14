import type { Metadata } from "next"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import { AgentDirective } from "@/features/agent-docs/agent-directive"
import "./globals.css"

export const metadata: Metadata = {
  title: "Supabase Docs",
  description: "Discover how to set up a database to an app making queries in just a few minutes.",
  metadataBase: new URL("https://supabase.com"),
  robots: { index: true, follow: true },
}

// Keep the storage key synchronized with theme-toggle.tsx.
const THEME_SCRIPT = `
  try {
    const storedTheme = localStorage.getItem("supabase-docs-theme");
    const theme = storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.dataset.theme = "dark";
  }
`

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <html
    lang="en"
    data-theme="dark"
    suppressHydrationWarning
    className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
  >
    <head>
      <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
    </head>
    <body className="flex min-h-full flex-col">
      <AgentDirective />
      {children}
    </body>
  </html>
)

export default RootLayout
