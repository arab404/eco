"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Play, Pause, X, Download, Maximize2, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"
import { AudioPlayer } from "@/components/audio-player"

interface MediaMessageProps {
  type: "image" | "video" | "audio" | "file"
  url: string
  fileName?: string
  fileSize?: string
  sender: "me" | "them"
  time: string
  status?: string
  onError?: () => void
}

export function MediaMessage({ type, url, fileName, fileSize, sender, time, status, onError }: MediaMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [error, setError] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isLoading, setIsLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // For gallery view (multiple images)
  const [images, setImages] = useState<string[]>([url])

  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const { toast } = useToast()

  useEffect(() => {
    // Reset loading state when url changes
    setIsLoading(true)

    // Automatically set loading to false for placeholder URLs
    if (
      url.includes("placeholder") ||
      url.startsWith("#") ||
      url === "placeholder-audio" ||
      url === "placeholder-video" ||
      url === "placeholder-file"
    ) {
      setIsLoading(false)
    }
  }, [url])

  const handleError = () => {
    // Don't log errors for placeholder URLs
    if (
      url.includes("placeholder") ||
      url.startsWith("#") ||
      url === "placeholder-audio" ||
      url === "placeholder-video" ||
      url === "placeholder-file"
    ) {
      // For placeholders, just set loading to false but don't show error state
      setIsLoading(false)
      return
    }

    console.error("Media loading error for:", url)
    setError(true)
    setIsLoading(false)
    if (onError) onError()
  }

  const togglePlay = () => {
    // Don't try to play if it's just a placeholder URL
    if (url.includes("placeholder") || url.startsWith("#")) {
      toast({
        title: "Demo mode",
        description: "This is a placeholder. In a real app, actual media would play.",
        variant: "default",
      })
      return
    }

    if (type === "video" && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        // Catch any play errors
        videoRef.current.play().catch((err) => {
          console.error("Error playing video:", err)
          handleError()
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (type === "video" && videoRef.current) {
      videoRef.current.muted = !isMuted
    }
    setIsMuted(!isMuted)
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100
    setVolume(newVolume)

    if (type === "video" && videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  const handleTimeUpdate = () => {
    if (type === "video" && videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration)
      }
    }
  }

  const handleSeek = (value: number[]) => {
    const newTime = value[0]
    setCurrentTime(newTime)

    if (type === "video" && videoRef.current) {
      videoRef.current.currentTime = newTime
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleLoadedData = () => {
    setIsLoading(false)
    if (type === "video" && videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    if (type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }

  // For gallery navigation
  const nextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  const isMe = sender === "me"
  const bgColor = isMe ? "bg-rose-500" : "bg-gray-200"
  const textColor = isMe ? "text-white" : "text-gray-800"
  const borderRadius = isMe ? "rounded-tr-none" : "rounded-tl-none"

  if (error) {
    return (
      <div
        className={`rounded-lg p-3 ${
          isMe ? "bg-rose-500 text-white rounded-tr-none" : "bg-gray-200 text-gray-800 rounded-tl-none"
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <X className="h-4 w-4" />
          <span className="text-sm">Media unavailable</span>
        </div>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className={`text-xs ${isMe ? "text-rose-100" : "text-gray-500"}`}>{time}</span>
          {isMe && status && <span className="text-xs text-rose-100">{status}</span>}
        </div>
      </div>
    )
  }

  // Image message
  if (type === "image") {
    return (
      <div className={`rounded-lg overflow-hidden ${bgColor} ${textColor} ${borderRadius}`}>
        <div className="relative">
          <div className="relative h-48 w-full">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <Image
              src={url || "/placeholder.svg"}
              alt="Image message"
              fill
              className="object-cover"
              onError={handleError}
              onLoad={() => setIsLoading(false)}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full h-8 w-8"
            onClick={toggleExpand}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-2">
          <div className="flex items-center justify-end gap-1">
            <span className={`text-xs ${isMe ? "text-rose-100" : "text-gray-500"}`}>{time}</span>
            {isMe && status && <span className="text-xs text-rose-100">{status}</span>}
          </div>
        </div>

        {isExpanded && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
            onClick={toggleExpand}
          >
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white" onClick={toggleExpand}>
              <X className="h-6 w-6" />
            </Button>

            {/* Gallery navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white h-10 w-10 rounded-full bg-black bg-opacity-50"
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                  }}
                  disabled={currentImageIndex === 0}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white h-10 w-10 rounded-full bg-black bg-opacity-50"
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                  }}
                  disabled={currentImageIndex === images.length - 1}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            <div className="relative max-w-4xl max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
              <Image
                src={images[currentImageIndex] || "/placeholder.svg"}
                alt="Expanded image"
                width={1200}
                height={800}
                className="object-contain max-h-[80vh]"
                onError={handleError}
              />

              {/* Image counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Video message
  if (type === "video") {
    return (
      <div className={`rounded-lg overflow-hidden ${bgColor} ${textColor} ${borderRadius}`}>
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="h-8 w-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <video
            ref={videoRef}
            className="w-full h-48 object-cover"
            poster="/placeholder.svg?height=192&width=300"
            controls={false}
            muted={isMuted}
            onError={handleError}
            onTimeUpdate={handleTimeUpdate}
            onLoadedData={handleLoadedData}
            onEnded={handleEnded}
            playsInline
            preload="metadata"
          >
            {/* Add a source element with type to help browser determine compatibility */}
            <source src={url} type="video/mp4" onError={handleError} />
            Your browser does not support the video tag.
          </video>

          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-white bg-opacity-80 h-12 w-12"
                onClick={togglePlay}
              >
                <Play className="h-6 w-6 text-gray-900" />
              </Button>
            </div>
          )}

          {/* Video controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
            <div className="flex items-center gap-2 mb-1">
              <Button variant="ghost" size="icon" className="h-6 w-6 p-0 text-white" onClick={togglePlay}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              <div className="flex-1">
                <Slider
                  value={[currentTime]}
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="h-1"
                />
              </div>

              <span className="text-xs text-white">
                {formatTime(currentTime)}/{formatTime(duration)}
              </span>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" size="icon" className="h-6 w-6 p-0 text-white" onClick={toggleMute}>
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>

              <Button variant="ghost" size="icon" className="h-6 w-6 p-0 text-white" onClick={toggleExpand}>
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-2">
          <div className="flex items-center justify-end gap-1">
            <span className={`text-xs ${isMe ? "text-rose-100" : "text-gray-500"}`}>{time}</span>
            {isMe && status && <span className="text-xs text-rose-100">{status}</span>}
          </div>
        </div>

        {isExpanded && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col" onClick={toggleExpand}>
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleMute()
                }}
              >
                {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
              </Button>
              <Button variant="ghost" size="icon" className="text-white" onClick={toggleExpand}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex-1 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <video
                className="max-h-[80vh] max-w-full"
                src={url}
                controls
                autoPlay
                muted={isMuted}
                onError={handleError}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
              />
            </div>

            {/* Fullscreen video controls */}
            <div className="p-4 bg-black bg-opacity-50">
              <div className="flex items-center gap-2 mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    togglePlay()
                  }}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>

                <div className="flex-1">
                  <Slider
                    value={[currentTime]}
                    min={0}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={handleSeek}
                    className="h-2"
                  />
                </div>

                <span className="text-sm text-white">
                  {formatTime(currentTime)}/{formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleMute()
                  }}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>

                <div className="w-24">
                  <Slider
                    value={[volume * 100]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleVolumeChange(value)}
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Audio message with enhanced player
  if (type === "audio") {
    return <AudioPlayer url={url} sender={sender} onError={handleError} />
  }

  // File message
  return (
    <div
      className={`rounded-lg p-3 ${
        isMe ? "bg-rose-500 text-white rounded-tr-none" : "bg-gray-200 text-gray-800 rounded-tl-none"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="bg-white bg-opacity-20 rounded p-2 flex-shrink-0">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M13 2V9H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{fileName || "Document"}</p>
          <p className="text-xs opacity-70">{fileSize || "Unknown size"}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full h-8 w-8 flex-shrink-0 ${
            isMe ? "text-white hover:bg-rose-600" : "text-gray-800 hover:bg-gray-300"
          }`}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center justify-end gap-1 mt-2">
        <span className={`text-xs ${isMe ? "text-rose-100" : "text-gray-500"}`}>{time}</span>
        {isMe && status && <span className="text-xs text-rose-100">{status}</span>}
      </div>
    </div>
  )
}
