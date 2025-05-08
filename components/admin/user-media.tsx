"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
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
import { ImageIcon, Trash2, Eye, Video, File, Music } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface UserMediaProps {
  userId: string
}

export function UserMedia({ userId }: UserMediaProps) {
  const { toast } = useToast()

  // Mock media data
  const mockMedia = [
    { id: "m1", type: "image", url: "/images/profile1.png", date: "2023-07-10T14:30:00Z", status: "active" },
    {
      id: "m2",
      type: "image",
      url: "/placeholder.svg?height=300&width=300",
      date: "2023-07-15T09:15:00Z",
      status: "active",
    },
    {
      id: "m3",
      type: "image",
      url: "/placeholder.svg?height=300&width=300",
      date: "2023-07-20T16:45:00Z",
      status: "active",
    },
    { id: "m4", type: "video", url: "/placeholder-video.mp4", date: "2023-07-25T11:30:00Z", status: "active" },
    { id: "m5", type: "audio", url: "/placeholder-audio.mp3", date: "2023-07-30T08:20:00Z", status: "active" },
  ]

  const [media, setMedia] = useState(mockMedia)
  const [selectedMedia, setSelectedMedia] = useState<(typeof mockMedia)[0] | null>(null)

  const handleRemoveMedia = (mediaId: string) => {
    // In a real app, you would call an API to remove the media
    setMedia(media.filter((m) => m.id !== mediaId))
    setSelectedMedia(null)

    toast({
      title: "Media removed",
      description: "The media has been removed successfully.",
    })
  }

  // Get icon based on media type
  const getMediaIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-10 w-10 text-blue-500" />
      case "video":
        return <Video className="h-10 w-10 text-red-500" />
      case "audio":
        return <Music className="h-10 w-10 text-green-500" />
      default:
        return <File className="h-10 w-10 text-gray-500" />
    }
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item) => (
          <div
            key={item.id}
            className="relative group border rounded-lg overflow-hidden cursor-pointer"
            onClick={() => setSelectedMedia(item)}
          >
            {item.type === "image" ? (
              <div className="aspect-square relative">
                <Image src={item.url || "/placeholder.svg"} alt="User media" fill className="object-cover" />
              </div>
            ) : (
              <div className="aspect-square flex items-center justify-center bg-gray-100">
                {getMediaIcon(item.type)}
              </div>
            )}

            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button variant="outline" size="icon" className="h-8 w-8 text-white border-white">
                <Eye className="h-4 w-4" />
              </Button>
            </div>

            <Badge className="absolute top-2 right-2 text-xs" variant={item.type === "image" ? "default" : "outline"}>
              {item.type}
            </Badge>
          </div>
        ))}
      </div>

      {media.length === 0 && <div className="text-center py-10 text-gray-500">No media found for this user</div>}

      {/* Media preview dialog */}
      <Dialog open={!!selectedMedia} onOpenChange={(open) => !open && setSelectedMedia(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedMedia?.type.charAt(0).toUpperCase() + selectedMedia?.type.slice(1)} Preview
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            {selectedMedia?.type === "image" ? (
              <div className="relative aspect-square">
                <Image
                  src={selectedMedia.url || "/placeholder.svg"}
                  alt="Media preview"
                  fill
                  className="object-contain"
                />
              </div>
            ) : selectedMedia?.type === "video" ? (
              <video controls className="w-full rounded-md">
                <source src={selectedMedia.url} />
                Your browser does not support the video tag.
              </video>
            ) : selectedMedia?.type === "audio" ? (
              <div className="h-20 bg-gray-100 rounded-md flex items-center justify-center">
                <audio controls className="w-full">
                  <source src={selectedMedia.url} />
                  Your browser does not support the audio tag.
                </audio>
              </div>
            ) : (
              <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center">
                <File className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <div className="text-sm text-gray-500">
              Uploaded on {new Date(selectedMedia?.date || "").toLocaleDateString()}
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedMedia(null)}>
                Close
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove this media from the user's account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => selectedMedia && handleRemoveMedia(selectedMedia.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
