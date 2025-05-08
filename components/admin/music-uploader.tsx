"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
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
import { Music, Upload, Play, Pause, Trash2, Edit } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Track {
  id: string
  title: string
  artist: string
  duration: string
  uploadDate: string
  size: string
  usedInEvents: number
  url: string
}

interface MusicUploaderProps {
  tracks: Track[]
  onUpdate: (tracks: Track[]) => void
}

export function MusicUploader({ tracks, onUpdate }: MusicUploaderProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [editingTrack, setEditingTrack] = useState<Track | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
  })

  // Simulated file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]

    // Check file type
    if (!file.type.startsWith("audio/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an audio file.",
        variant: "destructive",
      })
      return
    }

    // Start upload
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 300)

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval)
      setUploadProgress(100)

      // Create new track
      const newTrack: Track = {
        id: `track-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        artist: "Unknown Artist",
        duration: "3:45", // Placeholder
        uploadDate: new Date().toISOString(),
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        usedInEvents: 0,
        url: URL.createObjectURL(file),
      }

      // Update tracks
      onUpdate([...tracks, newTrack])

      // Reset upload state
      setIsUploading(false)
      setUploadProgress(0)

      // Show success message
      toast({
        title: "Upload complete",
        description: "Your music track has been uploaded successfully.",
      })

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }, 3000)
  }

  // Handle play/pause
  const handlePlayPause = (track: Track) => {
    if (currentlyPlaying === track.id) {
      // Pause current track
      if (audioRef.current) {
        audioRef.current.pause()
      }
      setCurrentlyPlaying(null)
    } else {
      // Play new track
      if (audioRef.current) {
        audioRef.current.src = track.url
        audioRef.current.play()
      }
      setCurrentlyPlaying(track.id)
    }
  }

  // Handle edit
  const handleEdit = (track: Track) => {
    setEditingTrack(track)
    setFormData({
      title: track.title,
      artist: track.artist,
    })
    setIsEditDialogOpen(true)
  }

  // Handle save edit
  const handleSaveEdit = () => {
    if (!editingTrack) return

    // Update track
    const updatedTracks = tracks.map((track) =>
      track.id === editingTrack.id ? { ...track, title: formData.title, artist: formData.artist } : track,
    )

    onUpdate(updatedTracks)

    // Close dialog
    setIsEditDialogOpen(false)
    setEditingTrack(null)

    // Show success message
    toast({
      title: "Track updated",
      description: "The track details have been updated successfully.",
    })
  }

  // Handle delete
  const handleDelete = (trackId: string) => {
    // Update tracks
    onUpdate(tracks.filter((track) => track.id !== trackId))

    // Stop if currently playing
    if (currentlyPlaying === trackId && audioRef.current) {
      audioRef.current.pause()
      setCurrentlyPlaying(null)
    }

    // Show success message
    toast({
      title: "Track deleted",
      description: "The track has been deleted successfully.",
    })
  }

  return (
    <div className="space-y-4">
      <audio ref={audioRef} className="hidden" onEnded={() => setCurrentlyPlaying(null)} />

      <div className="space-y-2">
        <Button onClick={() => fileInputRef.current?.click()} className="w-full" disabled={isUploading}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Music
        </Button>
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="audio/*" />

        {isUploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-sm text-gray-500 text-center">Uploading... {uploadProgress}%</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Music Library</h3>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Track</TableHead>
                <TableHead>Play</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tracks.length > 0 ? (
                tracks.map((track) => (
                  <TableRow key={track.id}>
                    <TableCell>
                      <div className="font-medium">{track.title}</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <span>{track.artist}</span>
                        <span className="mx-1">•</span>
                        <span>{track.duration}</span>
                        <span className="mx-1">•</span>
                        <span>{track.size}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handlePlayPause(track)}>
                        {currentlyPlaying === track.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(track)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this track from your music library.
                                {track.usedInEvents > 0 && (
                                  <span className="block mt-2 font-medium text-amber-600">
                                    Warning: This track is used in {track.usedInEvents} event
                                    {track.usedInEvents !== 1 ? "s" : ""}.
                                  </span>
                                )}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(track.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
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
                  <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                    <Music className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No music tracks yet</p>
                    <p className="text-sm">Upload tracks to use in virtual events</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Track</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="trackTitle" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="trackTitle"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter track title"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="trackArtist" className="text-sm font-medium">
                Artist
              </label>
              <Input
                id="trackArtist"
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                placeholder="Enter artist name"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
