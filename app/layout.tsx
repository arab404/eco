import type React from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CallProvider } from "@/components/call-provider"
import { ToastProvider } from "@/components/ui/toast-provider"
import ErrorBoundary from "@/components/error-boundary"
import { FirebaseInit } from "@/components/firebase-init"
import { FirebaseDebug } from "@/components/firebase-debug"

export const metadata = {
  title: "Ecohub - Connect with Like-minded Individuals",
  description: "Find your perfect match with Ecohub, the premier dating platform.",
  generator: "v0.dev",
}

// Add FirebaseInit to your layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ErrorBoundary>
            <CallProvider>
              <ToastProvider />
              {children}
              <FirebaseInit />
              {process.env.NODE_ENV === "development" && <FirebaseDebug />}
            </CallProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
