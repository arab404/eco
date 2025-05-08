"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export function MatchAnalytics() {
  // Mock data for match analytics
  const matchRateData = [
    { date: "Apr 1", rate: 18.2 },
    { date: "Apr 5", rate: 19.5 },
    { date: "Apr 10", rate: 20.1 },
    { date: "Apr 15", rate: 21.4 },
    { date: "Apr 20", rate: 22.8 },
    { date: "Apr 25", rate: 23.5 },
    { date: "Apr 30", rate: 24.2 },
  ]

  const matchSourceData = [
    { name: "Swipe", value: 65 },
    { name: "Search", value: 15 },
    { name: "Events", value: 12 },
    { name: "Clubs", value: 8 },
  ]

  const conversationStarterData = [
    { starter: "Hello", count: 1245 },
    { starter: "Hi there", count: 982 },
    { starter: "How are you?", count: 753 },
    { starter: "I like your profile", count: 621 },
    { starter: "What's up?", count: 542 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Match Rate Trend</CardTitle>
          <CardDescription>Percentage of swipes resulting in matches</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={matchRateData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, "Match Rate"]} />
              <Legend />
              <Line type="monotone" dataKey="rate" stroke="#8884d8" name="Match Rate (%)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Match Sources</CardTitle>
            <CardDescription>How users are finding their matches</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={matchSourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {matchSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Conversation Starters</CardTitle>
            <CardDescription>Most common first messages</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={conversationStarterData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="starter" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Usage Count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
