import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function AdminRecentActivity() {
  // Mock activity data
  const activities = [
    {
      id: 1,
      user: {
        name: "Jessica Smith",
        avatar: "/images/profile1.png",
        initials: "JS",
      },
      action: "verified their account",
      timestamp: "10 minutes ago",
      type: "verification",
    },
    {
      id: 2,
      user: {
        name: "Admin",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "A",
      },
      action: "removed inappropriate content",
      timestamp: "1 hour ago",
      type: "moderation",
    },
    {
      id: 3,
      user: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MB",
      },
      action: "reported a user for harassment",
      timestamp: "2 hours ago",
      type: "report",
    },
    {
      id: 4,
      user: {
        name: "Admin",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "A",
      },
      action: "created a new virtual event",
      timestamp: "3 hours ago",
      type: "event",
    },
    {
      id: 5,
      user: {
        name: "Olivia Johnson",
        avatar: "/images/profile2.png",
        initials: "OJ",
      },
      action: "upgraded to Gold subscription",
      timestamp: "5 hours ago",
      type: "subscription",
    },
  ]

  // Badge color based on activity type
  const getBadgeColor = (type: string) => {
    switch (type) {
      case "verification":
        return "bg-blue-500"
      case "moderation":
        return "bg-red-500"
      case "report":
        return "bg-amber-500"
      case "event":
        return "bg-purple-500"
      case "subscription":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
              <AvatarFallback>{activity.user.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">
                <span className="font-semibold">{activity.user.name}</span> {activity.action}
              </p>
              <p className="text-xs text-gray-500">{activity.timestamp}</p>
            </div>
          </div>
          <Badge className={getBadgeColor(activity.type)}>
            {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
          </Badge>
        </div>
      ))}
    </div>
  )
}
