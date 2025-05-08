"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Heart, ArrowRight, UserPlus, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/lib/auth-store"

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const { user, isInitialized } = useAuthStore()
  const [inviter, setInviter] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const inviterId = params.id as string

  // Fetch inviter data
  useEffect(() => {
    const fetchInviter = async () => {
      try {
        setIsLoading(true)

        // In a real app, this would be an API call to fetch the inviter's data
        // For demo purposes, we'll simulate a delay and return mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock inviter data
        const mockInviter = {
          id: inviterId,
          name: "Jessica Smith",
          avatar: "/placeholder.svg?height=128&width=128",
          bio: "Passionate about hiking, photography, and meeting new people!",
        }

        setInviter(mockInviter)
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching inviter:", err)
        setError("Could not load invitation details. Please try again.")
        setIsLoading(false)
      }
    }

    if (inviterId) {
      fetchInviter()
    }
  }, [inviterId])

  // Redirect if already logged in
  useEffect(() => {
    if (isInitialized && user) {
      router.push("/dashboard")
    }
  }, [user, router, isInitialized])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-rose-100 p-4">
        <div className="flex items-center gap-2 mb-8">
          <Heart className="h-8 w-8 text-rose-500 animate-pulse" />
          <h1 className="text-3xl font-bold text-gray-900">Ecohub</h1>
        </div>
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Loading invitation...</p>
          <div className="h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  if (error || !inviter) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-rose-100 p-4">
        <div className="flex items-center gap-2 mb-8">
          <Heart className="h-8 w-8 text-rose-500" />
          <h1 className="text-3xl font-bold text-gray-900">Ecohub</h1>
        </div>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Invitation Error</CardTitle>
            <CardDescription>{error || "This invitation link is invalid or has expired."}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full bg-rose-500 hover:bg-rose-600" asChild>
              <Link href="/">Go to Homepage</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-rose-100 p-4">
      <div className="flex items-center gap-2 mb-8">
        <Heart className="h-8 w-8 text-rose-500" />
        <h1 className="text-3xl font-bold text-gray-900">Ecohub</h1>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">You've Been Invited!</CardTitle>
          <CardDescription>Join Ecohub, the dating app that connects like-minded individuals</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={inviter.avatar || "/placeholder.svg"} alt={inviter.name} />
            <AvatarFallback>{inviter.name[0]}</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-semibold mb-1">{inviter.name}</h3>
          <p className="text-gray-500 text-center mb-6">{inviter.bio}</p>

          <div className="bg-rose-50 rounded-lg p-4 w-full mb-6">
            <div className="flex items-center gap-3 mb-2">
              <UserPlus className="h-5 w-5 text-rose-500" />
              <span className="font-medium">Join their network</span>
            </div>
            <p className="text-sm text-gray-600">
              Create an account to connect with {inviter.name} and thousands of other singles.
            </p>
          </div>

          <div className="bg-rose-50 rounded-lg p-4 w-full">
            <div className="flex items-center gap-3 mb-2">
              <Gift className="h-5 w-5 text-rose-500" />
              <span className="font-medium">Special Offer</span>
            </div>
            <p className="text-sm text-gray-600">
              Sign up with this invitation and get 1 week of Premium features for free!
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full bg-rose-500 hover:bg-rose-600" asChild>
            <Link href="/register">
              Create Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <div className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-rose-500 hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
