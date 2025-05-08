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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

export function SubscriptionAnalytics() {
  // Mock data for subscription analytics
  const subscriptionDistributionData = [
    { name: "Free", value: 65 },
    { name: "Basic", value: 25 },
    { name: "Premium", value: 10 },
  ]

  const conversionRateData = [
    { date: "Apr 1", rate: 3.2 },
    { date: "Apr 5", rate: 3.5 },
    { date: "Apr 10", rate: 3.8 },
    { date: "Apr 15", rate: 4.1 },
    { date: "Apr 20", rate: 4.5 },
    { date: "Apr 25", rate: 4.8 },
    { date: "Apr 30", rate: 5.2 },
  ]

  const revenueData = [
    { month: "Jan", revenue: 12500 },
    { month: "Feb", revenue: 13200 },
    { month: "Mar", revenue: 14800 },
    { month: "Apr", revenue: 16500 },
  ]

  const churnRateData = [
    { month: "Jan", free: 8.5, basic: 4.2, premium: 2.1 },
    { month: "Feb", free: 8.2, basic: 4.0, premium: 2.0 },
    { month: "Mar", free: 7.8, basic: 3.8, premium: 1.8 },
    { month: "Apr", free: 7.5, basic: 3.5, premium: 1.7 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Distribution</CardTitle>
            <CardDescription>Current user subscription breakdown</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subscriptionDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {subscriptionDistributionData.map((entry, index) => (
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
            <CardTitle>Conversion Rate</CardTitle>
            <CardDescription>Free to paid conversion percentage</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conversionRateData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, "Conversion Rate"]} />
                <Legend />
                <Line type="monotone" dataKey="rate" stroke="#8884d8" name="Conversion Rate (%)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Subscription revenue trend</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#82ca9d" fill="#82ca9d" name="Revenue ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Churn Rate</CardTitle>
            <CardDescription>Subscription cancellation percentage</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={churnRateData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, "Churn Rate"]} />
                <Legend />
                <Line type="monotone" dataKey="free" stroke="#0088FE" name="Free Users (%)" />
                <Line type="monotone" dataKey="basic" stroke="#00C49F" name="Basic Plan (%)" />
                <Line type="monotone" dataKey="premium" stroke="#FFBB28" name="Premium Plan (%)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
