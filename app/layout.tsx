import type React from "react"
import { NextUIProvider } from "@nextui-org/react"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Document Reader",
  description: "Extract fields from documents using n8n API integration",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <NextUIProvider>
          <main className="min-h-screen bg-gray-900 dark:bg-gray-900">{children}</main>
        </NextUIProvider>
      </body>
    </html>
  )
}
