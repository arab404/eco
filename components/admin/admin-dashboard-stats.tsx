"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquare, Heart, Flag, ArrowUpRight, ArrowDownRight } from "lucide-react"

export function AdminDashboardStats() {
  // Mock stats data
  const stats = [
    {
      title: "Total Users",
      value: "15,243",
      change: "+12%",
      increasing: true,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Active Chats",
      value: "3,721",
      change: "+5%",
      increasing: true,
      icon: MessageSquare,
      color: "text-green-500",
    },
    {
      title: "Matches Today",
      value: "842",
      change: "+18%",
      increasing: true,
      icon: Heart,
      color: "text-rose-500",
    },
    {
      title: "Content Reports",
      value: "24",
      change: "-7%",
      increasing: false,
      icon: Flag,
      color: "text-amber-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs flex items-center">
              {stat.increasing ? (
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={stat.increasing ? "text-green-500" : "text-red-500"}>{stat.change} from last month</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
