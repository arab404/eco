"use client"

import { useSubscriptionStore } from "@/lib/subscription-store"
import { Badge } from "@/components/ui/badge"
import { Crown, Star } from "lucide-react"

export function SubscriptionBadge() {
  const { tier } = useSubscriptionStore()

  if (tier === "free") {
    return null
  }

  if (tier === "premium") {
    return (
      <Badge className="bg-purple-500 text-white">
        <Star className="h-3 w-3 mr-1" />
        Premium
      </Badge>
    )
  }

  return (
    <Badge className="bg-amber-500 text-white">
      <Crown className="h-3 w-3 mr-1" />
      Gold
    </Badge>
  )
}
