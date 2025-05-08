"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Download, RefreshCw, Save } from "lucide-react"

export function ReportFilters() {
  const [date, setDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="grid gap-2">
            <label htmlFor="report-type" className="text-sm font-medium">
              Report Type
            </label>
            <Select defaultValue="all">
              <SelectTrigger id="report-type" className="w-40">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="registration">User Registration</SelectItem>
                <SelectItem value="activity">User Activity</SelectItem>
                <SelectItem value="message">Message Stats</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="moderation">Content Moderation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="date-from" className="text-sm font-medium">
              Date From
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button id="date-from" variant="outline" className="w-40 justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <label htmlFor="date-to" className="text-sm font-medium">
              Date To
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button id="date-to" variant="outline" className="w-40 justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <Button className="ml-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate Report
          </Button>

          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>

          <Button variant="secondary">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
