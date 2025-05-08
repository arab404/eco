"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function UserActivityHeatmap() {
  const [viewType, setViewType] = useState("day")

  // Mock data for the heatmap
  // This would typically come from your analytics backend
  const dayOfWeekData = [
    { hour: "00", Mon: 12, Tue: 10, Wed: 8, Thu: 11, Fri: 15, Sat: 25, Sun: 18 },
    { hour: "01", Mon: 8, Tue: 7, Wed: 6, Thu: 9, Fri: 12, Sat: 20, Sun: 15 },
    { hour: "02", Mon: 5, Tue: 4, Wed: 3, Thu: 6, Fri: 8, Sat: 15, Sun: 10 },
    { hour: "03", Mon: 3, Tue: 2, Wed: 2, Thu: 4, Fri: 5, Sat: 10, Sun: 7 },
    { hour: "04", Mon: 2, Tue: 1, Wed: 1, Thu: 2, Fri: 3, Sat: 6, Sun: 4 },
    { hour: "05", Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 2, Sat: 4, Sun: 3 },
    { hour: "06", Mon: 3, Tue: 2, Wed: 3, Thu: 3, Fri: 4, Sat: 5, Sun: 4 },
    { hour: "07", Mon: 8, Tue: 7, Wed: 9, Thu: 8, Fri: 10, Sat: 8, Sun: 7 },
    { hour: "08", Mon: 15, Tue: 14, Wed: 16, Thu: 15, Fri: 18, Sat: 12, Sun: 10 },
    { hour: "09", Mon: 25, Tue: 23, Wed: 27, Thu: 24, Fri: 28, Sat: 18, Sun: 15 },
    { hour: "10", Mon: 30, Tue: 28, Wed: 32, Thu: 29, Fri: 35, Sat: 25, Sun: 20 },
    { hour: "11", Mon: 35, Tue: 33, Wed: 38, Thu: 34, Fri: 40, Sat: 32, Sun: 28 },
    { hour: "12", Mon: 40, Tue: 38, Wed: 42, Thu: 39, Fri: 45, Sat: 38, Sun: 35 },
    { hour: "13", Mon: 42, Tue: 40, Wed: 45, Thu: 41, Fri: 48, Sat: 42, Sun: 38 },
    { hour: "14", Mon: 38, Tue: 36, Wed: 40, Thu: 37, Fri: 43, Sat: 45, Sun: 40 },
    { hour: "15", Mon: 35, Tue: 33, Wed: 37, Thu: 34, Fri: 40, Sat: 48, Sun: 42 },
    { hour: "16", Mon: 42, Tue: 40, Wed: 45, Thu: 41, Fri: 48, Sat: 52, Sun: 45 },
    { hour: "17", Mon: 48, Tue: 45, Wed: 50, Thu: 47, Fri: 55, Sat: 58, Sun: 50 },
    { hour: "18", Mon: 52, Tue: 50, Wed: 55, Thu: 51, Fri: 60, Sat: 62, Sun: 55 },
    { hour: "19", Mon: 55, Tue: 52, Wed: 58, Thu: 54, Fri: 65, Sat: 68, Sun: 60 },
    { hour: "20", Mon: 58, Tue: 55, Wed: 60, Thu: 57, Fri: 70, Sat: 72, Sun: 65 },
    { hour: "21", Mon: 52, Tue: 50, Wed: 55, Thu: 51, Fri: 65, Sat: 70, Sun: 62 },
    { hour: "22", Mon: 45, Tue: 42, Wed: 48, Thu: 44, Fri: 58, Sat: 65, Sun: 55 },
    { hour: "23", Mon: 35, Tue: 32, Wed: 38, Thu: 34, Fri: 48, Sat: 55, Sun: 45 },
  ]

  const monthData = [
    { day: "01", Jan: 42, Feb: 45, Mar: 48, Apr: 52 },
    { day: "02", Jan: 40, Feb: 43, Mar: 46, Apr: 50 },
    { day: "03", Jan: 38, Feb: 41, Mar: 44, Apr: 48 },
    // More data would be here in a real implementation
  ]

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <Tabs value={viewType} onValueChange={setViewType} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="day">Day of Week</TabsTrigger>
            <TabsTrigger value="month">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="User segment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="free">Free Users</SelectItem>
            <SelectItem value="basic">Basic Plan</SelectItem>
            <SelectItem value="premium">Premium Plan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <TabsContent value="day" className="mt-0">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Hour
                </th>
                <th scope="col" className="px-6 py-3">
                  Mon
                </th>
                <th scope="col" className="px-6 py-3">
                  Tue
                </th>
                <th scope="col" className="px-6 py-3">
                  Wed
                </th>
                <th scope="col" className="px-6 py-3">
                  Thu
                </th>
                <th scope="col" className="px-6 py-3">
                  Fri
                </th>
                <th scope="col" className="px-6 py-3">
                  Sat
                </th>
                <th scope="col" className="px-6 py-3">
                  Sun
                </th>
              </tr>
            </thead>
            <tbody>
              {dayOfWeekData.map((row) => (
                <tr key={row.hour} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {row.hour}:00
                  </th>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                    const value = row[day as keyof typeof row] as number
                    const intensity = Math.min(Math.floor(value / 10) * 20, 100)
                    return (
                      <td
                        key={day}
                        className="px-6 py-4"
                        style={{
                          backgroundColor: `rgba(136, 132, 216, ${intensity / 100})`,
                          color: intensity > 50 ? "white" : "inherit",
                        }}
                      >
                        {value}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="month" className="mt-0">
        <div className="text-center py-10">
          <p className="text-muted-foreground">Monthly view data visualization would be displayed here</p>
        </div>
      </TabsContent>
    </div>
  )
}
