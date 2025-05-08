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
const contentVolumeData = [
  { date: "Jan", images: 4200, text: 15300, audio: 920 },
  { date: "Feb", images: 4800, text: 16800, audio: 1100 },
  { date: "Mar", images: 5200, text: 17500, audio: 1300 },
  { date: "Apr", images: 6100, text: 19200, audio: 1500 },
  { date: "May", images: 6700, text: 21000, audio: 1750 },
  { date: "Jun", images: 7200, text: 23400, audio: 1900 },
]

const moderationData = [
  { date: "Jan", reported: 152, removed: 85 },
  { date: "Feb", reported: 178, removed: 96 },
  { date: "Mar", reported: 145, removed: 78 },
  { date: "Apr", reported: 162, removed: 93 },
  { date: "May", reported: 187, removed: 106 },
  { date: "Jun", reported: 142, removed: 84 },
]

const violationTypeData = [
  { name: "Inappropriate Content", value: 35 },
  { name: "Harassment", value: 25 },
  { name: "Fake Profile", value: 20 },
  { name: "Spam", value: 15 },
  { name: "Other", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#9966FF"]

export function ContentReports() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="volume">
        <TabsList className="w-full border-b mb-4 pb-2">
          <TabsTrigger value="volume">Content Volume</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
          <TabsTrigger value="violations">Violation Types</TabsTrigger>
        </TabsList>

        <TabsContent value="volume" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Content Volume Trends</CardTitle>
              <CardDescription>Volume of different content types over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={contentVolumeData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="images" name="Images" fill="#8884d8" />
                    <Bar dataKey="text" name="Text Messages" fill="#82ca9d" />
                    <Bar dataKey="audio" name="Audio Messages" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-center">32,200</h3>
                  <p className="text-sm text-center text-muted-foreground">Total Images</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-center">113,200</h3>
                  <p className="text-sm text-center text-muted-foreground">Total Text Messages</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-center">8,470</h3>
                  <p className="text-sm text-center text-muted-foreground">Total Audio Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Content Moderation Activity</CardTitle>
              <CardDescription>Reports and removals over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moderationData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="reported" name="Reported Content" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="removed" name="Removed Content" stroke="#ff8042" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg mt-6">
                <h4 className="text-sm font-medium mb-2">Moderation Insights</h4>
                <ul className="text-sm space-y-1">
                  <li>• Average content removal rate: 56.8%</li>
                  <li>• Average response time: 4.2 hours</li>
                  <li>• May had highest reported content volume (187 reports)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="violations" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Content Violation Types</CardTitle>
              <CardDescription>Breakdown of different violation categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={violationTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {violationTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-medium mb-4">Violation Breakdown</h4>
                  <ul className="space-y-3">
                    {violationTypeData.map((item, index) => (
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
                      Inappropriate content and harassment are the most common violation types, accounting for 60% of
                      all reported content. Consider additional preventative measures for these categories.
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
