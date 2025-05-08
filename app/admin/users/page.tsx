"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { UserTable } from "@/components/admin/user-table"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

// Mock data for users
const mockUsers = [
  {
    id: "1",
    name: "Jessica Smith",
    email: "jessica@example.com",
    status: "active",
    verified: true,
    joined: "2023-01-15",
    reports: 0,
  },
  {
    id: "2",
    name: "Olivia Johnson",
    email: "olivia@example.com",
    status: "active",
    verified: true,
    joined: "2023-03-22",
    reports: 2,
  },
  {
    id: "3",
    name: "Zara Williams",
    email: "zara@example.com",
    status: "pending",
    verified: false,
    joined: "2023-05-10",
    reports: 0,
  },
  {
    id: "4",
    name: "Michael Brown",
    email: "michael@example.com",
    status: "blocked",
    verified: true,
    joined: "2023-02-08",
    reports: 5,
  },
  {
    id: "5",
    name: "James Wilson",
    email: "james@example.com",
    status: "active",
    verified: false,
    joined: "2023-04-30",
    reports: 1,
  },
]

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [verificationFilter, setVerificationFilter] = useState<string>("all")

  // Filter users based on search query and filters
  const filteredUsers = mockUsers.filter((user) => {
    // Search filter
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    // Verification filter
    const matchesVerification =
      verificationFilter === "all" ||
      (verificationFilter === "verified" && user.verified) ||
      (verificationFilter === "unverified" && !user.verified)

    return matchesSearch && matchesStatus && matchesVerification
  })

  return (
    <div className="space-y-6">
      <AdminHeader title="User Management" description="View and manage all user accounts" />

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>

            <Select value={verificationFilter} onValueChange={setVerificationFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <UserTable users={filteredUsers} />
      </Card>
    </div>
  )
}
