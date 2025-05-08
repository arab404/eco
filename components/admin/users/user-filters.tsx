"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DatePickerWithRange } from "@/components/admin/users/date-range-picker"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react"

export function UserFilters() {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    verification: "",
    subscription: "",
    reportCount: "",
    dateJoined: {
      from: null as Date | null,
      to: null as Date | null,
    },
    lastActive: {
      from: null as Date | null,
      to: null as Date | null,
    },
    location: "",
    ageRange: "",
    gender: "",
  })

  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value })

    // Add to active filters if not empty
    if (value && !activeFilters.includes(key)) {
      setActiveFilters([...activeFilters, key])
    } else if (!value && activeFilters.includes(key)) {
      setActiveFilters(activeFilters.filter((f) => f !== key))
    }
  }

  const clearFilter = (key: string) => {
    if (key === "dateJoined" || key === "lastActive") {
      setFilters({ ...filters, [key]: { from: null, to: null } })
    } else {
      setFilters({ ...filters, [key]: "" })
    }
    setActiveFilters(activeFilters.filter((f) => f !== key))
  }

  const clearAllFilters = () => {
    setFilters({
      search: "",
      status: "",
      verification: "",
      subscription: "",
      reportCount: "",
      dateJoined: { from: null, to: null },
      lastActive: { from: null, to: null },
      location: "",
      ageRange: "",
      gender: "",
    })
    setActiveFilters([])
  }

  const getFilterLabel = (key: string): string => {
    const labels: Record<string, string> = {
      search: "Search",
      status: "Status",
      verification: "Verification",
      subscription: "Subscription",
      reportCount: "Reports",
      dateJoined: "Join Date",
      lastActive: "Last Active",
      location: "Location",
      ageRange: "Age Range",
      gender: "Gender",
    }
    return labels[key] || key
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search users by name, email, or ID..."
            className="pl-8"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.verification} onValueChange={(value) => handleFilterChange("verification", value)}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Verification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
              <SelectItem value="pending">Pending Verification</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.subscription} onValueChange={(value) => handleFilterChange("subscription", value)}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Subscription" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          >
            Advanced Filters
            {isAdvancedOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
      </div>

      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleContent className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md">
            <div className="space-y-2">
              <label className="text-sm font-medium">Join Date Range</label>
              <DatePickerWithRange
                date={{
                  from: filters.dateJoined.from,
                  to: filters.dateJoined.to,
                }}
                onDateChange={(range) => handleFilterChange("dateJoined", range)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Last Active Range</label>
              <DatePickerWithRange
                date={{
                  from: filters.lastActive.from,
                  to: filters.lastActive.to,
                }}
                onDateChange={(range) => handleFilterChange("lastActive", range)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                placeholder="e.g. New York"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reports Count</label>
              <Select value={filters.reportCount} onValueChange={(value) => handleFilterChange("reportCount", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Report Count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="0">No Reports</SelectItem>
                  <SelectItem value="1-2">1-2 Reports</SelectItem>
                  <SelectItem value="3-5">3-5 Reports</SelectItem>
                  <SelectItem value="5+">5+ Reports</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Age Range</label>
              <Select value={filters.ageRange} onValueChange={(value) => handleFilterChange("ageRange", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Age Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Age</SelectItem>
                  <SelectItem value="18-24">18-24</SelectItem>
                  <SelectItem value="25-34">25-34</SelectItem>
                  <SelectItem value="35-44">35-44</SelectItem>
                  <SelectItem value="45-54">45-54</SelectItem>
                  <SelectItem value="55+">55+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Gender</label>
              <Select value={filters.gender} onValueChange={(value) => handleFilterChange("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Gender</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-sm font-medium text-gray-500">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="outline" className="flex items-center gap-1 pl-2 pr-1 py-1">
              {getFilterLabel(filter)}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-transparent"
                onClick={() => clearFilter(filter)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" className="ml-2 h-7 text-xs" onClick={clearAllFilters}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
