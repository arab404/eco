"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, MessageSquare, Heart, Clock, ArrowUpRight, ArrowDownRight, UserPlus, Calendar } from "lucide-react"

export function EngagementOverview() {
  // Mock stats data
  const stats = [
    {
      title: "Daily Active Users",
      value: "8,742",
      change: "+14%",
      increasing: true,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "New Signups",
      value: "342",
      change: "+8%",
      increasing: true,
      icon: UserPlus,
      color: "text-green-500",
    },
    {
      title: "Messages Sent",
      value: "24,891",
      change: "+23%",
      increasing: true,
      icon: MessageSquare,
      color: "text-indigo-500",
    },
    {
      title: "Matches Created",
      value: "1,287",
      change: "+18%",
      increasing: true,
      icon: Heart,
      color: "text-rose-500",
    },
    {
      title: "Avg. Session Time",
      value: "18.5 min",
      change: "+5%",
      increasing: true,
      icon: Clock,
      color: "text-amber-500",
    },
    {
      title: "Event Participation",
      value: "2,143",
      change: "-3%",
      increasing: false,
      icon: Calendar,
      color: "text-purple-500",
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between space-y-0">
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold mt-2">{stat.value}</div>
            <p className="text-xs flex items-center mt-1">
              {stat.increasing ? (
                <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={stat.increasing ? "text-green-500" : "text-red-500"}>{stat.change} from last week</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
