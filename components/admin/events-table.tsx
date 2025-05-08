"use client"

import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
import { Edit, Music, Trash2, User, Calendar, CalendarClock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Event {
  id: string
  name: string
  type: string
  date: string
  participants: number
  maxParticipants: number
  status: string
  host: string
  hasMusic: boolean
}

interface EventsTableProps {
  events: Event[]
}

export function EventsTable({ events }: EventsTableProps) {
  const router = useRouter()
  const { toast } = useToast()

  // Handle event deletion
  const handleDeleteEvent = (eventId: string) => {
    // In a real app, this would send an API request
    toast({
      title: "Event deleted",
      description: "The event has been deleted successfully.",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-500">Upcoming</Badge>
      case "ongoing":
        return <Badge className="bg-green-500">Ongoing</Badge>
      case "completed":
        return <Badge className="bg-gray-500">Completed</Badge>
      case "canceled":
        return <Badge className="bg-red-500">Canceled</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Participation</TableHead>
          <TableHead>Date & Time</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.length > 0 ? (
          events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                <div className="font-medium">{event.name}</div>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <User className="h-3 w-3 mr-1" />
                  <span>Host: {event.host}</span>
                  {event.hasMusic && (
                    <Badge variant="outline" className="ml-2 h-5 flex items-center text-green-600 border-green-600">
                      <Music className="h-3 w-3 mr-1" />
                      Has Music
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{event.type}</Badge>
              </TableCell>
              <TableCell>
                <div className="w-32">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{event.participants} joined</span>
                    <span>{event.maxParticipants} max</span>
                  </div>
                  <Progress value={(event.participants / event.maxParticipants) * 100} className="h-2" />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  {event.status === "upcoming" ? (
                    <CalendarClock className="h-4 w-4 mr-2 text-blue-500" />
                  ) : (
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  )}
                  <span>{new Date(event.date).toLocaleString()}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-500 border-red-500">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will cancel the event and notify all participants. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteEvent(event.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Yes, Cancel Event
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-6 text-gray-500">
              No events found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
