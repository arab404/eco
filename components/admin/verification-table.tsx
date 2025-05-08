"use client"

import { useState } from "react"
import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Eye } from "lucide-react"

interface Verification {
  id: string
  userId: string
  name: string
  email: string
  status: string
  submittedAt: string
  processedAt?: string
  type: string
  documentType: string
  imageUrl: string
  notes: string
}

interface VerificationTableProps {
  verifications: Verification[]
  readOnly?: boolean
  onStatusChange?: (id: string, status: string, notes?: string) => void
}

export function VerificationTable({ verifications, readOnly = false, onStatusChange }: VerificationTableProps) {
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null)
  const [reviewNotes, setReviewNotes] = useState("")

  const handleVerificationAction = (id: string, status: string) => {
    if (onStatusChange) {
      onStatusChange(id, status, reviewNotes)
      setSelectedVerification(null)
      setReviewNotes("")
    }
  }

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
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Document</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            {!readOnly && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {verifications.length > 0 ? (
            verifications.map((verification) => (
              <TableRow key={verification.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/placeholder.svg?height=36&width=36" alt={verification.name} />
                      <AvatarFallback>{verification.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{verification.name}</div>
                      <div className="text-sm text-gray-500">{verification.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{verification.documentType}</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>Submitted: {new Date(verification.submittedAt).toLocaleDateString()}</div>
                    {verification.processedAt && (
                      <div className="text-gray-500">
                        Processed: {new Date(verification.processedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(verification.status)}</TableCell>
                {!readOnly && (
                  <TableCell className="text-right">
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedVerification(verification)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={readOnly ? 4 : 5} className="text-center py-6 text-gray-500">
                No verification requests found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Review dialog */}
      <Dialog
        open={!!selectedVerification}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedVerification(null)
            setReviewNotes("")
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Verification Review</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <Label>User</Label>
                <div className="font-medium">{selectedVerification?.name}</div>
                <div className="text-sm text-gray-500">{selectedVerification?.email}</div>
              </div>
              <div className="text-right">
                <Label>Document Type</Label>
                <div className="font-medium">{selectedVerification?.documentType}</div>
                <div className="text-sm text-gray-500">
                  Submitted: {selectedVerification && new Date(selectedVerification.submittedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="border rounded-md overflow-hidden">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={selectedVerification?.imageUrl || "/placeholder.svg"}
                  alt="ID document"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Review Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add your review notes here..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                className="border-red-500 text-red-500"
                onClick={() => selectedVerification && handleVerificationAction(selectedVerification.id, "rejected")}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => selectedVerification && handleVerificationAction(selectedVerification.id, "approved")}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
