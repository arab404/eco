"use client"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface FeatureUsageChartProps {
  chartType?: "standard" | "detailed" | "messaging" | "profiles" | "events" | "session" | "interaction"
}

export function FeatureUsageChart({ chartType = "standard" }: FeatureUsageChartProps) {
  const [timeframe, setTimeframe] = useState("30days")

  // Mock data for different chart types
  const standardData = [
    { name: "Messaging", usage: 42 },
    { name: "Swiping", usage: 28 },
    { name: "Profile Views", usage: 15 },
    { name: "Events", usage: 8 },
    { name: "Settings", usage: 7 },
  ]

  const detailedData = [
    { feature: "Messaging", free: 35, basic: 45, premium: 65 },
    { feature: "Swiping", free: 25, basic: 30, premium: 40 },
    { feature: "Profile Views", free: 12, basic: 18, premium: 25 },
    { feature: "Video Calls", free: 2, basic: 8, premium: 15 },
    { feature: "Events", free: 5, basic: 10, premium: 18 },
    { feature: "Clubs", free: 3, basic: 7, premium: 12 },
  ]

  const messagingData = [
    { day: "Mon", sent: 3200, received: 2800, replied: 2100 },
    { day: "Tue", sent: 3500, received: 3100, replied: 2300 },
    { day: "Wed", sent: 3800, received: 3400, replied: 2600 },
    { day: "Thu", sent: 4100, received: 3700, replied: 2800 },
    { day: "Fri", sent: 4500, received: 4100, replied: 3200 },
    { day: "Sat", sent: 5200, received: 4800, replied: 3800 },
    { day: "Sun", sent: 4800, received: 4400, replied: 3500 },
  ]

  const profileData = [
    { hour: "00", views: 120 },
    { hour: "02", views: 80 },
    { hour: "04", views: 40 },
    { hour: "06", views: 100 },
    { hour: "08", views: 280 },
    { hour: "10", views: 350 },
    { hour: "12", views: 480 },
    { hour: "14", views: 520 },
    { hour: "16", views: 580 },
    { hour: "18", views: 620 },
    { hour: "20", views: 720 },
    { hour: "22", views: 420 },
  ]

  const eventData = [
    { name: "Speed Dating", participants: 245 },
    { name: "Book Club", participants: 187 },
    { name: "Cooking Class", participants: 156 },
    { name: "Fitness Challenge", participants: 142 },
    { name: "Movie Night", participants: 132 },
  ]

  const sessionData = [
    { day: "Mon", duration: 16.2 },
    { day: "Tue", duration: 15.8 },
    { day: "Wed", duration: 17.3 },
    { day: "Thu", duration: 18.1 },
    { day: "Fri", duration: 19.5 },
    { day: "Sat", duration: 22.7 },
    { day: "Sun", duration: 21.4 },
  ]

  const interactionData = [
    { day: "Mon", rate: 14.2 },
    { day: "Tue", rate: 13.8 },
    { day: "Wed", rate: 15.3 },
    { day: "Thu", rate: 16.1 },
    { day: "Fri", rate: 17.5 },
    { day: "Sat", rate: 19.7 },
    { day: "Sun", rate: 18.4 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  if (chartType === "detailed") {
    return (
      <div className="w-full h-full">
        <div className="flex justify-end mb-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={detailedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="feature" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="free" name="Free Users" fill="#8884d8" />
            <Bar dataKey="basic" name="Basic Plan" fill="#82ca9d" />
            <Bar dataKey="premium" name="Premium Plan" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (chartType === "messaging") {
    return (
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={messagingData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sent" stroke="#8884d8" name="Messages Sent" />
            <Line type="monotone" dataKey="received" stroke="#82ca9d" name="Messages Received" />
            <Line type="monotone" dataKey="replied" stroke="#ffc658" name="Messages Replied" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (chartType === "profiles") {
    return (
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={profileData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="views" name="Profile Views" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (chartType === "events") {
    return (
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={eventData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="participants"
            >
              {eventData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name, props) => [`${value} participants`, props.payload.name]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (chartType === "session") {
    return (
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sessionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} minutes`, "Avg. Session Duration"]} />
            <Legend />
            <Line type="monotone" dataKey="duration" stroke="#8884d8" name="Avg. Session Duration (min)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (chartType === "interaction") {
    return (
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={interactionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} interactions`, "Interaction Rate"]} />
            <Legend />
            <Line type="monotone" dataKey="rate" stroke="#82ca9d" name="Interactions per Session" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Default standard view
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={standardData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="usage"
          >
            {standardData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}%`, "Usage"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
