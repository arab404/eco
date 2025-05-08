import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

export function AdminReportedContent() {
  // Mock reported content data
  const reportedContent = [
    {
      id: "r1",
      contentType: "Image",
      reporter: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MB",
      },
      reason: "Inappropriate content",
      reportedAt: "2023-08-02T09:15:00Z",
    },
    {
      id: "r2",
      contentType: "Message",
      reporter: {
        name: "Olivia Johnson",
        avatar: "/images/profile2.png",
        initials: "OJ",
      },
      reason: "Harassment",
      reportedAt: "2023-08-02T14:30:00Z",
    },
    {
      id: "r3",
      contentType: "Profile",
      reporter: {
        name: "Zara Williams",
        avatar: "/images/profile3.png",
        initials: "ZW",
      },
      reason: "Fake account",
      reportedAt: "2023-08-02T16:45:00Z",
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

  // Get badge color based on content type
  const getBadgeColor = (type: string) => {
    switch (type) {
      case "Image":
        return "bg-purple-500"
      case "Message":
        return "bg-blue-500"
      case "Profile":
        return "bg-green-500"
      case "Video":
        return "bg-amber-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      {reportedContent.map((report) => (
        <div key={report.id} className="rounded-lg border p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={report.reporter.avatar || "/placeholder.svg"} alt={report.reporter.name} />
                <AvatarFallback>{report.reporter.initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <AlertTriangle className="h-3 w-3 text-amber-500 mr-1" />
                  <p className="font-medium text-sm">{report.reason}</p>
                </div>
                <p className="text-xs text-gray-500">
                  {getRelativeTime(report.reportedAt)} by {report.reporter.name}
                </p>
              </div>
            </div>
            <Badge className={getBadgeColor(report.contentType)}>{report.contentType}</Badge>
          </div>
          <div className="flex justify-end mt-2 space-x-2">
            <Button size="sm" variant="outline" className="h-8">
              Review
            </Button>
          </div>
        </div>
      ))}
      {reportedContent.length === 0 && <div className="text-center py-6 text-gray-500">No reported content</div>}
    </div>
  )
}
