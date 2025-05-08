"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, XCircle, AlertCircle, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock verification queue data
const mockVerifications = [
  {
    id: "v1",
    userId: "u1",
    userName: "Jessica Smith",
    userEmail: "jessica@example.com",
    userImage: "/images/profile1.png",
    verificationType: "identity",
    submittedDate: "2023-07-25T14:30:00Z",
    status: "pending",
    documents: [
      { id: "doc1", type: "id", url: "/placeholder.svg?height=300&width=400" },
      { id: "doc2", type: "selfie", url: "/images/profile1.png" },
    ],
    notes: "Government-issued ID and selfie submitted for verification.",
  },
  {
    id: "v2",
    userId: "u2",
    userName: "Michael Johnson",
    userEmail: "michael@example.com",
    userImage: "/placeholder.svg?height=48&width=48",
    verificationType: "identity",
    submittedDate: "2023-07-26T10:15:00Z",
    status: "pending",
    documents: [
      { id: "doc3", type: "id", url: "/placeholder.svg?height=300&width=400" },
      { id: "doc4", type: "selfie", url: "/placeholder.svg?height=300&width=300" },
    ],
    notes: "Passport and selfie submitted for verification.",
  },
  {
    id: "v3",
    userId: "u3",
    userName: "Emma Wilson",
    userEmail: "emma@example.com",
    userImage: "/placeholder.svg?height=48&width=48",
    verificationType: "professional",
    submittedDate: "2023-07-24T09:45:00Z",
    status: "pending",
    documents: [
      { id: "doc5", type: "certificate", url: "/placeholder.svg?height=300&width=400" },
      { id: "doc6", type: "business", url: "/placeholder.svg?height=300&width=400" },
    ],
    notes: "Professional certificate and business license submitted for verification.",
  },
  {
    id: "v4",
    userId: "u4",
    userName: "David Martinez",
    userEmail: "david@example.com",
    userImage: "/placeholder.svg?height=48&width=48",
    verificationType: "identity",
    submittedDate: "2023-07-22T16:20:00Z",
    status: "approved",
    documents: [
      { id: "doc7", type: "id", url: "/placeholder.svg?height=300&width=400" },
      { id: "doc8", type: "selfie", url: "/placeholder.svg?height=300&width=300" },
    ],
    notes: "Driver's license and selfie verified successfully.",
  },
  {
    id: "v5",
    userId: "u5",
    userName: "Olivia Brown",
    userEmail: "olivia@example.com",
    userImage: "/images/profile2.png",
    verificationType: "education",
    submittedDate: "2023-07-23T11:30:00Z",
    status: "rejected",
    documents: [{ id: "doc9", type: "diploma", url: "/placeholder.svg?height=300&width=400" }],
    notes: "Diploma appears to be edited or modified. Requested original document.",
  },
]

export function UserVerificationQueue() {
  const { toast } = useToast()
  const [verifications, setVerifications] = useState(mockVerifications)
  const [filterStatus, setFilterStatus] = useState("pending")
  const [filterType, setFilterType] = useState("all")

  // Filter verifications based on current filters
  const filteredVerifications = verifications.filter((verification) => {
    const matchStatus = filterStatus === "all" || verification.status === filterStatus
    const matchType = filterType === "all" || verification.verificationType === filterType
    return matchStatus && matchType
  })

  // Handle verification approval
  const handleApprove = (verificationId: string) => {
    setVerifications(verifications.map((v) => (v.id === verificationId ? { ...v, status: "approved" } : v)))

    toast({
      title: "Verification approved",
      description: "User has been successfully verified.",
    })
  }

  // Handle verification rejection
  const handleReject = (verificationId: string) => {
    setVerifications(verifications.map((v) => (v.id === verificationId ? { ...v, status: "rejected" } : v)))

    toast({
      title: "Verification rejected",
      description: "User verification has been rejected.",
    })
  }

  // Get time since submission
  const getTimeSinceSubmission = (date: string) => {
    const submissionDate = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - submissionDate.getTime()
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
    } else {
      return `${diffDays} days ago`
    }
  }

  // Get verification type label
  const getVerificationTypeLabel = (type: string) => {
    switch (type) {
      case "identity":
        return "Identity Verification"
      case "professional":
        return "Professional Credentials"
      case "education":
        return "Educational Background"
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="text-lg font-semibold">User Verification Queue</div>
        <div className="flex flex-wrap gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Verification Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="identity">Identity</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="education">Education</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVerifications.length > 0 ? (
          filteredVerifications.map((verification) => (
            <Card
              key={verification.id}
              className={
                verification.status === "pending"
                  ? "border-amber-200"
                  : verification.status === "approved"
                    ? "border-green-200"
                    : "border-red-200"
              }
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={verification.userImage || "/placeholder.svg"} alt={verification.userName} />
                      <AvatarFallback>{verification.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{verification.userName}</CardTitle>
                      <CardDescription>{verification.userEmail}</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(verification.status)}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Verification Type</div>
                    <div>{getVerificationTypeLabel(verification.verificationType)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Submitted</div>
                    <div>{getTimeSinceSubmission(verification.submittedDate)}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-500 mb-2">Documents</div>
                  <div className="flex flex-wrap gap-2">
                    {verification.documents.map((doc) => (
                      <div key={doc.id} className="border rounded-md p-1 w-16 h-16 relative overflow-hidden">
                        <img
                          src={doc.url || "/placeholder.svg"}
                          alt={`${doc.type} document`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {verification.notes && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Notes</div>
                    <div className="text-sm">{verification.notes}</div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {verification.status === "pending" ? (
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                      onClick={() => handleReject(verification.id)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(verification.id)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                ) : (
                  <div className="w-full">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        setVerifications(
                          verifications.map((v) => (v.id === verification.id ? { ...v, status: "pending" } : v)),
                        )
                      }
                    >
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Reopen Verification
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No verification requests match your filters
          </div>
        )}
      </div>
    </div>
  )
}
