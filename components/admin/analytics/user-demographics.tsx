"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "recharts"

export function UserDemographics() {
  // Mock data for user demographics
  const ageDistributionData = [
    { age: "18-24", users: 3245 },
    { age: "25-34", users: 5621 },
    { age: "35-44", users: 3892 },
    { age: "45-54", users: 1845 },
    { age: "55+", users: 640 },
  ]

  const genderDistributionData = [
    { name: "Male", value: 48 },
    { name: "Female", value: 46 },
    { name: "Non-binary", value: 4 },
    { name: "Other", value: 2 },
  ]

  const locationData = [
    { city: "New York", users: 1842 },
    { city: "Los Angeles", users: 1523 },
    { city: "Chicago", users: 982 },
    { city: "Houston", users: 845 },
    { city: "Phoenix", users: 732 },
    { city: "Philadelphia", users: 654 },
    { city: "San Antonio", users: 621 },
    { city: "San Diego", users: 587 },
    { city: "Dallas", users: 542 },
    { city: "San Jose", users: 498 },
  ]

  const interestData = [
    { interest: "Music", users: 8542 },
    { interest: "Travel", users: 7845 },
    { interest: "Food", users: 7321 },
    { interest: "Movies", users: 6854 },
    { interest: "Sports", users: 5932 },
    { interest: "Reading", users: 5421 },
    { interest: "Gaming", users: 4987 },
    { interest: "Art", users: 3845 },
    { interest: "Fitness", users: 3542 },
    { interest: "Photography", users: 3124 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
            <CardDescription>User breakdown by age group</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageDistributionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" name="Number of Users" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
            <CardDescription>User breakdown by gender</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Top Locations</CardTitle>
            <CardDescription>Cities with most users</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="city" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" name="Number of Users" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Interests</CardTitle>
            <CardDescription>Most common user interests</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={interestData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="interest" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" name="Number of Users" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
