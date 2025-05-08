"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Loader2, Settings, MessageCircle, Heart, X, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useAuthStore } from "@/lib/auth-store"
import { db } from "@/lib/firebase/firebase"
import { collection, query, getDocs, doc, getDoc, updateDoc, arrayUnion, limit } from "firebase/firestore"
import { OfflineBanner } from "@/components/offline-banner"
import { OfflineFallback } from "@/components/offline-fallback"

// Helper function to check if online
const isOnline = () => {
  return typeof navigator !== "undefined" && navigator.onLine
}

export default function Dashboard() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { toast } = useToast()

  const [potentialMatches, setPotentialMatches] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retrying, setRetrying] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [offlineMode, setOfflineMode] = useState(!isOnline())
  const [cachedUserData, setCachedUserData] = useState<any>(null)

  // Load user data and potential matches
  const loadUserData = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Check if we're online
      if (!isOnline()) {
        setOfflineMode(true)
        // Try to load from cache
        const cachedData = localStorage.getItem(`user_data_${user.uid}`)
        if (cachedData) {
          setCachedUserData(JSON.parse(cachedData))
        }
        throw new Error("You're offline. Some features may be limited.")
      }

      // Reset offline mode if we were offline before
      setOfflineMode(false)

      // Load potential matches
      await loadPotentialMatches()

      // Cache user data for offline use
      if (user) {
        localStorage.setItem(`user_data_${user.uid}`, JSON.stringify(user))
      }
    } catch (err: any) {
      console.error("Error loading user data:", err)
      setError(err.message || "Failed to load data")
    } finally {
      setLoading(false)
    }
  }, [user])

  // Load potential matches
  const loadPotentialMatches = async () => {
    if (!user) return

    try {
      // Check if we're online
      if (!isOnline()) {
        throw new Error("Failed to get document because the client is offline.")
      }

      // Get user's preferences
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (!userDoc.exists()) {
        throw new Error("User profile not found")
      }

      const userData = userDoc.data()
      const preferences = userData.preferences || {
        interestedIn: "both",
        ageRange: { min: 18, max: 50 },
        maxDistance: 50,
      }

      // Get user's likes and dislikes
      const likes = userData.likes || []
      const dislikes = userData.dislikes || []
      const excluded = [...likes, ...dislikes, user.uid]

      // Build query based on preferences
      const matchesQuery = query(collection(db, "users"), limit(20))

      // Execute query
      const querySnapshot = await getDocs(matchesQuery)
      const matches = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((match) => !excluded.includes(match.id)) // Filter out users already liked/disliked

      // Cache potential matches for offline use
      localStorage.setItem(`potential_matches_${user.uid}`, JSON.stringify(matches))

      setPotentialMatches(matches)
      setCurrentIndex(0)
    } catch (err: any) {
      console.error("Error loading potential matches:", err)

      // Try to load from cache if offline
      if (err.message.includes("offline")) {
        const cachedMatches = localStorage.getItem(`potential_matches_${user.uid}`)
        if (cachedMatches) {
          setPotentialMatches(JSON.parse(cachedMatches))
          setCurrentIndex(0)
          return
        }
      }

      throw err
    }
  }

  // Handle like action
  const handleLike = async () => {
    if (!user || currentIndex >= potentialMatches.length) return

    const likedUser = potentialMatches[currentIndex]

    try {
      if (isOnline()) {
        // Update user's likes in Firestore
        await updateDoc(doc(db, "users", user.uid), {
          likes: arrayUnion(likedUser.id),
        })

        // Check if it's a match (if the other user already liked this user)
        const otherUserDoc = await getDoc(doc(db, "users", likedUser.id))
        if (otherUserDoc.exists() && otherUserDoc.data().likes?.includes(user.uid)) {
          // It's a match!
          toast({
            title: "It's a match!",
            description: `You and ${likedUser.firstName} liked each other.`,
          })

          // Create a match in the matches collection
          // This would be handled by a Cloud Function in a real app
        }
      } else {
        // Store action to be synced later when online
        const pendingActions = JSON.parse(localStorage.getItem(`pending_actions_${user.uid}`) || "[]")
        pendingActions.push({
          type: "like",
          userId: likedUser.id,
          timestamp: new Date().toISOString(),
        })
        localStorage.setItem(`pending_actions_${user.uid}`, JSON.stringify(pendingActions))

        toast({
          title: "You're offline",
          description: "Your like will be saved when you're back online.",
        })
      }

      // Move to next profile
      setCurrentIndex(currentIndex + 1)
    } catch (err) {
      console.error("Error liking user:", err)
      toast({
        title: "Error",
        description: "Failed to like profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle dislike action
  const handleDislike = async () => {
    if (!user || currentIndex >= potentialMatches.length) return

    const dislikedUser = potentialMatches[currentIndex]

    try {
      if (isOnline()) {
        // Update user's dislikes in Firestore
        await updateDoc(doc(db, "users", user.uid), {
          dislikes: arrayUnion(dislikedUser.id),
        })
      } else {
        // Store action to be synced later when online
        const pendingActions = JSON.parse(localStorage.getItem(`pending_actions_${user.uid}`) || "[]")
        pendingActions.push({
          type: "dislike",
          userId: dislikedUser.id,
          timestamp: new Date().toISOString(),
        })
        localStorage.setItem(`pending_actions_${user.uid}`, JSON.stringify(pendingActions))
      }

      // Move to next profile
      setCurrentIndex(currentIndex + 1)
    } catch (err) {
      console.error("Error disliking user:", err)
      toast({
        title: "Error",
        description: "Failed to dislike profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Retry loading data with exponential backoff
  const retryLoading = async () => {
    setRetrying(true)
    setError(null)

    try {
      // Exponential backoff
      const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 10000) // Max 10 seconds
      await new Promise((resolve) => setTimeout(resolve, backoffTime))

      await loadUserData()
      setRetryCount(0) // Reset retry count on success
    } catch (err: any) {
      console.error("Retry failed:", err)
      setError(err.message || "Failed to load data")
      setRetryCount((prev) => prev + 1)
    } finally {
      setRetrying(false)
    }
  }

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setOfflineMode(false)
      // Try to reload data when coming back online
      loadUserData()

      // Process any pending actions
      if (user) {
        const pendingActions = JSON.parse(localStorage.getItem(`pending_actions_${user.uid}`) || "[]")
        if (pendingActions.length > 0) {
          toast({
            title: "Syncing your activity",
            description: "We're updating your likes and dislikes.",
          })
          // In a real app, you would process these actions here
        }
      }
    }

    const handleOffline = () => {
      setOfflineMode(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [loadUserData, user])

  // Initial data load
  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user, loadUserData])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Ecohub</h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/messages">
                <MessageCircle className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/profile">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <OfflineBanner />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-rose-500 mb-4" />
            <p className="text-gray-500">Loading profiles...</p>
          </div>
        ) : error ? (
          <div className="py-8">
            <OfflineFallback
              title={offlineMode ? "You're offline" : "Error loading profiles"}
              description={error}
              onRetry={retryLoading}
              isRetrying={retrying}
            />
          </div>
        ) : potentialMatches.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-rose-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No more profiles</h2>
            <p className="text-gray-500 mb-6">We've run out of profiles to show you. Check back later!</p>
            <Button onClick={() => loadUserData()} className="bg-rose-500 hover:bg-rose-600">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        ) : currentIndex >= potentialMatches.length ? (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-rose-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You've seen all profiles</h2>
            <p className="text-gray-500 mb-6">Check back later for more matches!</p>
            <Button onClick={() => loadUserData()} className="bg-rose-500 hover:bg-rose-600">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <Card className="overflow-hidden">
              <div className="relative aspect-[3/4] bg-gray-100">
                <Image
                  src={potentialMatches[currentIndex].photoURL || "/placeholder.svg?height=600&width=450"}
                  alt={`${potentialMatches[currentIndex].firstName}'s profile`}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                  <h2 className="text-2xl font-bold">
                    {potentialMatches[currentIndex].firstName},{" "}
                    {calculateAge(potentialMatches[currentIndex].dateOfBirth)}
                  </h2>
                  <p>{potentialMatches[currentIndex].location || "No location"}</p>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="mb-4">
                  <h3 className="font-semibold mb-1">About</h3>
                  <p className="text-gray-600">{potentialMatches[currentIndex].bio || "No bio provided"}</p>
                </div>

                {potentialMatches[currentIndex].interests && potentialMatches[currentIndex].interests.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-1">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {potentialMatches[currentIndex].interests.map((interest: string) => (
                        <Badge key={interest} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-center mt-6 space-x-4">
              <Button
                variant="outline"
                size="icon"
                className="h-14 w-14 rounded-full border-2 border-gray-300 bg-white text-rose-500 hover:border-rose-500 hover:text-rose-600"
                onClick={handleDislike}
              >
                <X className="h-8 w-8" />
              </Button>
              <Button
                size="icon"
                className="h-14 w-14 rounded-full bg-rose-500 text-white hover:bg-rose-600"
                onClick={handleLike}
              >
                <Heart className="h-8 w-8" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// Helper function to calculate age from date of birth
function calculateAge(dateOfBirth: string) {
  if (!dateOfBirth) return "?"

  const dob = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--
  }

  return age
}
