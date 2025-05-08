"use client"

import { type ReactNode, useState } from "react"
import { useSubscriptionStore, type SubscriptionTier } from "@/lib/subscription-store"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Lock } from "lucide-react"
import { useRouter } from "next/navigation"

interface SubscriptionGateProps {
  feature: keyof ReturnType<typeof useSubscriptionStore.getState.getFeatures>
  children: ReactNode
  fallback?: ReactNode
}

export function SubscriptionGate({ feature, children, fallback }: SubscriptionGateProps) {
  const { canUseFeature, tier } = useSubscriptionStore()
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)

  if (canUseFeature(feature)) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <>
      <div className="relative cursor-pointer group" onClick={() => setShowUpgradeDialog(true)}>
        <div className="opacity-50 pointer-events-none">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-md">
          <div className="bg-white p-3 rounded-full">
            <Lock className="h-6 w-6 text-rose-500" />
          </div>
        </div>
        <div className="absolute bottom-2 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-center">
          <Badge className="bg-rose-500">Upgrade to {getRequiredTier(feature)}</Badge>
        </div>
      </div>

      <UpgradeDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        feature={feature}
        currentTier={tier}
      />
    </>
  )
}

function getRequiredTier(feature: string): string {
  const premiumFeatures = [
    "messageOpening",
    "audioCalls",
    "virtualClubs",
    "advancedFilters",
    "seeWhoLikedYou",
    "unlimitedSwipes",
  ]

  const goldFeatures = ["videoCalls", "unlimitedUploads", "profileBoost", "rewind"]

  if (premiumFeatures.includes(feature)) {
    return "Premium"
  }

  if (goldFeatures.includes(feature)) {
    return "Gold"
  }

  return "Premium"
}

interface UpgradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feature: string
  currentTier: SubscriptionTier
}

function UpgradeDialog({ open, onOpenChange, feature, currentTier }: UpgradeDialogProps) {
  const router = useRouter()
  const { getFeaturesForTier, getPrice } = useSubscriptionStore()

  const requiredTier = getRequiredTier(feature).toLowerCase() as SubscriptionTier
  const featureLabel = getFeatureLabel(feature)

  const handleUpgrade = () => {
    router.push("/subscription")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            Upgrade to {getRequiredTier(feature)}
          </DialogTitle>
          <DialogDescription>Unlock {featureLabel} and many more premium features</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-4">
            <h3 className="font-semibold">
              Current Plan: {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
            </h3>
            <ul className="space-y-2">
              {Object.entries(getFeaturesForTier(currentTier)).map(([key, enabled]) => (
                <li key={key} className="flex items-center gap-2 text-sm">
                  {enabled ? <Check className="h-4 w-4 text-green-500" /> : <Lock className="h-4 w-4 text-gray-300" />}
                  <span className={!enabled ? "text-gray-400" : ""}>{getFeatureLabel(key)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">
              {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} Plan
              <Badge className="ml-2 bg-rose-500">${getPrice(requiredTier)}/month</Badge>
            </h3>
            <ul className="space-y-2">
              {Object.entries(getFeaturesForTier(requiredTier)).map(([key, enabled]) => (
                <li key={key} className="flex items-center gap-2 text-sm">
                  {enabled ? <Check className="h-4 w-4 text-green-500" /> : <Lock className="h-4 w-4 text-gray-300" />}
                  <span className={!enabled ? "text-gray-400" : ""}>{getFeatureLabel(key)}</span>
                  {key === feature && <Badge className="ml-auto bg-amber-500">Featured</Badge>}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Maybe Later
          </Button>
          <Button className="bg-rose-500 hover:bg-rose-600" onClick={handleUpgrade}>
            Upgrade Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function getFeatureLabel(feature: string): string {
  const labels: Record<string, string> = {
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
  }

  return labels[feature] || feature
}
