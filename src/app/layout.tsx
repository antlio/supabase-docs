import type { Metadata } from "next"
import { Inter, Source_Code_Pro } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Supabase Docs",
  description: "Discover how to set up a database to an app making queries in just a few minutes.",
}

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <html lang="en" className={`${inter.variable} ${sourceCodePro.variable} h-full antialiased`}>
    <body className="flex min-h-full flex-col">{children}</body>
  </html>
)

export default RootLayout
