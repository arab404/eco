"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { ArrowLeft, Trash2, Ban, Shield, CheckCircle, Images, History, Bell } from "lucide-react"
import { UserMedia } from "@/components/admin/user-media"
import { UserActivity } from "@/components/admin/user-activity"
import { UserReports } from "@/components/admin/user-reports"
import { useToast } from "@/components/ui/use-toast"

// Mock user data
const mockUserDetails = {
  id: "1",
  firstName: "Jessica",
  lastName: "Smith",
  email: "jessica@example.com",
  phone: "+1 (555) 123-4567",
  gender: "female",
  dateOfBirth: "1995-06-15",
  location: "New York, NY",
  bio: "Passionate about art, music, and exploring new cultures. Looking for someone who enjoys deep conversations and spontaneous adventures.",
  joinDate: "2023-01-15",
  lastActive: "2023-08-10",
  status: "active",
  verified: true,
  accountType: "standard",
  subscriptionTier: "premium",
  subscriptionExpiry: "2023-12-31",
  reportCount: 0,
  profileImage: "/images/profile1.png",
}

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const userId = params.id as string

  const [userData, setUserData] = useState(mockUserDetails)
  const [isEditing, setIsEditing] = useState(false)

  // Handle user data update
  const handleUpdate = () => {
    // In a real app, this would send an API request
    // For demo, we'll just show a success toast
    toast({
      title: "User updated",
      description: "The user profile has been successfully updated.",
    })
    setIsEditing(false)
  }

  // Handle user deletion
  const handleDelete = () => {
    // In a real app, this would send an API request
    // For demo, we'll just show a success toast and navigate back
    toast({
      title: "User deleted",
      description: "The user account has been successfully deleted.",
    })
    router.push("/admin/users")
  }

  // Handle user block
  const handleBlock = () => {
    setUserData({ ...userData, status: "blocked" })
    toast({
      title: "User blocked",
      description: "The user has been blocked from accessing the platform.",
    })
  }

  // Handle verification approval
  const handleVerify = () => {
    setUserData({ ...userData, verified: true })
    toast({
      title: "User verified",
      description: "The user has been successfully verified.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-4" onClick={() => router.push("/admin/users")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <AdminHeader title={`${userData.firstName} ${userData.lastName}`} description={`Managing user ID: ${userId}`} />
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left column - User profile */}
        <div className="flex-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>View and edit user information</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  className={
                    userData.status === "active"
                      ? "bg-green-500"
                      : userData.status === "blocked"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                  }
                >
                  {userData.status.charAt(0).toUpperCase() + userData.status.slice(1)}
                </Badge>
                {userData.verified && <Badge className="bg-blue-500">Verified</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage
                      src={userData.profileImage || "/placeholder.svg"}
                      alt={`${userData.firstName} ${userData.lastName}`}
                    />
                    <AvatarFallback>
                      {userData.firstName[0]}
                      {userData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-500">Joined: {new Date(userData.joinDate).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">
                      Last Active: {new Date(userData.lastActive).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={userData.firstName}
                      onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={userData.lastName}
                      onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={userData.phone}
                      onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      disabled={!isEditing}
                      value={userData.gender}
                      onValueChange={(value) => setUserData({ ...userData, gender: value })}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={userData.dateOfBirth}
                      onChange={(e) => setUserData({ ...userData, dateOfBirth: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={userData.location}
                      onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountType">Account Type</Label>
                    <Select
                      disabled={!isEditing}
                      value={userData.accountType}
                      onValueChange={(value) => setUserData({ ...userData, accountType: value })}
                    >
                      <SelectTrigger id="accountType">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={userData.bio}
                      onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                      disabled={!isEditing}
                      rows={4}
                    />
                  </div>

                  {isEditing && (
                    <div className="col-span-2 flex items-center space-x-2">
                      <Switch
                        checked={userData.verified}
                        onCheckedChange={(checked) => setUserData({ ...userData, verified: checked })}
                        id="verified"
                      />
                      <Label htmlFor="verified">Verified Account</Label>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleUpdate} className="bg-green-600 hover:bg-green-700">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {!userData.verified && (
                  <Button variant="outline" className="border-green-500 text-green-500" onClick={handleVerify}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Verify User
                  </Button>
                )}
                {userData.status !== "blocked" ? (
                  <Button variant="outline" className="border-red-500 text-red-500" onClick={handleBlock}>
                    <Ban className="mr-2 h-4 w-4" />
                    Block User
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="border-green-500 text-green-500"
                    onClick={() => setUserData({ ...userData, status: "active" })}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Unblock User
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete User
                    </Button>
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
                      <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Right column - Subscription details */}
        <div className="w-full xl:w-80">
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>User's subscription details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Plan</Label>
                <div className="flex items-center">
                  <Badge className="bg-purple-500 text-white">
                    {userData.subscriptionTier.charAt(0).toUpperCase() + userData.subscriptionTier.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Billing Cycle</Label>
                <p className="text-sm">Monthly</p>
              </div>

              <div className="space-y-2">
                <Label>Next Billing Date</Label>
                <p className="text-sm">
                  {userData.subscriptionExpiry ? new Date(userData.subscriptionExpiry).toLocaleDateString() : "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Change Plan</Label>
                <Select
                  disabled={!isEditing}
                  value={userData.subscriptionTier}
                  onValueChange={(value) => setUserData({ ...userData, subscriptionTier: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs for user-related data */}
      <Tabs defaultValue="media" className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="media" className="flex items-center">
            <Images className="h-4 w-4 mr-2" />
            Media
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center">
            <History className="h-4 w-4 mr-2" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>User Media</CardTitle>
              <CardDescription>Media uploaded by this user</CardDescription>
            </CardHeader>
            <CardContent>
              <UserMedia userId={userId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Recent user actions on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <UserActivity userId={userId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>User Reports</CardTitle>
              <CardDescription>Reports involving this user</CardDescription>
            </CardHeader>
            <CardContent>
              <UserReports userId={userId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Send Notification</CardTitle>
              <CardDescription>Send a direct notification to this user</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notificationTitle">Notification Title</Label>
                  <Input id="notificationTitle" placeholder="Enter notification title" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notificationMessage">Message</Label>
                  <Textarea id="notificationMessage" placeholder="Enter your message" rows={4} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notificationType">Type</Label>
                  <Select defaultValue="info">
                    <SelectTrigger id="notificationType">
                      <SelectValue placeholder="Select notification type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Information</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                      <SelectItem value="promotion">Promotion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">
                  <Bell className="mr-2 h-4 w-4" />
                  Send Notification
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
