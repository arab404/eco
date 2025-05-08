"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, ChevronDown, Download, Mail, Shield, Tag, Trash2, X, XCircle } from "lucide-react"

interface UserBulkActionsProps {
  selectedUsers: string[]
  onClearSelection: () => void
}

export function UserBulkActions({ selectedUsers, onClearSelection }: UserBulkActionsProps) {
  const { toast } = useToast()
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationTitle, setNotificationTitle] = useState("")
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleBulkAction = (action: string) => {
    // Here you would implement the actual bulk actions
    // For demo purposes, we'll just show a toast
    toast({
      title: "Bulk action performed",
      description: `${action} action completed for ${selectedUsers.length} selected users.`,
    })
    onClearSelection()
  }

  const handleSendNotification = () => {
    toast({
      title: "Notification sent",
      description: `Notification sent to ${selectedUsers.length} users.`,
    })
    setNotificationMessage("")
    setNotificationTitle("")
    setIsEmailDialogOpen(false)
    onClearSelection()
  }

  const handleBulkDelete = () => {
    toast({
      title: "Users deleted",
      description: `${selectedUsers.length} users have been deleted.`,
    })
    setIsDeleteDialogOpen(false)
    onClearSelection()
  }

  return (
    <div className="flex items-center justify-between bg-muted p-3 rounded-md mb-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          <X className="h-4 w-4 mr-1" />
          Clear selection
        </Button>
        <span className="text-sm font-medium">
          {selectedUsers.length} {selectedUsers.length === 1 ? "user" : "users"} selected
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-1" />
              Send Notification
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Notification to Selected Users</DialogTitle>
              <DialogDescription>
                This notification will be sent to {selectedUsers.length} selected users.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="notification-title" className="text-sm font-medium">
                  Notification Title
                </label>
                <input
                  id="notification-title"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  placeholder="Enter notification title"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="notification-message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="notification-message"
                  placeholder="Type your notification message here..."
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  rows={5}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="notification-type" className="text-sm font-medium">
                  Notification Type
                </label>
                <Select defaultValue="info">
                  <SelectTrigger id="notification-type">
                    <SelectValue placeholder="Select notification type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Informational</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="promotional">Promotional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendNotification}>Send Notification</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm">
                Bulk Actions
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleBulkAction("verify")}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Verify Selected
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction("suspend")}>
                <XCircle className="mr-2 h-4 w-4" />
                Suspend Selected
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleBulkAction("upgrade")}>
                <Tag className="mr-2 h-4 w-4" />
                Upgrade Subscription
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction("role")}>
                <Shield className="mr-2 h-4 w-4" />
                Change Role
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleBulkAction("export")}>
                <Download className="mr-2 h-4 w-4" />
                Export Selected
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Selected Users</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedUsers.length} selected users? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Users
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
