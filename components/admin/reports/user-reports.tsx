"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

// Mock data for demonstration
const registrationData = [
  { date: "Jan", count: 120 },
  { date: "Feb", count: 180 },
  { date: "Mar", count: 210 },
  { date: "Apr", count: 320 },
  { date: "May", count: 290 },
  { date: "Jun", count: 350 },
]

const activityData = [
  { date: "Jan", active: 2100, engaged: 1400, inactive: 700 },
  { date: "Feb", active: 2400, engaged: 1600, inactive: 800 },
  { date: "Mar", active: 2200, engaged: 1500, inactive: 700 },
  { date: "Apr", active: 2800, engaged: 1900, inactive: 900 },
  { date: "May", active: 3000, engaged: 2100, inactive: 900 },
  { date: "Jun", active: 3300, engaged: 2300, inactive: 1000 },
]

const retentionData = [
  { cohort: "Jan", "1w": 100, "2w": 85, "1m": 70, "3m": 55 },
  { cohort: "Feb", "1w": 100, "2w": 80, "1m": 68, "3m": 52 },
  { cohort: "Mar", "1w": 100, "2w": 90, "1m": 78, "3m": 65 },
  { cohort: "Apr", "1w": 100, "2w": 92, "1m": 82, "3m": 70 },
  { cohort: "May", "1w": 100, "2w": 94, "1m": 85, "3m": 72 },
]

const demographicsData = [
  { name: "18-24", value: 35 },
  { name: "25-34", value: 40 },
  { name: "35-44", value: 20 },
  { name: "45+", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export function UserReports() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="registration">
        <TabsList className="w-full border-b mb-4 pb-2">
          <TabsTrigger value="registration">Registration</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="registration" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>User Registration Trends</CardTitle>
              <CardDescription>New user registrations over the selected time period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={registrationData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" name="New Users" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg mt-6">
                <h4 className="text-sm font-medium mb-2">Key Insights</h4>
                <ul className="text-sm space-y-1">
                  <li>• Monthly user registration increased by 191% over 6 months</li>
                  <li>• Highest growth observed in April (52% increase)</li>
                  <li>• Average daily sign-ups: 11.7 users</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Metrics</CardTitle>
              <CardDescription>Active, engaged and inactive user statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="active" name="Active Users" stackId="a" fill="#8884d8" />
                    <Bar dataKey="engaged" name="Highly Engaged" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="inactive" name="Inactive Users" stackId="a" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-center">3,300</h3>
                  <p className="text-sm text-center text-muted-foreground">Monthly Active Users</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-center">70%</h3>
                  <p className="text-sm text-center text-muted-foreground">Engagement Rate</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-center">14.3</h3>
                  <p className="text-sm text-center text-muted-foreground">Avg. Sessions per User</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>User Retention Analysis</CardTitle>
              <CardDescription>Cohort analysis showing user retention over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={retentionData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="cohort" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="1w" name="1 Week" stroke="#8884d8" />
                    <Line type="monotone" dataKey="2w" name="2 Weeks" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="1m" name="1 Month" stroke="#ffc658" />
                    <Line type="monotone" dataKey="3m" name="3 Months" stroke="#ff8042" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg mt-6">
                <h4 className="text-sm font-medium mb-2">Retention Insights</h4>
                <ul className="text-sm space-y-1">
                  <li>• 2-week retention improved from 80% to 94% over 5 months</li>
                  <li>• 3-month retention rate increased by 17% since January</li>
                  <li>• March cohort shows highest overall retention</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>User Demographics</CardTitle>
              <CardDescription>Age distribution of platform users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={demographicsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {demographicsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-medium mb-4">Demographic Breakdown</h4>
                  <ul className="space-y-3">
                    {demographicsData.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="ml-auto text-sm">{item.value}%</span>
                      </li>
                    ))}
                  </ul>

                  <div className="bg-muted/50 p-4 rounded-lg mt-6">
                    <h4 className="text-sm font-medium mb-2">Key Insights</h4>
                    <p className="text-sm">
                      The platform attracts primarily young adults, with 75% of users under 35 years old. The 25-34 age
                      group represents the largest demographic segment.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
