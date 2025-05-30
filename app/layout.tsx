import type React from "react"
import { NextUIProvider } from "@nextui-org/react"
import { Nunito } from "next/font/google"
import "./globals.css"

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
})

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
    <html lang="en" className="light">
      <body className={nunito.className}>
        <NextUIProvider>
          <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-gray-100">{children}</main>
        </NextUIProvider>
      </body>
    </html>
  )
}
