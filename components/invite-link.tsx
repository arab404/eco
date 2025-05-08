"use client"

import { useState, useEffect } from "react"
import { Copy, Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuthStore } from "@/lib/auth-store"

export function InviteLink() {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [baseUrl, setBaseUrl] = useState("https://ecohub.com")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin)
    }
  }, [])

  // Generate a unique invite link based on user ID
  const generateInviteLink = () => {
    if (!user) return ""

    // In a real app, this would be a unique code or token
    // For demo purposes, we'll use the user ID
    return `${baseUrl}/invite/${user.id}`
  }

  const inviteLink = generateInviteLink()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      toast({
        title: "Link copied!",
        description: "Invite link copied to clipboard",
      })

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const shareLink = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join me on Ecohub!",
          text: "I'm inviting you to join Ecohub, the dating app that connects like-minded individuals.",
          url: inviteLink,
        })

        toast({
          title: "Shared successfully!",
          description: "Your invite link has been shared",
        })
      } else {
        // Fallback for browsers that don't support the Web Share API
        copyToClipboard()
      }
    } catch (err) {
      console.error("Error sharing:", err)
      // Fallback to copy if sharing fails
      copyToClipboard()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Friends</CardTitle>
        <CardDescription>Share your personal invite link with friends to join Ecohub</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Input value={inviteLink} readOnly className="font-mono text-sm" />
          <Button variant="outline" size="icon" onClick={copyToClipboard} className="flex-shrink-0">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-rose-500 hover:bg-rose-600" onClick={shareLink}>
          <Share2 className="mr-2 h-4 w-4" />
          Share Invite Link
        </Button>
      </CardFooter>
    </Card>
  )
}
