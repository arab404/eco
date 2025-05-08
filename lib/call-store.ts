"use client"

import { create } from "zustand"

// Update the CallState interface
interface CallState {
  incomingCall: {
    id: number | string
    name: string
    avatar: string
    type: "audio" | "video"
  } | null
  outgoingCall: {
    id: number | string
    name: string
    avatar: string
    type: "audio" | "video"
  } | null
  activeCall: {
    id: number | string
    name: string
    avatar: string
    type: "audio" | "video"
    muted: boolean
    videoOff: boolean
  } | null
  setIncomingCall: (call: CallState["incomingCall"]) => void
  setOutgoingCall: (call: CallState["outgoingCall"]) => void
  setActiveCall: (call: CallState["activeCall"]) => void
  endCall: () => void
  acceptCall: () => void
  rejectCall: () => void
  startCall: (call: Omit<NonNullable<CallState["outgoingCall"]>, "null">) => void
  toggleMute: () => void
  toggleVideo: () => void
}

export const useCallStore = create<CallState>((set) => ({
  incomingCall: null,
  outgoingCall: null,
  activeCall: null,
  setIncomingCall: (call) => set({ incomingCall: call }),
  setOutgoingCall: (call) => set({ outgoingCall: call }),
  setActiveCall: (call) => set({ activeCall: call }),
  endCall: () =>
    set({
      incomingCall: null,
      outgoingCall: null,
      activeCall: null,
    }),
  acceptCall: () =>
    set((state) => {
      if (!state.incomingCall) return {}
      return {
        activeCall: {
          ...state.incomingCall,
          muted: false,
          videoOff: false,
        },
        incomingCall: null,
      }
    }),
  rejectCall: () => set({ incomingCall: null }),
  startCall: (call) => {
    set({ outgoingCall: call })

    // Simulate incoming call after 3 seconds
    setTimeout(() => {
      set((state) => {
        if (state.outgoingCall?.id !== call.id) return {}

        return {
          incomingCall: {
            ...state.outgoingCall,
            type: call.type,
          },
          outgoingCall: null,
        }
      })
    }, 3000)
  },
  toggleMute: () =>
    set((state) => {
      if (!state.activeCall) return {}
      return {
        activeCall: {
          ...state.activeCall,
          muted: !state.activeCall.muted,
        },
      }
    }),
  toggleVideo: () =>
    set((state) => {
      if (!state.activeCall || state.activeCall.type !== "video") return {}
      return {
        activeCall: {
          ...state.activeCall,
          videoOff: !state.activeCall.videoOff,
        },
      }
    }),
}))
