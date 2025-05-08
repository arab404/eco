"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check, Crown, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSubscriptionStore, type SubscriptionTier } from "@/lib/subscription-store"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function SubscriptionPage() {
  const router = useRouter()
  const { tier: currentTier, setTier, getFeaturesForTier, getPrice } = useSubscriptionStore()
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(currentTier)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubscribe = () => {
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setTier(selectedTier)
      setIsProcessing(false)
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Subscription Plans</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Choose Your Plan</h2>

          <RadioGroup value={selectedTier} onValueChange={(value) => setSelectedTier(value as SubscriptionTier)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Free Plan */}
              <div className={`relative ${selectedTier === "free" ? "ring-2 ring-rose-500 rounded-lg" : ""}`}>
                <RadioGroupItem value="free" id="free" className="sr-only" />
                <Label htmlFor="free" className="cursor-pointer">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Free</CardTitle>
                      <CardDescription>
                        <span className="text-2xl font-bold">$0</span>
                        <span className="text-sm text-gray-500">/month</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <FeatureList tier="free" />
                    </CardContent>
                    <CardFooter>
                      {currentTier === "free" ? (
                        <Button className="w-full" disabled>
                          Current Plan
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full">
                          Select
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </Label>
              </div>

              {/* Premium Plan */}
              <div className={`relative ${selectedTier === "premium" ? "ring-2 ring-rose-500 rounded-lg" : ""}`}>
                <RadioGroupItem value="premium" id="premium" className="sr-only" />
                <Label htmlFor="premium" className="cursor-pointer">
                  <Card className="h-full">
                    <CardHeader className="bg-purple-50">
                      <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center">
                          <Star className="h-5 w-5 text-purple-500 mr-1" />
                          Premium
                        </CardTitle>
                        {currentTier === "premium" && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Current</span>
                        )}
                      </div>
                      <CardDescription>
                        <span className="text-2xl font-bold">${getPrice("premium")}</span>
                        <span className="text-sm text-gray-500">/month</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <FeatureList tier="premium" />
                    </CardContent>
                    <CardFooter>
                      {currentTier === "premium" ? (
                        <Button className="w-full" disabled>
                          Current Plan
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full">
                          Select
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </Label>
              </div>

              {/* Gold Plan */}
              <div className={`relative ${selectedTier === "gold" ? "ring-2 ring-rose-500 rounded-lg" : ""}`}>
                <RadioGroupItem value="gold" id="gold" className="sr-only" />
                <Label htmlFor="gold" className="cursor-pointer">
                  <Card className="h-full">
                    <CardHeader className="bg-amber-50">
                      <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center">
                          <Crown className="h-5 w-5 text-amber-500 mr-1" />
                          Gold
                        </CardTitle>
                        {currentTier === "gold" && (
                          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Current</span>
                        )}
                      </div>
                      <CardDescription>
                        <span className="text-2xl font-bold">${getPrice("gold")}</span>
                        <span className="text-sm text-gray-500">/month</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <FeatureList tier="gold" />
                    </CardContent>
                    <CardFooter>
                      {currentTier === "gold" ? (
                        <Button className="w-full" disabled>
                          Current Plan
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full">
                          Select
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </Label>
              </div>
            </div>
          </RadioGroup>

          <div className="flex justify-end">
            <Button
              className="bg-rose-500 hover:bg-rose-600"
              disabled={isProcessing || currentTier === selectedTier}
              onClick={handleSubscribe}
            >
              {isProcessing ? "Processing..." : currentTier === selectedTier ? "Current Plan" : "Subscribe"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

function FeatureList({ tier }: { tier: SubscriptionTier }) {
  const { getFeaturesForTier } = useSubscriptionStore()
  const features = getFeaturesForTier(tier)

  const featureLabels: Record<string, string> = {
    messageViewing: "View Messages",
    messageOpening: "Open & Reply to Messages",
    audioCalls: "Audio Calls",
    videoCalls: "Video Calls",
    unlimitedUploads: "Unlimited Photo Uploads",
    virtualClubs: "Join Virtual Clubs",
    advancedFilters: "Advanced Search Filters",
    profileBoost: "Profile Boost in Search",
    seeWhoLikedYou: "See Who Liked You",
    unlimitedSwipes: "Unlimited Swipes",
    rewind: "Rewind Last Swipe",
    messagingLimit:
      tier === "free"
        ? "Send up to 20 messages per day"
        : tier === "premium"
          ? "Send up to 50 messages per day"
          : "Unlimited messaging",
    unlimitedMessaging: "Unlimited messaging",
  }

  return (
    <ul className="space-y-2">
      {Object.entries(features).map(([key, enabled]) => {
        // Skip messaging limit for gold tier
        if (key === "messagingLimit" && tier === "gold") return null

        // Only show unlimited messaging for gold tier
        if (key === "unlimitedMessaging" && tier !== "gold") return null

        return (
          <li key={key} className="flex items-start gap-2 text-sm">
            <div className="mt-0.5">
              {enabled ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <div className="h-4 w-4 rounded-full border border-gray-300" />
              )}
            </div>
            <span className={enabled ? "" : "text-gray-400"}>{featureLabels[key] || key}</span>
          </li>
        )
      })}
    </ul>
  )
}
