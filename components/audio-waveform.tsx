"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface AudioWaveformProps {
  url: string
  isPlaying: boolean
  onPlayPause: () => void
  currentTime: number
  duration: number
  onSeek: (value: number[]) => void
  sender: "me" | "them"
  time: string
  status?: string
}

export function AudioWaveform({
  url,
  isPlaying,
  onPlayPause,
  currentTime,
  duration,
  onSeek,
  sender,
  time,
  status,
}: AudioWaveformProps) {
  const { toast } = useToast()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [waveformData, setWaveformData] = useState<number[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const animationRef = useRef<number>()

  // Generate random waveform data for demo purposes
  // In a real app, this would be generated from the actual audio file
  useEffect(() => {
    // Generate random waveform data (40 points)
    const generateRandomWaveform = () => {
      const data: number[] = []
      // Create a more natural looking waveform with some patterns
      for (let i = 0; i < 40; i++) {
        // Create a pattern with higher amplitudes in the middle
        const position = i / 40
        const baseLine = Math.sin(position * Math.PI) * 0.5 + 0.3
        // Add some randomness
        const randomFactor = Math.random() * 0.4
        data.push(baseLine + randomFactor)
      }
      return data
    }

    setWaveformData(generateRandomWaveform())
    setIsLoaded(true)
  }, [url])

  // Draw the waveform
  useEffect(() => {
    if (!canvasRef.current || waveformData.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const drawWaveform = () => {
      if (!canvas || !ctx) return

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const barWidth = canvas.width / waveformData.length
      const barGap = 2
      const barWidthWithGap = barWidth - barGap

      // Calculate the playback progress
      const progress = duration > 0 ? currentTime / duration : 0

      // Determine colors based on sender
      const playedColor = sender === "me" ? "rgba(255, 255, 255, 0.8)" : "rgba(244, 63, 94, 0.8)"
      const unplayedColor = sender === "me" ? "rgba(255, 255, 255, 0.4)" : "rgba(107, 114, 128, 0.4)"

      // Draw each bar
      waveformData.forEach((amplitude, index) => {
        const x = index * barWidth
        const barHeight = amplitude * (canvas.height * 0.7) // 70% of canvas height max

        // Determine if this bar has been played
        const isPlayed = index / waveformData.length < progress

        // Set the color based on playback progress
        ctx.fillStyle = isPlayed ? playedColor : unplayedColor

        // Draw the bar
        const y = (canvas.height - barHeight) / 2
        ctx.fillRect(x, y, barWidthWithGap, barHeight)
      })
    }

    // Initial draw
    drawWaveform()

    // Animate the waveform when playing
    if (isPlaying) {
      const animate = () => {
        drawWaveform()
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [waveformData, isPlaying, currentTime, duration, sender])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handlePlayPause = () => {
    // Check if it's a placeholder URL
    if (url.includes("placeholder") || url.startsWith("#")) {
      toast({
        title: "Demo mode",
        description: "This is a placeholder. In a real app, actual audio would play.",
        variant: "default",
      })
      return
    }

    onPlayPause()
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2">
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full h-8 w-8 ${
            sender === "me" ? "text-white hover:bg-rose-600" : "text-gray-800 hover:bg-gray-300"
          }`}
          onClick={handlePlayPause}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        <div className="flex-1 h-12 relative">
          {isLoaded ? (
            <canvas ref={canvasRef} className="w-full h-full" width={300} height={48} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <div
            className="absolute inset-0"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = e.clientX - rect.left
              const percentage = x / rect.width
              onSeek([percentage * (duration || 100)])
            }}
          ></div>
        </div>

        <span className="text-xs whitespace-nowrap">
          {formatTime(currentTime)}/{formatTime(duration)}
        </span>
      </div>

      <div className="flex items-center justify-end gap-1">
        <span className={`text-xs ${sender === "me" ? "text-rose-100" : "text-gray-500"}`}>{time}</span>
        {sender === "me" && status && <span className="text-xs text-rose-100">{status}</span>}
      </div>
    </div>
  )
}
