"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useCallStore } from "@/lib/call-store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react"

interface CallContextType {
  startCall: (call: { id: number | string; name: string; avatar: string; type: "audio" | "video" }) => void
  incomingCall: any
  outgoingCall: any
  activeCall: any
  acceptCall: () => void
  rejectCall: () => void
  endCall: () => void
  toggleMute: () => void
  toggleVideo: () => void
}

const CallContext = createContext<CallContextType | null>(null)

export function useCall(): CallContextType {
  const context = useContext(CallContext)
  if (!context) {
    throw new Error("useCall must be used within a CallProvider")
  }
  return context
}

export function CallProvider({ children }) {
  const callStore = useCallStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <CallContext.Provider value={callStore}>
      {children}
      {callStore.incomingCall && <IncomingCallDialog />}
      {callStore.outgoingCall && <OutgoingCallDialog />}
      {callStore.activeCall && <ActiveCallDialog />}
    </CallContext.Provider>
  )
}

function IncomingCallDialog() {
  const { incomingCall, acceptCall, rejectCall } = useCallStore()

  return (
    <Dialog open={!!incomingCall} onOpenChange={(open) => !open && rejectCall()}>
      <DialogContent className="sm:max-w-md" showX={false}>
        <DialogHeader className="flex items-center flex-col">
          <div className="h-24 w-24 rounded-full bg-rose-100 flex items-center justify-center mb-4">
            <img
              src={incomingCall?.avatar || "/placeholder.svg?height=96&width=96"}
              alt={incomingCall?.name}
              className="h-24 w-24 rounded-full object-cover"
            />
          </div>
          <DialogTitle className="text-xl">{incomingCall?.name || "Unknown"}</DialogTitle>
        </DialogHeader>

        <div className="text-center">
          <h3 className="text-lg font-medium">Incoming {incomingCall?.type || "call"}</h3>
          <p className="text-sm text-gray-500">from Ecohub</p>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <Button variant="destructive" size="icon" className="h-14 w-14 rounded-full" onClick={() => rejectCall()}>
            <PhoneOff className="h-6 w-6" />
          </Button>
          <Button
            variant="default"
            size="icon"
            className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600"
            onClick={() => acceptCall()}
          >
            <Phone className="h-6 w-6" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function OutgoingCallDialog() {
  const { outgoingCall, endCall } = useCallStore()

  return (
    <Dialog open={!!outgoingCall} onOpenChange={(open) => !open && endCall()}>
      <DialogContent className="sm:max-w-md" showX={false}>
        <DialogHeader className="flex items-center flex-col">
          <div className="h-24 w-24 rounded-full bg-rose-100 flex items-center justify-center mb-4">
            <img
              src={outgoingCall?.avatar || "/placeholder.svg?height=96&width=96"}
              alt={outgoingCall?.name}
              className="h-24 w-24 rounded-full object-cover"
            />
          </div>
          <DialogTitle className="text-xl">{outgoingCall?.name || "Unknown"}</DialogTitle>
        </DialogHeader>

        <div className="text-center">
          <h3 className="text-lg font-medium">Calling...</h3>
          <p className="text-sm text-gray-500">via Ecohub</p>
        </div>

        <div className="flex justify-center mt-4">
          <Button variant="destructive" size="icon" className="h-14 w-14 rounded-full" onClick={() => endCall()}>
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ActiveCallDialog() {
  const { activeCall, endCall, toggleMute, toggleVideo } = useCallStore()
  const [callDuration, setCallDuration] = useState(0)

  useEffect(() => {
    if (!activeCall) return

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)

    return () => {
      clearInterval(interval)
      setCallDuration(0)
    }
  }, [activeCall])

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (!activeCall) return null

  return (
    <Dialog open={!!activeCall} onOpenChange={(open) => !open && endCall()}>
      <DialogContent className="sm:max-w-md h-[80vh] max-h-[600px] flex flex-col p-0 overflow-hidden" showX={false}>
        <div className="flex-1 bg-gray-900 relative flex items-center justify-center">
          {activeCall.type === "video" ? (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <img
                src={activeCall?.avatar || "/placeholder.svg?height=300&width=300"}
                alt={activeCall?.name}
                className="max-h-full max-w-full object-cover"
              />
              <div className="absolute bottom-4 right-4 h-36 w-24 bg-gray-700 rounded-lg overflow-hidden border-2 border-white">
                <img src="/placeholder.svg?height=144&width=96" alt="You" className="h-full w-full object-cover" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="h-32 w-32 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                <img
                  src={activeCall?.avatar || "/placeholder.svg?height=128&width=128"}
                  alt={activeCall?.name}
                  className="h-32 w-32 rounded-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-white">{activeCall?.name}</h2>
              <p className="text-gray-300">{formatDuration(callDuration)}</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-white">
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className={`h-12 w-12 rounded-full ${activeCall.muted ? "bg-rose-100 text-rose-500" : ""}`}
              onClick={() => toggleMute()}
            >
              {activeCall.muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            <Button variant="destructive" size="icon" className="h-12 w-12 rounded-full" onClick={() => endCall()}>
              <PhoneOff className="h-5 w-5" />
            </Button>

            {activeCall.type === "video" && (
              <Button
                variant="outline"
                size="icon"
                className={`h-12 w-12 rounded-full ${activeCall.videoOff ? "bg-rose-100 text-rose-500" : ""}`}
                onClick={() => toggleVideo()}
              >
                {activeCall.videoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
