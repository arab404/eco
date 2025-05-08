"use client"

import { useState } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserRetentionChartProps {
  type?: "standard" | "cohort" | "churn" | "reactivation"
}

export function UserRetentionChart({ type = "standard" }: UserRetentionChartProps) {
  const [timeframe, setTimeframe] = useState("30days")

  // Mock data for different chart types
  const standardData = [
    { date: "Apr 1", daily: 7500, weekly: 12400, monthly: 15200 },
    { date: "Apr 5", daily: 8200, weekly: 12800, monthly: 15400 },
    { date: "Apr 10", daily: 7800, weekly: 13100, monthly: 15600 },
    { date: "Apr 15", daily: 8400, weekly: 13500, monthly: 15900 },
    { date: "Apr 20", daily: 9100, weekly: 13800, monthly: 16200 },
    { date: "Apr 25", daily: 8700, weekly: 14200, monthly: 16500 },
    { date: "Apr 30", daily: 8900, weekly: 14500, monthly: 16800 },
  ]

  const cohortData = [
    { month: "Jan", week1: 100, week2: 85, week3: 76, week4: 68, week8: 54, week12: 42 },
    { month: "Feb", week1: 100, week2: 88, week3: 79, week4: 72, week8: 58, week12: 45 },
    { month: "Mar", week1: 100, week2: 90, week3: 82, week4: 75, week8: 62, week12: 48 },
    { month: "Apr", week1: 100, week2: 92, week3: 85, week4: 78, week8: 65, week12: 52 },
  ]

  const churnData = [
    { segment: "Free Users", rate: 12.4 },
    { segment: "Basic Plan", rate: 8.2 },
    { segment: "Premium Plan", rate: 4.7 },
    { segment: "New Users (<1mo)", rate: 18.3 },
    { segment: "Established (1-6mo)", rate: 9.1 },
    { segment: "Loyal (>6mo)", rate: 3.5 },
  ]

  const reactivationData = [
    { month: "Jan", rate: 12 },
    { month: "Feb", rate: 14 },
    { month: "Mar", rate: 18 },
    { month: "Apr", rate: 22 },
  ]

  if (type === "cohort") {
    return (
      <div className="w-full h-full">
        <div className="flex justify-end mb-4">
          <Select defaultValue="cohort" onValueChange={(value) => console.log(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cohort">Cohort View</SelectItem>
              <SelectItem value="percentage">Percentage View</SelectItem>
              <SelectItem value="absolute">Absolute Numbers</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={cohortData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="week1" stroke="#8884d8" name="Week 1" />
            <Line type="monotone" dataKey="week2" stroke="#82ca9d" name="Week 2" />
            <Line type="monotone" dataKey="week4" stroke="#ffc658" name="Week 4" />
            <Line type="monotone" dataKey="week8" stroke="#ff8042" name="Week 8" />
            <Line type="monotone" dataKey="week12" stroke="#0088fe" name="Week 12" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (type === "churn") {
    return (
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={churnData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="segment" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="rate" stroke="#8884d8" fill="#8884d8" name="Churn Rate (%)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (type === "reactivation") {
    return (
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={reactivationData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="rate" stroke="#82ca9d" fill="#82ca9d" name="Reactivation Rate (%)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Default standard view
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
        <LineChart data={standardData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="daily" stroke="#8884d8" name="Daily Active Users" />
          <Line type="monotone" dataKey="weekly" stroke="#82ca9d" name="Weekly Active Users" />
          <Line type="monotone" dataKey="monthly" stroke="#ffc658" name="Monthly Active Users" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
