import { Badge } from "@/components/ui/badge"

interface UserActivityProps {
  userId: string
}

export function UserActivity({ userId }: UserActivityProps) {
  // Mock activity data for the user
  const activities = [
    {
      id: "a1",
      action: "Logged in",
      date: "2023-08-02T14:30:00Z",
      details: "Logged in from iOS app",
      type: "login",
    },
    {
      id: "a2",
      action: "Updated profile",
      date: "2023-08-02T14:35:00Z",
      details: "Changed profile picture and bio",
      type: "profile",
    },
    {
      id: "a3",
      action: "Sent messages",
      date: "2023-08-02T15:10:00Z",
      details: "Sent 5 messages to user 'Michael Brown'",
      type: "message",
    },
    {
      id: "a4",
      action: "Liked profile",
      date: "2023-08-02T15:45:00Z",
      details: "Liked user 'Olivia Johnson'",
      type: "like",
    },
    {
      id: "a5",
      action: "Created event",
      date: "2023-08-01T10:20:00Z",
      details: "Created virtual event 'Book Club Discussion'",
      type: "event",
    },
    {
      id: "a6",
      action: "Uploaded media",
      date: "2023-08-01T11:15:00Z",
      details: "Uploaded 3 new photos to profile",
      type: "media",
    },
  ]

  // Get badge color based on activity type
  const getBadgeColor = (type: string) => {
    switch (type) {
      case "login":
        return "bg-blue-500"
      case "profile":
        return "bg-green-500"
      case "message":
        return "bg-purple-500"
      case "like":
        return "bg-rose-500"
      case "event":
        return "bg-amber-500"
      case "media":
        return "bg-indigo-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-1">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center justify-between border-b py-3">
          <div>
            <div className="flex items-center">
              <Badge className={getBadgeColor(activity.type)}>
                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
              </Badge>
              <span className="ml-2 font-medium">{activity.action}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{activity.details}</p>
          </div>
          <div className="text-sm text-gray-500">{new Date(activity.date).toLocaleString()}</div>
        </div>
      ))}

      {activities.length === 0 && (
        <div className="text-center py-10 text-gray-500">No activity recorded for this user</div>
      )}
    </div>
  )
}
