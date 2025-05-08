"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { EventsTable } from "@/components/admin/events-table"
import { MusicUploader } from "@/components/admin/music-uploader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar, Music, Plus, Search } from "lucide-react"

// Mock events data
const mockEvents = [
  {
    id: "e1",
    name: "Summer Singles Mixer",
    type: "Virtual",
    date: "2023-08-15T19:00:00Z",
    participants: 68,
    maxParticipants: 100,
    status: "upcoming",
    host: "Jessica Smith",
    hasMusic: true,
  },
  {
    id: "e2",
    name: "Speed Dating Night",
    type: "In-Person",
    date: "2023-08-20T18:30:00Z",
    participants: 42,
    maxParticipants: 50,
    status: "upcoming",
    host: "Admin",
    hasMusic: true,
  },
  {
    id: "e3",
    name: "Virtual Book Club",
    type: "Virtual",
    date: "2023-07-10T20:00:00Z",
    participants: 25,
    maxParticipants: 30,
    status: "completed",
    host: "Michael Brown",
    hasMusic: false,
  },
  {
    id: "e4",
    name: "Language Exchange",
    type: "Virtual",
    date: "2023-08-05T17:00:00Z",
    participants: 15,
    maxParticipants: 20,
    status: "completed",
    host: "Admin",
    hasMusic: true,
  },
]

// Mock music tracks
const mockTracks = [
  {
    id: "m1",
    title: "Chill Lounge",
    artist: "DJ Relax",
    duration: "3:45",
    uploadDate: "2023-07-01T14:30:00Z",
    size: "5.2 MB",
    usedInEvents: 3,
    url: "/path-to-audio1.mp3",
  },
  {
    id: "m2",
    title: "Party Vibes",
    artist: "Mix Master",
    duration: "4:12",
    uploadDate: "2023-07-12T09:15:00Z",
    size: "6.8 MB",
    usedInEvents: 2,
    url: "/path-to-audio2.mp3",
  },
  {
    id: "m3",
    title: "Romantic Evening",
    artist: "Smooth Sounds",
    duration: "5:30",
    uploadDate: "2023-07-20T16:45:00Z",
    size: "8.1 MB",
    usedInEvents: 1,
    url: "/path-to-audio3.mp3",
  },
]

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [events, setEvents] = useState(mockEvents)
  const [tracks, setTracks] = useState(mockTracks)

  // Filter events based on search query
  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.host.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Upcoming and past events
  const upcomingEvents = filteredEvents.filter((event) => event.status === "upcoming")
  const pastEvents = filteredEvents.filter((event) => event.status === "completed")

  return (
    <div className="space-y-6">
      <AdminHeader title="Event Management" description="Manage virtual events and upload music" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-4">
            <CardHeader className="px-0 pt-0">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Events
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search events..."
                      className="pl-8 w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Event
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  {upcomingEvents.length} Upcoming
                </Badge>
                <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                  {pastEvents.length} Past
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                  <EventsTable events={upcomingEvents} />
                </TabsContent>

                <TabsContent value="past">
                  <EventsTable events={pastEvents} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Music className="mr-2 h-5 w-5" />
                Music Library
              </CardTitle>
              <CardDescription>Upload and manage music for virtual events</CardDescription>
            </CardHeader>
            <CardContent>
              <MusicUploader tracks={tracks} onUpdate={setTracks} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
