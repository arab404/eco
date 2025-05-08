"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface AudioPlayerProps {
  url: string
  sender: "me" | "them"
  onError?: () => void
  compact?: boolean
  autoPlay?: boolean
}

export function AudioPlayer({ url, sender, onError, compact = false, autoPlay = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [showVolumeControl, setShowVolumeControl] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const waveformCanvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  // Generate random waveform data for demo purposes
  // In a real app, you would analyze the actual audio file
  const generateWaveformData = () => {
    const data = []
    const length = 50
    for (let i = 0; i < length; i++) {
      // Create a pattern that looks like a voice waveform
      let value
      if (i % 3 === 0) {
        value = 0.2 + Math.random() * 0.3
      } else if (i % 7 === 0) {
        value = 0.7 + Math.random() * 0.3
      } else {
        value = 0.3 + Math.random() * 0.4
      }
      data.push(value)
    }
    return data
  }

  const waveformData = useRef(generateWaveformData())

  // Draw waveform
  const drawWaveform = (progress: number) => {
    const canvas = waveformCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const barWidth = width / waveformData.current.length
    const barGap = 2
    const barWidthWithGap = barWidth - barGap

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw waveform bars
    waveformData.current.forEach((value, index) => {
      const x = index * barWidth
      const barHeight = value * height * 0.8

      // Calculate if this bar should be highlighted (based on progress)
      const progressPosition = progress * waveformData.current.length
      const isActive = index <= progressPosition

      // Set color based on sender and active state
      if (sender === "me") {
        ctx.fillStyle = isActive ? "#ffffff" : "rgba(255, 255, 255, 0.5)"
      } else {
        ctx.fillStyle = isActive ? "#ec4899" : "rgba(236, 72, 153, 0.5)"
      }

      // Draw bar
      ctx.fillRect(x, (height - barHeight) / 2, barWidthWithGap, barHeight)
    })
  }

  // Initialize audio and canvas
  useEffect(() => {
    if (waveformCanvasRef.current) {
      // Set canvas dimensions
      const canvas = waveformCanvasRef.current
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio

      // Initial draw with 0 progress
      drawWaveform(0)
    }

    // Reset state when URL changes
    setIsPlaying(false)
    setCurrentTime(0)
    setIsLoading(true)
    setError(false)

    // For demo URLs, set loading to false
    if (url.includes("placeholder") || url === "placeholder-audio" || url.startsWith("#")) {
      setIsLoading(false)
      setDuration(120) // 2 minutes placeholder duration
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [url])

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoading(false)
      if (autoPlay) {
        audio.play().catch((err) => {
          console.error("Error auto-playing audio:", err)
        })
      }
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      audio.currentTime = 0
    }

    const handleError = (e: ErrorEvent) => {
      console.error("Audio error:", e)
      setError(true)
      setIsLoading(false)
      if (onError) onError()
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError as EventListener)

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError as EventListener)
    }
  }, [autoPlay, onError])

  // Update waveform animation
  useEffect(() => {
    if (isPlaying) {
      const updateWaveform = () => {
        const progress = currentTime / (duration || 1)
        drawWaveform(progress)
        animationRef.current = requestAnimationFrame(updateWaveform)
      }

      animationRef.current = requestAnimationFrame(updateWaveform)
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    } else {
      // When paused, just draw once with current progress
      const progress = currentTime / (duration || 1)
      drawWaveform(progress)
    }
  }, [isPlaying, currentTime, duration])

  // Toggle play/pause
  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().catch((err) => {
        console.error("Error playing audio:", err)
      })
      setIsPlaying(true)
    }
  }

  // Toggle mute
  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.muted = !isMuted
    setIsMuted(!isMuted)
  }

  // Handle seek
  const handleSeek = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = value[0]
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = value[0] / 100
    audio.volume = newVolume
    setVolume(newVolume)
  }

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Determine colors based on sender
  const bgColor = sender === "me" ? "bg-rose-500" : "bg-gray-200"
  const textColor = sender === "me" ? "text-white" : "text-gray-800"
  const progressColor = sender === "me" ? "bg-white" : "bg-rose-500"
  const progressBgColor = sender === "me" ? "bg-rose-400" : "bg-gray-300"

  if (error) {
    return (
      <div className={`rounded-lg p-3 ${bgColor} ${textColor}`}>
        <div className="flex items-center gap-2">
          <span className="text-sm">Audio unavailable</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-lg p-3 ${bgColor} ${textColor}`}>
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" className="hidden">
        {/* Only add source if it's not a placeholder URL */}
        {!url.includes("placeholder") && !url.startsWith("#") && <source src={url} type="audio/mpeg" />}
        Your browser does not support the audio element.
      </audio>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {/* Play/Pause button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full",
              sender === "me"
                ? "bg-white/20 hover:bg-white/30 text-white"
                : "bg-gray-300 hover:bg-gray-400 text-gray-800",
            )}
            onClick={togglePlay}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          {/* Waveform visualization */}
          <div
            className="flex-1 h-10 relative"
            onClick={(e) => {
              if (waveformCanvasRef.current) {
                const rect = waveformCanvasRef.current.getBoundingClientRect()
                const clickX = e.clientX - rect.left
                const percentage = clickX / rect.width
                const newTime = percentage * duration
                handleSeek([newTime])
              }
            }}
          >
            <canvas ref={waveformCanvasRef} className="w-full h-full cursor-pointer" />
          </div>

          {/* Volume control (only shown when not compact) */}
          {!compact && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full",
                  sender === "me"
                    ? "bg-white/20 hover:bg-white/30 text-white"
                    : "bg-gray-300 hover:bg-gray-400 text-gray-800",
                )}
                onClick={toggleMute}
                onMouseEnter={() => setShowVolumeControl(true)}
                onMouseLeave={() => setShowVolumeControl(false)}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>

              {showVolumeControl && (
                <div
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-white rounded-lg shadow-lg z-10 w-32"
                  onMouseEnter={() => setShowVolumeControl(true)}
                  onMouseLeave={() => setShowVolumeControl(false)}
                >
                  <Slider value={[volume * 100]} min={0} max={100} step={1} onValueChange={handleVolumeChange} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Time display */}
        <div className="flex justify-between text-xs">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  )
}
