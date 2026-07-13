import type { Metadata } from "next"
import { Inter, Manrope, Roboto_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
})

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Supabase Docs",
  description: "Discover how to set up a database to an app making queries in just a few minutes.",
}

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
    className={`${inter.variable} ${manrope.variable} ${robotoMono.variable} h-full antialiased`}
  >
    <head>
      <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
    </head>
    <body className="flex min-h-full flex-col">{children}</body>
  </html>
)

export default RootLayout
