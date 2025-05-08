"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { ContentGallery } from "@/components/admin/content-gallery"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, AlertTriangle } from "lucide-react"

export default function ContentPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [contentFilter, setContentFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  return (
    <div className="space-y-6">
      <AdminHeader title="Content Management" description="Manage user-generated content across the platform" />

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search content..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select value={contentFilter} onValueChange={setContentFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All content</SelectItem>
                <SelectItem value="images">Images</SelectItem>
                <SelectItem value="videos">Videos</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="text">Text</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="removed">Removed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6">
          <Badge variant="outline" className="mr-2 text-red-500 border-red-500">
            <AlertTriangle className="h-3 w-3 mr-1" />
            12 items flagged for review
          </Badge>
          <Badge variant="outline" className="mr-2">
            485 images
          </Badge>
          <Badge variant="outline" className="mr-2">
            127 videos
          </Badge>
          <Badge variant="outline" className="mr-2">
            36 audio files
          </Badge>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="profile">Profile Media</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="flagged">Flagged</TabsTrigger>
            <TabsTrigger value="removed">Removed</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ContentGallery contentType={contentFilter} status={statusFilter} searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="profile">
            <ContentGallery
              contentType={contentFilter}
              status={statusFilter}
              searchQuery={searchQuery}
              source="profile"
            />
          </TabsContent>

          <TabsContent value="messages">
            <ContentGallery
              contentType={contentFilter}
              status={statusFilter}
              searchQuery={searchQuery}
              source="messages"
            />
          </TabsContent>

          <TabsContent value="flagged">
            <ContentGallery contentType={contentFilter} status="flagged" searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="removed">
            <ContentGallery contentType={contentFilter} status="removed" searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
