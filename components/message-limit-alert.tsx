"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Clock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useSubscriptionStore } from "@/lib/subscription-store"
import { useRouter } from "next/navigation"

export function MessageLimitAlert() {
  const router = useRouter()
  const { tier, messageCount, getFeatures, canSendMessage, getTimeUntilReset } = useSubscriptionStore()

  const [timeLeft, setTimeLeft] = useState(getTimeUntilReset())
  const features = getFeatures()
  const messagingLimit = features.messagingLimit
  const hasReachedLimit = !canSendMessage()

  // Format the time remaining
  const formatTimeRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m ${seconds % 60}s`
    }
  }

  // Update the time left every second
  useEffect(() => {
    if (!hasReachedLimit) return

    const interval = setInterval(() => {
      const newTimeLeft = getTimeUntilReset()
      setTimeLeft(newTimeLeft)

      // If time has reset, refresh the page
      if (newTimeLeft === 0) {
        window.location.reload()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [hasReachedLimit, getTimeUntilReset])

  if (features.unlimitedMessaging) {
    return null
  }

  return (
    <div className="mb-4">
      <Alert variant={hasReachedLimit ? "destructive" : "default"}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>
          {hasReachedLimit ? "Daily message limit reached" : `Message Limit: ${messageCount}/${messagingLimit}`}
        </AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          {hasReachedLimit ? (
            <>
              <p className="text-sm">You've reached your daily message limit. You can send more messages in:</p>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4" />
                <span>{formatTimeRemaining(timeLeft)}</span>
              </div>
              <Progress value={(timeLeft / (24 * 60 * 60)) * 100} className="h-2" />
              <Button className="mt-2 bg-rose-500 hover:bg-rose-600" onClick={() => router.push("/subscription")}>
                Upgrade for more messages
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm">
                {tier === "free"
                  ? "Free users can send 20 messages per day."
                  : "Premium users can send 50 messages per day."}
              </p>
              <Progress value={(messageCount / messagingLimit) * 100} className="h-2" />
              {messageCount > messagingLimit * 0.7 && (
                <Button variant="outline" className="mt-2" onClick={() => router.push("/subscription")}>
                  Upgrade to Gold for unlimited messages
                </Button>
              )}
            </>
          )}
        </AlertDescription>
      </Alert>
    </div>
  )
}
