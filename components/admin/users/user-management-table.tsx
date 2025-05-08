"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Check,
  MoreVertical,
  Ban,
  Edit,
  CheckCircle,
  Eye,
  PauseCircle,
  ShieldAlert,
  User,
  Clock,
  Crown,
  Shield,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Extended mock data for users
const mockUsers = [
  {
    id: "1",
    firstName: "Jessica",
    lastName: "Smith",
    email: "jessica@example.com",
    status: "active",
    verified: true,
    joined: "2023-01-15",
    lastActive: "2023-08-10T14:30:00Z",
    reports: 0,
    profileImage: "/images/profile1.png",
    subscription: "premium",
    location: "New York, NY",
    age: 28,
    gender: "female",
    completionRate: 95,
    role: "user",
  },
  {
    id: "2",
    firstName: "Olivia",
    lastName: "Johnson",
    email: "olivia@example.com",
    status: "active",
    verified: true,
    joined: "2023-03-22",
    lastActive: "2023-08-09T11:15:00Z",
    reports: 2,
    profileImage: "/images/profile2.png",
    subscription: "premium",
    location: "Los Angeles, CA",
    age: 32,
    gender: "female",
    completionRate: 100,
    role: "user",
  },
  {
    id: "3",
    firstName: "Zara",
    lastName: "Williams",
    email: "zara@example.com",
    status: "pending",
    verified: false,
    joined: "2023-05-10",
    lastActive: "2023-08-05T09:45:00Z",
    reports: 0,
    profileImage: "/placeholder.svg?height=48&width=48",
    subscription: "free",
    location: "Chicago, IL",
    age: 25,
    gender: "female",
    completionRate: 65,
    role: "user",
  },
  {
    id: "4",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael@example.com",
    status: "blocked",
    verified: true,
    joined: "2023-02-08",
    lastActive: "2023-07-28T16:30:00Z",
    reports: 5,
    profileImage: "/placeholder.svg?height=48&width=48",
    subscription: "free",
    location: "Houston, TX",
    age: 35,
    gender: "male",
    completionRate: 80,
    role: "user",
  },
  {
    id: "5",
    firstName: "James",
    lastName: "Wilson",
    email: "james@example.com",
    status: "active",
    verified: false,
    joined: "2023-04-30",
    lastActive: "2023-08-08T13:20:00Z",
    reports: 1,
    profileImage: "/placeholder.svg?height=48&width=48",
    subscription: "gold",
    location: "Miami, FL",
    age: 30,
    gender: "male",
    completionRate: 85,
    role: "moderator",
  },
  {
    id: "6",
    firstName: "Emma",
    lastName: "Garcia",
    email: "emma@example.com",
    status: "suspended",
    verified: true,
    joined: "2023-03-15",
    lastActive: "2023-07-25T10:45:00Z",
    reports: 3,
    profileImage: "/placeholder.svg?height=48&width=48",
    subscription: "premium",
    location: "Boston, MA",
    age: 27,
    gender: "female",
    completionRate: 90,
    role: "user",
  },
  {
    id: "7",
    firstName: "David",
    lastName: "Martinez",
    email: "david@example.com",
    status: "active",
    verified: true,
    joined: "2023-02-20",
    lastActive: "2023-08-10T09:30:00Z",
    reports: 0,
    profileImage: "/placeholder.svg?height=48&width=48",
    subscription: "gold",
    location: "Seattle, WA",
    age: 34,
    gender: "male",
    completionRate: 100,
    role: "admin",
  },
]

interface UserManagementTableProps {
  selectedUsers: string[]
  setSelectedUsers: (users: string[]) => void
}

export function UserManagementTable({ selectedUsers, setSelectedUsers }: UserManagementTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState(mockUsers)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const usersPerPage = 5
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(users.length / usersPerPage)

  // Sort users
  const sortUsers = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // New field, set to ascending
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Check if all visible users are selected
  const allSelected = currentUsers.length > 0 && currentUsers.every((user) => selectedUsers.includes(user.id))

  // Toggle select all
  const toggleSelectAll = () => {
    if (allSelected) {
      // Remove current page users from selection
      setSelectedUsers(selectedUsers.filter((id) => !currentUsers.find((user) => user.id === id)))
    } else {
      // Add current page users to selection
      const currentIds = currentUsers.map((user) => user.id)
      const newSelectedUsers = [...selectedUsers]

      currentIds.forEach((id) => {
        if (!newSelectedUsers.includes(id)) {
          newSelectedUsers.push(id)
        }
      })

      setSelectedUsers(newSelectedUsers)
    }
  }

  // Toggle selection of a single user
  const toggleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  // Handle user status change
  const handleStatusChange = (userId: string, newStatus: string) => {
    // Update the user status in our local state
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))

    // Show success toast
    toast({
      title: `User ${newStatus}`,
      description: `User has been ${newStatus} successfully.`,
    })
  }

  // Handle user verification
  const handleVerify = (userId: string) => {
    // Update user verification status
    setUsers(users.map((user) => (user.id === userId ? { ...user, verified: true } : user)))

    toast({
      title: "User verified",
      description: "User has been verified successfully.",
    })
  }

  // Handle user role change
  const handleRoleChange = (userId: string, newRole: string) => {
    // Update user role
    setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))

    toast({
      title: "Role updated",
      description: `User role has been updated to ${newRole}.`,
    })
  }

  // Render status badge with appropriate color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>
      case "blocked":
        return <Badge className="bg-red-500">Blocked</Badge>
      case "suspended":
        return <Badge className="bg-orange-500">Suspended</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  // Render time since last active
  const getTimeSinceLastActive = (lastActiveDate: string) => {
    const lastActive = new Date(lastActiveDate)
    const now = new Date()
    const diffMs = now.getTime() - lastActive.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60))
        return `${diffMinutes} minutes ago`
      }
      return `${diffHours} hours ago`
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return lastActive.toLocaleDateString()
    }
  }

  // Render role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-purple-500 flex items-center gap-1">
            <ShieldAlert className="h-3 w-3" />
            Admin
          </Badge>
        )
      case "moderator":
        return (
          <Badge className="bg-blue-500 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Moderator
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-500 flex items-center gap-1">
            <User className="h-3 w-3" />
            User
          </Badge>
        )
    }
  }

  // Render subscription badge
  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription) {
      case "gold":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="border-amber-500 text-amber-500 flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Gold
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Gold membership with all premium features</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      case "premium":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="border-purple-500 text-purple-500">
                  Premium
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Premium membership with enhanced features</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      default:
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="border-gray-400 text-gray-400">
                  Free
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Free tier with basic features</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">
                <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} aria-label="Select all users" />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => sortUsers("name")}>
                User
                {sortField === "name" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
              </TableHead>
              <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => sortUsers("status")}>
                Status
                {sortField === "status" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
              </TableHead>
              <TableHead className="cursor-pointer hidden lg:table-cell" onClick={() => sortUsers("role")}>
                Role
                {sortField === "role" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
              </TableHead>
              <TableHead className="cursor-pointer hidden lg:table-cell" onClick={() => sortUsers("lastActive")}>
                Last Active
                {sortField === "lastActive" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
              </TableHead>
              <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => sortUsers("subscription")}>
                Subscription
                {sortField === "subscription" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
              </TableHead>
              <TableHead className="cursor-pointer hidden xl:table-cell" onClick={() => sortUsers("reports")}>
                Reports
                {sortField === "reports" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => toggleSelectUser(user.id)}
                      aria-label={`Select ${user.firstName} ${user.lastName}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={user.profileImage || "/placeholder.svg"}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                        <AvatarFallback>
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium flex items-center">
                          {user.firstName} {user.lastName}
                          {user.verified && <Check className="ml-1 h-4 w-4 text-blue-500" />}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="hidden lg:table-cell">{getRoleBadge(user.role)}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-gray-400" />
                      <span className="text-sm">{getTimeSinceLastActive(user.lastActive)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{getSubscriptionBadge(user.subscription)}</TableCell>
                  <TableCell className="hidden xl:table-cell">
                    {user.reports > 0 ? (
                      <Badge variant="outline" className="bg-red-100 text-red-800">
                        {user.reports}
                      </Badge>
                    ) : (
                      <span className="text-gray-500">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {!user.verified && (
                          <DropdownMenuItem onClick={() => handleVerify(user.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Verify
                          </DropdownMenuItem>
                        )}
                        {user.status === "active" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, "suspended")}>
                            <PauseCircle className="mr-2 h-4 w-4" />
                            Suspend
                          </DropdownMenuItem>
                        )}
                        {user.status !== "blocked" ? (
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, "blocked")}>
                            <Ban className="mr-2 h-4 w-4" />
                            Block
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, "active")}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Unblock
                          </DropdownMenuItem>
                        )}
                        {user.status === "suspended" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, "active")}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Reactivate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() =>
                            handleRoleChange(
                              user.id,
                              user.role === "user" ? "moderator" : user.role === "moderator" ? "admin" : "user",
                            )
                          }
                        >
                          <ShieldAlert className="mr-2 h-4 w-4" />
                          Change Role
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage > 1) setCurrentPage(currentPage - 1)
              }}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1
            // Show first, last, and pages around current
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(pageNumber)
                    }}
                    isActive={pageNumber === currentPage}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            }

            // Show ellipsis
            if (
              (pageNumber === 2 && currentPage > 3) ||
              (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
            ) {
              return (
                <PaginationItem key={`ellipsis-${pageNumber}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }

            return null
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage < totalPages) setCurrentPage(currentPage + 1)
              }}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
