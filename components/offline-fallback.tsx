"use client"

import { WifiOff, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface OfflineFallbackProps {
  title?: string
  description?: string
  onRetry?: () => void
  isRetrying?: boolean
}

export function OfflineFallback({
  title = "You're offline",
  description = "We couldn't load your data because you're currently offline.",
  onRetry,
  isRetrying = false,
}: OfflineFallbackProps) {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <WifiOff className="h-6 w-6 text-gray-600" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center text-sm text-gray-500">
        <p>Check your internet connection and try again.</p>
        <p>Some features may be limited while you're offline.</p>
      </CardContent>
      {onRetry && (
        <CardFooter className="flex justify-center">
          <Button onClick={onRetry} disabled={isRetrying}>
            {isRetrying ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
