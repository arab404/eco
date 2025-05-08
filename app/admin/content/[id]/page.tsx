"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Flag, Trash2, AlertTriangle, CheckCircle, Eye, MessageSquare, Calendar, Info } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Mock content data for demonstration
const mockContentDetails = {
  id: "content123",
  type: "image",
  url: "/images/profile1.png",
  dateUploaded: "2023-06-15T14:30:00Z",
  userId: "user123",
  username: "Jessica Smith",
  userAvatar: "/images/profile1.png",
  contentSource: "profile",
  status: "flagged",
  flagCount: 3,
  viewCount: 245,
  reports: [
    {
      id: "report1",
      userId: "user456",
      username: "Michael Brown",
      reason: "Inappropriate content",
      description: "This image contains content that violates community guidelines.",
      date: "2023-07-10T09:15:00Z",
    },
    {
      id: "report2",
      userId: "user789",
      username: "Olivia Johnson",
      reason: "Misleading content",
      description: "This photo appears to be manipulated or altered.",
      date: "2023-07-12T16:20:00Z",
    },
  ],
}

export default function ContentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const contentId = params.id as string

  const [content, setContent] = useState(mockContentDetails)
  const [reviewNotes, setReviewNotes] = useState("")

  // Handle approve action
  const handleApprove = () => {
    setContent({ ...content, status: "approved" })
    toast({
      title: "Content approved",
      description: "This content has been approved and will remain visible.",
    })
  }

  // Handle remove action
  const handleRemove = () => {
    setContent({ ...content, status: "removed" })
    toast({
      title: "Content removed",
      description: "This content has been removed and is no longer visible to users.",
    })
  }

  // Handle user notification
  const handleNotifyUser = () => {
    toast({
      title: "User notified",
      description: "A notification has been sent to the user about their content.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-4" onClick={() => router.push("/admin/content")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <AdminHeader title={`Content Review`} description={`Reviewing ${content.type} ID: ${contentId}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content preview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Content Preview</CardTitle>
                <CardDescription>Uploaded on {new Date(content.dateUploaded).toLocaleString()}</CardDescription>
              </div>
              <Badge
                className={
                  content.status === "approved"
                    ? "bg-green-500"
                    : content.status === "removed"
                      ? "bg-red-500"
                      : content.status === "flagged"
                        ? "bg-amber-500"
                        : "bg-blue-500"
                }
              >
                {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="relative max-h-[500px] w-full">
              {content.type === "image" && (
                <Image
                  src={content.url || "/placeholder.svg"}
                  alt="Content preview"
                  className="object-contain mx-auto max-h-[500px] w-auto rounded-md"
                  width={500}
                  height={500}
                />
              )}
              {content.type === "video" && (
                <video src={content.url} controls className="max-h-[500px] w-auto mx-auto rounded-md" />
              )}
              {content.type === "audio" && (
                <div className="flex items-center justify-center h-32 w-full bg-gray-100 rounded-md">
                  <audio src={content.url} controls className="w-full" />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex flex-wrap gap-4 justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={content.userAvatar || "/placeholder.svg"} alt={content.username} />
                  <AvatarFallback>{content.username[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{content.username}</p>
                  <p className="text-xs text-gray-500">User ID: {content.userId}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{content.viewCount} views</span>
                </div>
                <div className="flex items-center">
                  <Flag className="h-4 w-4 mr-1" />
                  <span>{content.flagCount} flags</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(content.dateUploaded).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Review actions */}
        <Card>
          <CardHeader>
            <CardTitle>Review Actions</CardTitle>
            <CardDescription>Take action on this content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Review Notes</label>
              <Textarea
                placeholder="Add your review notes here..."
                className="resize-none"
                rows={4}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleApprove}
                disabled={content.status === "approved"}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve Content
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full" disabled={content.status === "removed"}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Content
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove the content from the platform and make it inaccessible to users.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRemove} className="bg-red-500 hover:bg-red-600">
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button variant="outline" className="w-full" onClick={handleNotifyUser}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Notify User
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/admin/users/${content.userId}`)}
              >
                <Info className="mr-2 h-4 w-4" />
                View User Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports tab */}
      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>Review reports submitted for this content</CardDescription>
        </CardHeader>
        <CardContent>
          {content.reports.length > 0 ? (
            <div className="space-y-4">
              {content.reports.map((report) => (
                <div key={report.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                      <span className="font-medium">{report.reason}</span>
                    </div>
                    <span className="text-sm text-gray-500">{new Date(report.date).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-700 mb-3">{report.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>Reported by:</span>
                    <span className="font-medium ml-1">{report.username}</span>
                    <span className="ml-2">(ID: {report.userId})</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No reports found for this content.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
