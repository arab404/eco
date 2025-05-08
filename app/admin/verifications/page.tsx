"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { VerificationTable } from "@/components/admin/verification-table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Clock, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Mock verification data
const mockVerifications = [
  {
    id: "v1",
    userId: "user123",
    name: "Jessica Smith",
    email: "jessica@example.com",
    status: "pending",
    submittedAt: "2023-08-01T14:30:00Z",
    type: "profile",
    documentType: "ID Card",
    imageUrl: "/placeholder.svg?height=300&width=400",
    notes: "",
  },
  {
    id: "v2",
    userId: "user456",
    name: "Michael Brown",
    email: "michael@example.com",
    status: "pending",
    submittedAt: "2023-08-02T10:15:00Z",
    type: "profile",
    documentType: "Passport",
    imageUrl: "/placeholder.svg?height=300&width=400",
    notes: "",
  },
  {
    id: "v3",
    userId: "user789",
    name: "Olivia Johnson",
    email: "olivia@example.com",
    status: "approved",
    submittedAt: "2023-07-29T09:45:00Z",
    processedAt: "2023-07-30T11:20:00Z",
    type: "profile",
    documentType: "Driver's License",
    imageUrl: "/placeholder.svg?height=300&width=400",
    notes: "All information matches profile data.",
  },
  {
    id: "v4",
    userId: "user101",
    name: "Zara Williams",
    email: "zara@example.com",
    status: "rejected",
    submittedAt: "2023-07-28T16:50:00Z",
    processedAt: "2023-07-29T14:10:00Z",
    type: "profile",
    documentType: "ID Card",
    imageUrl: "/placeholder.svg?height=300&width=400",
    notes: "Document appears to be manipulated. Asked user to resubmit.",
  },
]

export default function VerificationsPage() {
  const { toast } = useToast()
  const [verifications, setVerifications] = useState(mockVerifications)
  const [refreshing, setRefreshing] = useState(false)

  // Filter verifications based on status
  const pendingVerifications = verifications.filter((v) => v.status === "pending")
  const approvedVerifications = verifications.filter((v) => v.status === "approved")
  const rejectedVerifications = verifications.filter((v) => v.status === "rejected")

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true)

    // Simulate API call
    setTimeout(() => {
      setRefreshing(false)
      toast({
        title: "Refreshed",
        description: "Verification list has been updated.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <AdminHeader title="Verification Management" description="Review and process user verification requests" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-blue-500 flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            {pendingVerifications.length} Pending
          </Badge>
          <Badge className="bg-green-500 flex items-center">
            <CheckCircle className="mr-1 h-3 w-3" />
            {approvedVerifications.length} Approved
          </Badge>
          <Badge className="bg-red-500 flex items-center">
            <XCircle className="mr-1 h-3 w-3" />
            {rejectedVerifications.length} Rejected
          </Badge>
        </div>

        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Card className="p-4">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <VerificationTable
              verifications={pendingVerifications}
              onStatusChange={(id, status) => {
                setVerifications(
                  verifications.map((v) => (v.id === id ? { ...v, status, processedAt: new Date().toISOString() } : v)),
                )
                toast({
                  title: status === "approved" ? "Verification Approved" : "Verification Rejected",
                  description: `The verification request has been ${status}.`,
                })
              }}
            />
          </TabsContent>

          <TabsContent value="approved">
            <VerificationTable verifications={approvedVerifications} readOnly />
          </TabsContent>

          <TabsContent value="rejected">
            <VerificationTable verifications={rejectedVerifications} readOnly />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
