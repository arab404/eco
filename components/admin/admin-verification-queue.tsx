import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

export function AdminVerificationQueue() {
  // Mock verification queue data
  const verificationQueue = [
    {
      id: "v1",
      user: {
        name: "Jessica Smith",
        avatar: "/images/profile1.png",
        initials: "JS",
      },
      documentType: "ID Card",
      submittedAt: "2023-08-01T14:30:00Z",
    },
    {
      id: "v2",
      user: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MB",
      },
      documentType: "Passport",
      submittedAt: "2023-08-02T10:15:00Z",
    },
    {
      id: "v3",
      user: {
        name: "Zara Williams",
        avatar: "/images/profile3.png",
        initials: "ZW",
      },
      documentType: "Driver's License",
      submittedAt: "2023-08-02T16:45:00Z",
    },
  ]

  // Format date to relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`
    }
  }

  return (
    <div className="space-y-4">
      {verificationQueue.map((verification) => (
        <div key={verification.id} className="rounded-lg border p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={verification.user.avatar || "/placeholder.svg"} alt={verification.user.name} />
                <AvatarFallback>{verification.user.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{verification.user.name}</p>
                <p className="text-xs text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {getRelativeTime(verification.submittedAt)}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              {verification.documentType}
            </Badge>
          </div>
          <div className="flex justify-end mt-2 space-x-2">
            <Button size="sm" variant="outline" className="h-8">
              Review
            </Button>
          </div>
        </div>
      ))}
      {verificationQueue.length === 0 && (
        <div className="text-center py-6 text-gray-500">No verification requests in queue</div>
      )}
    </div>
  )
}
