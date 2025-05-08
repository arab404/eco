"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff, PhoneOff, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

interface VoiceChatProps {
  user: {
    id: number | string
    name: string
    avatar: string
  }
  onClose: () => void
}

export function VoiceChat({ user, onClose }: VoiceChatProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isConnecting, setIsConnecting] = useState(true)
  const { toast } = useToast()
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Simulate connection
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnecting(false)
      setIsConnected(true)
      toast({
        title: "Voice chat connected",
        description: `You are now in a voice chat with ${user.name}`,
      })
    }, 2000)

    return () => clearTimeout(timer)
  }, [user.name, toast])

  // Call duration timer
  useEffect(() => {
    if (isConnected) {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isConnected])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleEndCall = () => {
    setIsConnected(false)
    toast({
      title: "Voice chat ended",
      description: `Call with ${user.name} has ended`,
    })
    onClose()
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    toast({
      title: isMuted ? "Microphone unmuted" : "Microphone muted",
      description: isMuted ? "Others can now hear you" : "Others cannot hear you",
    })
  }

  const toggleSpeaker = () => {
    setIsSpeakerMuted(!isSpeakerMuted)
    toast({
      title: isSpeakerMuted ? "Speaker unmuted" : "Speaker muted",
      description: isSpeakerMuted ? "You can now hear others" : "You cannot hear others",
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user.avatar || "/placeholder.svg?height=96&width=96"} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div
              className={`absolute bottom-4 right-0 h-4 w-4 rounded-full border-2 border-white ${isConnected ? "bg-green-500" : "bg-yellow-500"}`}
            ></div>
          </div>
          <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
          <p className="text-gray-500 mb-4">
            {isConnecting ? "Connecting..." : isConnected ? formatDuration(callDuration) : "Call ended"}
          </p>

          {isConnected && (
            <div className="w-full mb-6">
              <div className="flex items-center justify-between mb-2">
                <Volume2 className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">{volume}%</span>
              </div>
              <Slider
                value={[volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => setVolume(value[0])}
                disabled={isSpeakerMuted}
              />
            </div>
          )}

          <div className="flex justify-center gap-4">
            {isConnected && (
              <>
                <Button
                  variant={isMuted ? "destructive" : "outline"}
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={toggleMute}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <Button
                  variant={isSpeakerMuted ? "destructive" : "outline"}
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={toggleSpeaker}
                >
                  {isSpeakerMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
              </>
            )}
            <Button variant="destructive" size="icon" className="h-12 w-12 rounded-full" onClick={handleEndCall}>
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>

          {isConnecting && (
            <div className="mt-6 flex items-center justify-center">
              <div className="animate-pulse flex space-x-2">
                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
