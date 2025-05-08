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
const revenueData = [
  { date: "Jan", basic: 10500, premium: 15200, events: 2500 },
  { date: "Feb", basic: 11800, premium: 16400, events: 2800 },
  { date: "Mar", basic: 12600, premium: 17500, events: 3100 },
  { date: "Apr", basic: 13200, premium: 19800, events: 3400 },
  { date: "May", basic: 14500, premium: 21200, events: 3700 },
  { date: "Jun", basic: 15800, premium: 23600, events: 4100 },
]

const conversionData = [
  { date: "Jan", rate: 4.2 },
  { date: "Feb", rate: 4.5 },
  { date: "Mar", rate: 4.8 },
  { date: "Apr", rate: 5.2 },
  { date: "May", rate: 5.5 },
  { date: "Jun", rate: 5.8 },
]

const planDistributionData = [
  { name: "Free Tier", value: 65 },
  { name: "Basic Plan", value: 20 },
  { name: "Premium Plan", value: 15 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

export function FinancialReports() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="revenue">
        <TabsList className="w-full border-b mb-4 pb-2">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="distribution">Plan Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>Revenue by subscription type and source</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend />
                    <Bar dataKey="basic" name="Basic Subscriptions" fill="#8884d8" />
                    <Bar dataKey="premium" name="Premium Subscriptions" fill="#82ca9d" />
                    <Bar dataKey="events" name="Virtual Events" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-center">$43,500</h3>
                  <p className="text-sm text-center text-muted-foreground">Current Monthly Revenue</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-center">+51%</h3>
                  <p className="text-sm text-center text-muted-foreground">YTD Revenue Growth</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-center">$82</h3>
                  <p className="text-sm text-center text-muted-foreground">Avg. Revenue Per Paying User</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Free-to-Paid Conversion Rates</CardTitle>
              <CardDescription>Percentage of free users converting to paid plans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={conversionData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      name="Conversion Rate"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg mt-6">
                <h4 className="text-sm font-medium mb-2">Conversion Insights</h4>
                <ul className="text-sm space-y-1">
                  <li>• Current conversion rate: 5.8%</li>
                  <li>• Conversion rate improved by 1.6 percentage points in 6 months</li>
                  <li>• Most conversions occur between days 14-21 of free trial</li>
                  <li>• Premium plan conversion increased 60% after new features launch</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan Distribution</CardTitle>
              <CardDescription>Distribution of users across different subscription plans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={planDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {planDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-medium mb-4">Plan Breakdown</h4>
                  <ul className="space-y-3">
                    {planDistributionData.map((item, index) => (
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
                      While free tier users make up the majority (65%), the 35% paid users generate all revenue. Premium
                      plan subscribers have the highest retention rate at 92%.
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
