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
  AreaChart,
  Area,
} from "recharts"

// Mock data for demonstration
const systemPerformanceData = [
  { date: "Jan", responseTime: 250, errorRate: 1.2, uptime: 99.92 },
  { date: "Feb", responseTime: 240, errorRate: 1.1, uptime: 99.94 },
  { date: "Mar", responseTime: 260, errorRate: 1.3, uptime: 99.91 },
  { date: "Apr", responseTime: 220, errorRate: 0.9, uptime: 99.95 },
  { date: "May", responseTime: 210, errorRate: 0.8, uptime: 99.97 },
  { date: "Jun", responseTime: 200, errorRate: 0.7, uptime: 99.98 },
]

const apiUsageData = [
  { date: "Jan", messages: 450000, matches: 28000, profiles: 120000 },
  { date: "Feb", messages: 520000, matches: 32000, profiles: 140000 },
  { date: "Mar", messages: 580000, matches: 35000, profiles: 160000 },
  { date: "Apr", messages: 620000, matches: 38000, profiles: 180000 },
  { date: "May", messages: 680000, matches: 41000, profiles: 210000 },
  { date: "Jun", messages: 750000, matches: 45000, profiles: 240000 },
]

const loadTimesData = [
  { page: "Home", time: 1.2 },
  { page: "Profile", time: 1.8 },
  { page: "Messages", time: 2.1 },
  { page: "Search", time: 1.9 },
  { page: "Discover", time: 2.3 },
  { page: "Events", time: 1.7 },
]

export function PerformanceReports() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="system">
        <TabsList className="w-full border-b mb-4 pb-2">
          <TabsTrigger value="system">System Performance</TabsTrigger>
          <TabsTrigger value="api">API Usage</TabsTrigger>
          <TabsTrigger value="loadtimes">Load Times</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>System Performance Metrics</CardTitle>
              <CardDescription>Response time, error rate, and uptime metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={systemPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="responseTime"
                      name="Response Time (ms)"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line yAxisId="right" type="monotone" dataKey="errorRate" name="Error Rate (%)" stroke="#ff8042" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-center">200ms</h3>
                  <p className="text-sm text-center text-muted-foreground">Current Response Time</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-center">0.7%</h3>
                  <p className="text-sm text-center text-muted-foreground">Current Error Rate</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-center">99.98%</h3>
                  <p className="text-sm text-center text-muted-foreground">Current Uptime</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>API Usage Statistics</CardTitle>
              <CardDescription>API endpoint usage and request volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={apiUsageData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="messages"
                      name="Message API Calls"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                    />
                    <Area
                      type="monotone"
                      dataKey="profiles"
                      name="Profile API Calls"
                      stackId="1"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                    />
                    <Area
                      type="monotone"
                      dataKey="matches"
                      name="Match API Calls"
                      stackId="1"
                      stroke="#ffc658"
                      fill="#ffc658"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg mt-6">
                <h4 className="text-sm font-medium mb-2">API Usage Insights</h4>
                <ul className="text-sm space-y-1">
                  <li>• Total API calls increased by 67% over 6 months</li>
                  <li>• Messages API consistently accounts for ~70% of all requests</li>
                  <li>• Monthly average: 600,000 total API calls</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loadtimes" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Page Load Times</CardTitle>
              <CardDescription>Average load times for different pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={loadTimesData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 60, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" unit="s" />
                    <YAxis dataKey="page" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="time" name="Load Time (seconds)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg mt-6">
                <h4 className="text-sm font-medium mb-2">Load Time Analysis</h4>
                <ul className="text-sm space-y-1">
                  <li>• Average page load time: 1.83 seconds</li>
                  <li>• Discover page has the slowest load time (2.3s)</li>
                  <li>• Home page loads fastest at 1.2 seconds</li>
                  <li>• All pages meet the target load time of under 3 seconds</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
