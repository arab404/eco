"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { Eye, MoreVertical, Trash2, Flag, CheckCircle, Video, ImageIcon, FileText, Music } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ContentGalleryProps {
  contentType: string
  status: string
  searchQuery: string
  source?: string
}

export function ContentGallery({ contentType, status, searchQuery, source }: ContentGalleryProps) {
  const router = useRouter()
  const { toast } = useToast()

  // Mock content data
  const mockContent = [
    {
      id: "c1",
      type: "image",
      url: "/images/profile1.png",
      uploadedBy: "Jessica Smith",
      date: "2023-07-10",
      status: "approved",
      flagged: false,
      source: "profile",
    },
    {
      id: "c2",
      type: "image",
      url: "/images/profile2.png",
      uploadedBy: "Olivia Johnson",
      date: "2023-07-15",
      status: "approved",
      flagged: false,
      source: "profile",
    },
    {
      id: "c3",
      type: "image",
      url: "/images/profile3.png",
      uploadedBy: "Zara Williams",
      date: "2023-07-20",
      status: "pending",
      flagged: false,
      source: "profile",
    },
    {
      id: "c4",
      type: "video",
      url: "/placeholder-video.mp4",
      uploadedBy: "Michael Brown",
      date: "2023-07-25",
      status: "flagged",
      flagged: true,
      source: "messages",
    },
    {
      id: "c5",
      type: "audio",
      url: "/placeholder-audio.mp3",
      uploadedBy: "James Wilson",
      date: "2023-07-30",
      status: "approved",
      flagged: false,
      source: "messages",
    },
    {
      id: "c6",
      type: "image",
      url: "/placeholder.svg?height=300&width=300",
      uploadedBy: "User123",
      date: "2023-08-01",
      status: "removed",
      flagged: true,
      source: "messages",
    },
    {
      id: "c7",
      type: "image",
      url: "/placeholder.svg?height=300&width=300",
      uploadedBy: "User456",
      date: "2023-08-02",
      status: "flagged",
      flagged: true,
      source: "profile",
    },
    {
      id: "c8",
      type: "text",
      content: "Lorem ipsum dolor sit amet...",
      uploadedBy: "User789",
      date: "2023-08-03",
      status: "approved",
      flagged: false,
      source: "messages",
    },
  ]

  // Filter content based on props
  const filteredContent = mockContent.filter((content) => {
    const matchesType = contentType === "all" || content.type === contentType
    const matchesStatus = status === "all" || content.status === status
    const matchesSource = !source || content.source === source
    const matchesSearch =
      !searchQuery ||
      content.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.id.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesType && matchesStatus && matchesSource && matchesSearch
  })

  const [content, setContent] = useState(filteredContent)

  const handleViewContent = (contentId: string) => {
    router.push(`/admin/content/${contentId}`)
  }

  const handleRemoveContent = (contentId: string) => {
    // In a real app, you would call an API to remove the content
    setContent(content.filter((c) => c.id !== contentId))

    toast({
      title: "Content removed",
      description: "The content has been removed successfully.",
    })
  }

  const handleApproveContent = (contentId: string) => {
    // In a real app, you would call an API to approve the content
    setContent(content.map((c) => (c.id === contentId ? { ...c, status: "approved", flagged: false } : c)))

    toast({
      title: "Content approved",
      description: "The content has been approved successfully.",
    })
  }

  // Get icon based on content type
  const getContentIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-10 w-10 text-blue-500" />
      case "video":
        return <Video className="h-10 w-10 text-red-500" />
      case "audio":
        return <Music className="h-10 w-10 text-green-500" />
      case "text":
        return <FileText className="h-10 w-10 text-purple-500" />
      default:
        return <FileText className="h-10 w-10 text-gray-500" />
    }
  }

  return (
    <div>
      {content.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {content.map((item) => (
            <div key={item.id} className="relative group border rounded-lg overflow-hidden">
              {item.type === "image" ? (
                <div className="aspect-square relative">
                  <Image src={item.url || "/placeholder.svg"} alt="Content" fill className="object-cover" />
                </div>
              ) : (
                <div className="aspect-square flex flex-col items-center justify-center bg-gray-100 p-4">
                  {getContentIcon(item.type)}
                  <span className="mt-2 text-xs text-center text-gray-500 capitalize">{item.type}</span>
                </div>
              )}

              {item.flagged && (
                <Badge className="absolute top-2 left-2 bg-red-500">
                  <Flag className="h-3 w-3 mr-1" />
                  Flagged
                </Badge>
              )}

              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-white bg-opacity-75 hover:bg-opacity-100">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleViewContent(item.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    {item.status !== "approved" && (
                      <DropdownMenuItem onClick={() => handleApproveContent(item.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </DropdownMenuItem>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
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
                          <AlertDialogAction
                            onClick={() => handleRemoveContent(item.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 text-white p-2 text-xs">
                <div className="truncate">{item.uploadedBy}</div>
                <div className="flex justify-between items-center mt-1">
                  <span>{item.date}</span>
                  <Badge
                    className={
                      item.status === "approved"
                        ? "bg-green-500"
                        : item.status === "pending"
                          ? "bg-amber-500"
                          : item.status === "flagged"
                            ? "bg-red-500"
                            : "bg-gray-500"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">No content found matching your criteria</div>
      )}
    </div>
  )
}
