"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, MoreVertical, Trash2, Ban, Edit, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface User {
  id: string
  name: string
  email: string
  status: string
  verified: boolean
  joined: string
  reports: number
}

interface UserTableProps {
  users: User[]
}

export function UserTable({ users }: UserTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  const handleStatusChange = (userId: string, newStatus: string) => {
    // In a real app, you would call an API to update the user status
    toast({
      title: `User ${newStatus}`,
      description: `User has been ${newStatus} successfully.`,
    })
  }

  const handleDelete = (userId: string) => {
    // In a real app, you would call an API to delete the user
    toast({
      title: "User deleted",
      description: "User has been deleted successfully.",
    })
  }

  const handleVerify = (userId: string) => {
    // In a real app, you would call an API to verify the user
    toast({
      title: "User verified",
      description: "User has been verified successfully.",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>
      case "blocked":
        return <Badge className="bg-red-500">Blocked</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reports</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/placeholder.svg?height=36&width=36" alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium flex items-center">
                        {user.name}
                        {user.verified && <Check className="ml-1 h-4 w-4 text-blue-500" />}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>
                  {user.reports > 0 ? (
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      {user.reports}
                    </Badge>
                  ) : (
                    <span className="text-gray-500">0</span>
                  )}
                </TableCell>
                <TableCell>{new Date(user.joined).toLocaleDateString()}</TableCell>
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
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {!user.verified && (
                        <DropdownMenuItem onClick={() => handleVerify(user.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Verify
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
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the user account and remove all
                              associated data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(user.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
