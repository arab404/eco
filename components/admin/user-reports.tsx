import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Flag } from "lucide-react"

interface UserReportsProps {
  userId: string
}

export function UserReports({ userId }: UserReportsProps) {
  // Mock reports data for the user
  const reports = [
    {
      id: "r1",
      reporterName: "Michael Brown",
      reporterAvatar: "/placeholder.svg?height=32&width=32",
      reporterInitials: "MB",
      reason: "Inappropriate messages",
      details: "Sent offensive and inappropriate messages that violate community guidelines.",
      date: "2023-07-28T14:30:00Z",
      status: "pending",
    },
    {
      id: "r2",
      reporterName: "Olivia Johnson",
      reporterAvatar: "/images/profile2.png",
      reporterInitials: "OJ",
      reason: "Fake profile information",
      details: "User appears to be using fake information and stolen photos in their profile.",
      date: "2023-07-15T09:45:00Z",
      status: "resolved",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>
      case "resolved":
        return <Badge className="bg-green-500">Resolved</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <div key={report.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Flag className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="font-medium">Reported for: {report.reason}</h3>
            </div>
            {getStatusBadge(report.status)}
          </div>

          <p className="text-gray-700 text-sm mb-4">{report.details}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={report.reporterAvatar || "/placeholder.svg"} alt={report.reporterName} />
                <AvatarFallback>{report.reporterInitials}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-500">
                Reported by <span className="font-medium">{report.reporterName}</span> on{" "}
                {new Date(report.date).toLocaleDateString()}
              </span>
            </div>

            {report.status === "pending" && (
              <div className="space-x-2">
                <Button size="sm" variant="outline" className="h-8">
                  Reject
                </Button>
                <Button size="sm" className="h-8 bg-red-500 hover:bg-red-600">
                  Take Action
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}

      {reports.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <AlertTriangle className="h-12 w-12 text-gray-300 mb-2" />
          <p>No reports found for this user</p>
        </div>
      )}
    </div>
  )
}
