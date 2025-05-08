"use client"

import { create } from "zustand"

// Subscription features interface
interface SubscriptionFeatures {
  messageViewing: boolean
  messageOpening: boolean
  audioCalls: boolean
  videoCalls: boolean
  unlimitedUploads: boolean
  virtualClubs: boolean
  advancedFilters: boolean
  profileBoost: boolean
  seeWhoLikedYou: boolean
  unlimitedSwipes: boolean
  rewind: boolean // undo last swipe
  messagingLimit: number // maximum messages per day
  unlimitedMessaging: boolean // no message limits
}

export type SubscriptionTier = "free" | "premium" | "gold"

// Subscription store interface
interface SubscriptionStore {
  // Current subscription tier
  tier: SubscriptionTier
  setTier: (tier: SubscriptionTier) => void

  // Subscription status
  expiryDate: string | null
  setExpiryDate: (date: string | null) => void

  // Message tracking
  messageCount: number
  messageResetTime: number | null
  incrementMessageCount: () => boolean // returns true if message was sent, false if limit reached
  resetMessageCount: () => void
  canSendMessage: () => boolean
  getTimeUntilReset: () => number // returns seconds until reset

  // Check if a feature is available for the current tier
  canUseFeature: (feature: keyof SubscriptionFeatures) => boolean

  // Get all features for the current tier
  getFeatures: () => SubscriptionFeatures

  // Get features for a specific tier
  getFeaturesForTier: (tier: SubscriptionTier) => SubscriptionFeatures

  // Get subscription price
  getPrice: (tier: SubscriptionTier) => number
}

// Create the subscription store without persist middleware
export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  tier: "free",
  setTier: (tier) => set({ tier }),

  expiryDate: null,
  setExpiryDate: (date) => set({ expiryDate: date }),

  // Message tracking
  messageCount: 0,
  messageResetTime: null,

  incrementMessageCount: () => {
    const { messageCount, canSendMessage } = get()

    // Check if user can send a message
    if (!canSendMessage()) {
      return false
    }

    // Increment message count
    set((state) => ({
      messageCount: state.messageCount + 1,
      // Set reset time if this is the first message
      messageResetTime: state.messageResetTime || Date.now() + 24 * 60 * 60 * 1000,
    }))

    return true
  },

  resetMessageCount: () => {
    set({ messageCount: 0, messageResetTime: null })
  },

  canSendMessage: () => {
    const { messageCount, messageResetTime, getFeatures } = get()
    const features = getFeatures()

    // If user has unlimited messaging, always return true
    if (features.unlimitedMessaging) {
      return true
    }

    // If reset time has passed, reset the counter
    if (messageResetTime && messageResetTime < Date.now()) {
      get().resetMessageCount()
      return true
    }

    // Check if user has reached their limit
    return messageCount < features.messagingLimit
  },

  getTimeUntilReset: () => {
    const { messageResetTime } = get()
    if (!messageResetTime) return 0

    const timeLeft = messageResetTime - Date.now()
    return timeLeft > 0 ? Math.floor(timeLeft / 1000) : 0
  },

  canUseFeature: (feature) => {
    const features = get().getFeatures()
    return features[feature]
  },

  getFeatures: () => {
    return get().getFeaturesForTier(get().tier)
  },

  getFeaturesForTier: (tier) => {
    // Define features for each tier
    switch (tier) {
      case "free":
        return {
          messageViewing: true,
          messageOpening: true,
          audioCalls: false,
          videoCalls: false,
          unlimitedUploads: false,
          virtualClubs: false,
          advancedFilters: false,
          profileBoost: false,
          seeWhoLikedYou: false,
          unlimitedSwipes: false,
          rewind: false,
          messagingLimit: 20, // Free users can send 20 messages per day
          unlimitedMessaging: false,
        }
      case "premium":
        return {
          messageViewing: true,
          messageOpening: true,
          audioCalls: true,
          videoCalls: false,
          unlimitedUploads: false,
          virtualClubs: true,
          advancedFilters: true,
          profileBoost: false,
          seeWhoLikedYou: true,
          unlimitedSwipes: true,
          rewind: false,
          messagingLimit: 50, // Premium users can send 50 messages per day
          unlimitedMessaging: false,
        }
      case "gold":
        return {
          messageViewing: true,
          messageOpening: true,
          audioCalls: true,
          videoCalls: true,
          unlimitedUploads: true,
          virtualClubs: true,
          advancedFilters: true,
          profileBoost: true,
          seeWhoLikedYou: true,
          unlimitedSwipes: true,
          rewind: true,
          messagingLimit: 999, // Practically unlimited
          unlimitedMessaging: true, // Gold users have unlimited messaging
        }
    }
  },

  getPrice: (tier) => {
    switch (tier) {
      case "free":
        return 0
      case "premium":
        return 9.99
      case "gold":
        return 19.99
      default:
        return 0
    }
  },
}))
