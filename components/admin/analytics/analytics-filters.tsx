"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Filter } from "lucide-react"

export function AnalyticsFilters() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <Select defaultValue="all-users">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="User segment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-users">All Users</SelectItem>
                <SelectItem value="new-users">New Users</SelectItem>
                <SelectItem value="active-users">Active Users</SelectItem>
                <SelectItem value="inactive-users">Inactive Users</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-plans">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Subscription" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-plans">All Plans</SelectItem>
                <SelectItem value="free">Free Users</SelectItem>
                <SelectItem value="basic">Basic Plan</SelectItem>
                <SelectItem value="premium">Premium Plan</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-regions">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-regions">All Regions</SelectItem>
                <SelectItem value="north-america">North America</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="asia">Asia</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">More filters</span>
            </Button>
          </div>

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
