"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Send,
  Paperclip,
  Phone,
  Video,
  Mic,
  Check,
  CheckCheck,
  X,
  Smile,
  MoreVertical,
  Search,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSubscriptionStore } from "@/lib/subscription-store"
import { SubscriptionGate } from "@/components/subscription-gate"
import { MessageLimitAlert } from "@/components/message-limit-alert"
import { useCall } from "@/components/call-provider"
import { MediaMessage } from "@/components/media-message"
import { VoiceChat } from "@/components/voice-chat"
import { MessageReaction } from "@/components/message-reaction"
import { MessageSearch } from "@/components/message-search"
import { useToast } from "@/components/ui/use-toast"
import ErrorBoundary from "@/components/error-boundary"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ImageUploader } from "@/components/image-uploader"
import { EmojiPicker } from "@/components/emoji-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Updated mock user data with real images
const mockUsers = {
  "1": {
    id: 1,
    name: "Jessica",
    age: 28,
    online: true,
    lastActive: "Just now",
    avatar: "/images/profile1.png",
  },
  "2": {
    id: 2,
    name: "Olivia",
    age: 26,
    online: false,
    lastActive: "1 hour ago",
    avatar: "/images/profile2.png",
  },
  "3": {
    id: 3,
    name: "Zara",
    age: 24,
    online: true,
    lastActive: "Just now",
    avatar: "/images/profile3.png",
  },
  "101": {
    id: 101,
    name: "Jessica",
    age: 28,
    online: true,
    lastActive: "Just now",
    avatar: "/images/profile1.png",
  },
  "102": {
    id: 102,
    name: "Olivia",
    age: 26,
    online: false,
    lastActive: "1 hour ago",
    avatar: "/images/profile2.png",
  },
  "103": {
    id: 103,
    name: "Zara",
    age: 24,
    online: true,
    lastActive: "Just now",
    avatar: "/images/profile3.png",
  },
}

// Mock data for the chat
const mockMessages = [
  {
    id: 1,
    sender: "them",
    text: "Hi there!",
    time: "10:30 AM",
    date: "2023-08-15",
    status: "read",
    type: "text",
    reactions: [
      {
        emoji: "👋",
        users: [{ id: "user_1", name: "You", avatar: "/placeholder.svg?height=32&width=32" }],
      },
    ],
  },
  {
    id: 2,
    sender: "me",
    text: "Hello! How are you?",
    time: "10:31 AM",
    date: "2023-08-15",
    status: "read",
    type: "text",
    reactions: [
      {
        emoji: "👍",
        users: [{ id: "user_2", name: "Jessica", avatar: "/placeholder.svg?height=32&width=32" }],
      },
    ],
  },
  {
    id: 3,
    sender: "them",
    text: "I'm good, thanks! I saw that we both like hiking.",
    time: "10:32 AM",
    date: "2023-08-15",
    status: "read",
    type: "text",
    reactions: [],
  },
  {
    id: 4,
    sender: "me",
    text: "Yes! I love hiking. What's your favorite trail?",
    time: "10:33 AM",
    date: "2023-08-15",
    status: "read",
    type: "text",
    reactions: [
      {
        emoji: "❤️",
        users: [{ id: "user_2", name: "Jessica", avatar: "/placeholder.svg?height=32&width=32" }],
      },
    ],
  },
  {
    id: 5,
    sender: "them",
    text: "I really enjoy the mountain trails near the lake. The views are amazing!",
    time: "10:35 AM",
    date: "2023-08-15",
    status: "read",
    type: "text",
    reactions: [],
  },
  {
    id: 6,
    sender: "them",
    type: "image",
    url: "/placeholder.svg?height=400&width=300",
    time: "10:36 AM",
    date: "2023-08-15",
    status: "read",
    reactions: [
      {
        emoji: "😍",
        users: [{ id: "user_1", name: "You", avatar: "/placeholder.svg?height=32&width=32" }],
      },
    ],
  },
  {
    id: 7,
    sender: "me",
    text: "Wow, that looks beautiful! I'd love to check it out sometime.",
    time: "10:38 AM",
    date: "2023-08-15",
    status: "read",
    type: "text",
    reactions: [],
  },
  {
    id: 8,
    sender: "them",
    type: "audio",
    url: "placeholder-audio",
    time: "10:40 AM",
    date: "2023-08-15",
    status: "read",
    reactions: [],
  },
]

// Message Status Component
function MessageStatus({ status }: { status: string }) {
  if (status === "sent") {
    return <Check className="h-3 w-3 text-gray-400" />
  } else if (status === "delivered") {
    return <CheckCheck className="h-3 w-3 text-gray-400" />
  } else if (status === "read") {
    return <CheckCheck className="h-3 w-3 text-blue-500" />
  }
  return null
}

// Text Message Component
function TextMessage({
  message,
  sender,
  text,
  time,
  status,
  reactions,
  onAddReaction,
  onRemoveReaction,
  currentUserId,
  isHighlighted,
  searchTerm,
}: {
  message: any
  sender: "me" | "them"
  text: string
  time: string
  status?: string
  reactions: any[]
  onAddReaction: (messageId: number | string, emoji: string) => void
  onRemoveReaction: (messageId: number | string, emoji: string) => void
  currentUserId: string | number
  isHighlighted?: boolean
  searchTerm?: string
}) {
  // Highlight search term in message text
  const highlightText = (text: string, searchTerm?: string) => {
    if (!searchTerm) return text

    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"))
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <span key={i} className="bg-yellow-200 text-black px-0.5 rounded">
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </>
    )
  }

  return (
    <div
      className={`group max-w-[85%] sm:max-w-[75%] md:max-w-[70%] rounded-lg p-3 ${isHighlighted ? "ring-2 ring-yellow-400" : ""} ${
        sender === "me" ? "bg-rose-500 text-white rounded-tr-none" : "bg-gray-200 text-gray-800 rounded-tl-none"
      }`}
    >
      <p className="break-words whitespace-pre-wrap">{highlightText(text, searchTerm)}</p>
      <div className="flex items-center justify-end gap-1 mt-1">
        <span className={`text-xs ${sender === "me" ? "text-rose-100" : "text-gray-500"}`}>{time}</span>
        {sender === "me" && status && <MessageStatus status={status} />}
      </div>

      <MessageReaction
        reactions={reactions}
        onAddReaction={(emoji) => onAddReaction(message.id, emoji)}
        onRemoveReaction={(emoji) => onRemoveReaction(message.id, emoji)}
        currentUserId={currentUserId}
        messageId={message.id}
        variant={sender === "me" ? "dark" : "light"}
      />
    </div>
  )
}

function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const userId = params.id as string
  const user = mockUsers[userId] || mockUsers["1"] // Default to first user if not found

  // Use a try/catch to handle the case when the call context isn't available
  const callFunctions = useCall()
  const { startCall } = callFunctions

  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [showVoiceChat, setShowVoiceChat] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showMediaOptions, setShowMediaOptions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSearch, setShowSearch] = useState(false)
  const [highlightedMessageId, setHighlightedMessageId] = useState<number | string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showImageUploader, setShowImageUploader] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageRefs = useRef<Record<string | number, HTMLDivElement | null>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Current user ID (in a real app, this would come from auth)
  const currentUserId = "user_1"

  useEffect(() => {
    if (!highlightedMessageId) {
      scrollToBottom()
    } else {
      scrollToMessage(highlightedMessageId)
    }
  }, [messages, highlightedMessageId])

  // Simulate message status updates
  useEffect(() => {
    // Find the most recent message from "me" with status "sent"
    const sentMessage = [...messages].reverse().find((msg) => msg.sender === "me" && msg.status === "sent")

    if (sentMessage) {
      // Update to "delivered" after 2 seconds
      const deliveredTimeout = setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.id === sentMessage.id ? { ...msg, status: "delivered" } : msg)))

        // Update to "read" after another 3 seconds
        const readTimeout = setTimeout(() => {
          setMessages((prev) => prev.map((msg) => (msg.id === sentMessage.id ? { ...msg, status: "read" } : msg)))
        }, 3000)

        return () => clearTimeout(readTimeout)
      }, 2000)

      return () => clearTimeout(deliveredTimeout)
    }
  }, [messages])

  // Handle recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        setRecordingTime(0)
      }
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }
  }, [isRecording])

  // Clear highlighted message after a delay
  useEffect(() => {
    if (highlightedMessageId) {
      const timer = setTimeout(() => {
        setHighlightedMessageId(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [highlightedMessageId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToMessage = (messageId: number | string) => {
    const messageElement = messageRefs.current[messageId]
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === "") return

    try {
      setIsLoading(true)

      // Check if user can send a message
      const canSend = useSubscriptionStore.getState().incrementMessageCount()
      if (!canSend) {
        // Don't send the message if limit reached
        setIsLoading(false)
        return
      }

      const now = new Date()
      const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      const date = now.toISOString().split("T")[0]

      const newMsg = {
        id: Date.now(),
        sender: "me",
        text: newMessage,
        time,
        date,
        status: "sent",
        type: "text",
        reactions: [],
      }

      setMessages([...messages, newMsg])
      setNewMessage("")
      setIsLoading(false)
    } catch (err) {
      console.error("Error sending message:", err)
      setError("Failed to send message. Please try again.")
      setIsLoading(false)
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji)
  }

  const handleStartCall = (type: "audio" | "video") => {
    try {
      // Check if user can make this type of call
      if (type === "audio" && !useSubscriptionStore.getState().canUseFeature("audioCalls")) {
        return
      }

      if (type === "video" && !useSubscriptionStore.getState().canUseFeature("videoCalls")) {
        return
      }

      if (startCall) {
        startCall({
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          type,
        })
      }
    } catch (err) {
      console.error("Error starting call:", err)
      setError("Failed to start call. Please try again.")
    }
  }

  const handleStartVoiceChat = () => {
    try {
      // Check if user can make audio calls
      if (!useSubscriptionStore.getState().canUseFeature("audioCalls")) {
        toast({
          title: "Feature not available",
          description: "Voice chat requires a Premium or Gold subscription",
          variant: "destructive",
        })
        return
      }

      setShowVoiceChat(true)
    } catch (err) {
      console.error("Error starting voice chat:", err)
      setError("Failed to start voice chat. Please try again.")
    }
  }

  const handleFileUpload = (file: File, type: "image" | "video" | "audio" | "file") => {
    try {
      // Check if user can send a message
      const canSend = useSubscriptionStore.getState().incrementMessageCount()
      if (!canSend) {
        // Don't send the message if limit reached
        return
      }

      const now = new Date()
      const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      const date = now.toISOString().split("T")[0]

      // In a real app, you would upload the file to a server and get a URL
      // For this demo, we'll use appropriate placeholders based on file type
      let fileUrl
      if (type === "image") {
        fileUrl = "/placeholder.svg?height=400&width=300"
      } else if (type === "video") {
        // Use a placeholder that won't trigger loading errors
        fileUrl = "placeholder-video"
      } else if (type === "audio") {
        // Use a placeholder that won't trigger loading errors
        fileUrl = "placeholder-audio"
      } else {
        fileUrl = "placeholder-file"
      }

      const newMsg = {
        id: Date.now(),
        sender: "me",
        time,
        date,
        status: "sent",
        type,
        url: fileUrl,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        reactions: [],
      }

      setMessages([...messages, newMsg])
      toast({
        title: "File sent",
        description: `Your ${type} has been sent successfully`,
      })
    } catch (err) {
      console.error("Error uploading file:", err)
      setError("Failed to upload file. Please try again.")
    }
  }

  const handleImageSelect = (file: File, previewUrl: string) => {
    try {
      // Check if user can send a message
      const canSend = useSubscriptionStore.getState().incrementMessageCount()
      if (!canSend) {
        // Don't send the message if limit reached
        return
      }

      const now = new Date()
      const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      const date = now.toISOString().split("T")[0]

      // In a real app, you would upload the file to a server and get a URL
      // For this demo, we'll use the preview URL directly
      const newMsg = {
        id: Date.now(),
        sender: "me",
        time,
        date,
        status: "sent",
        type: "image",
        url: previewUrl,
        reactions: [],
      }

      setMessages([...messages, newMsg])
      setShowImageUploader(false)

      toast({
        title: "Image sent",
        description: "Your image has been sent successfully",
      })
    } catch (err) {
      console.error("Error sending image:", err)
      setError("Failed to send image. Please try again.")
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB"
    else return (bytes / 1073741824).toFixed(1) + " GB"
  }

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartRecording = () => {
    try {
      // Check if user can send audio
      if (!useSubscriptionStore.getState().canUseFeature("audioCalls")) {
        toast({
          title: "Feature not available",
          description: "Voice messages require a Premium or Gold subscription",
          variant: "destructive",
        })
        return
      }

      setIsRecording(true)
      toast({
        title: "Recording started",
        description: "Tap the microphone again to stop and send",
      })
    } catch (err) {
      console.error("Error starting recording:", err)
      setError("Failed to start recording. Please try again.")
    }
  }

  const handleStopRecording = () => {
    try {
      setIsRecording(false)

      // In a real app, you would process the recording and send it
      // For this demo, we'll simulate sending an audio message
      const now = new Date()
      const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      const date = now.toISOString().split("T")[0]

      const newMsg = {
        id: Date.now(),
        sender: "me",
        time,
        date,
        status: "sent",
        type: "audio",
        url: "placeholder-audio",
        reactions: [],
      }

      setMessages([...messages, newMsg])
      toast({
        title: "Voice message sent",
        description: `Your voice message (${formatRecordingTime(recordingTime)}) has been sent`,
      })
    } catch (err) {
      console.error("Error stopping recording:", err)
      setError("Failed to send voice message. Please try again.")
    }
  }

  const handleAddReaction = (messageId: number | string, emoji: string) => {
    try {
      setMessages((prevMessages) =>
        prevMessages.map((message) => {
          if (message.id !== messageId) return message

          // Check if this emoji reaction already exists
          const existingReactionIndex = message.reactions.findIndex((r) => r.emoji === emoji)

          if (existingReactionIndex >= 0) {
            // Add current user to existing reaction
            const existingReaction = message.reactions[existingReactionIndex]

            // Check if user already reacted with this emoji
            const userAlreadyReacted = existingReaction.users.some((u) => u.id === currentUserId)

            if (userAlreadyReacted) return message

            // Add user to existing reaction
            const updatedReactions = [...message.reactions]
            updatedReactions[existingReactionIndex] = {
              ...existingReaction,
              users: [
                ...existingReaction.users,
                { id: currentUserId, name: "You", avatar: "/placeholder.svg?height=32&width=32" },
              ],
            }

            return { ...message, reactions: updatedReactions }
          } else {
            // Create new reaction
            return {
              ...message,
              reactions: [
                ...message.reactions,
                {
                  emoji,
                  users: [{ id: currentUserId, name: "You", avatar: "/placeholder.svg?height=32&width=32" }],
                },
              ],
            }
          }
        }),
      )

      toast({
        title: "Reaction added",
        description: `You reacted with ${emoji}`,
      })
    } catch (err) {
      console.error("Error adding reaction:", err)
      setError("Failed to add reaction. Please try again.")
    }
  }

  const handleRemoveReaction = (messageId: number | string, emoji: string) => {
    try {
      setMessages((prevMessages) =>
        prevMessages.map((message) => {
          if (message.id !== messageId) return message

          // Find the reaction
          const reactionIndex = message.reactions.findIndex((r) => r.emoji === emoji)
          if (reactionIndex === -1) return message

          const reaction = message.reactions[reactionIndex]

          // Remove current user from the reaction
          const updatedUsers = reaction.users.filter((u) => u.id !== currentUserId)

          if (updatedUsers.length === 0) {
            // If no users left, remove the reaction entirely
            return {
              ...message,
              reactions: message.reactions.filter((_, i) => i !== reactionIndex),
            }
          } else {
            // Otherwise update the users list
            const updatedReactions = [...message.reactions]
            updatedReactions[reactionIndex] = {
              ...reaction,
              users: updatedUsers,
            }

            return { ...message, reactions: updatedReactions }
          }
        }),
      )

      toast({
        title: "Reaction removed",
        description: `You removed your ${emoji} reaction`,
      })
    } catch (err) {
      console.error("Error removing reaction:", err)
      setError("Failed to remove reaction. Please try again.")
    }
  }

  // Group messages by date
  const groupedMessages = messages.reduce(
    (groups, message) => {
      const date = message.date
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
      return groups
    },
    {} as Record<string, typeof messages>,
  )

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="mr-1 sm:mr-2">
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <Avatar>
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="max-w-[120px] sm:max-w-[150px] md:max-w-none">
              <h1 className="text-base sm:text-lg font-semibold truncate">
                {user.name}, {user.age}
              </h1>
              <p className="text-xs text-gray-500">
                {user.online ? (
                  <span className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                    Online
                  </span>
                ) : (
                  `Last active ${user.lastActive}`
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(true)}
              className="text-gray-500 hover:text-gray-700 h-8 w-8 sm:h-9 sm:w-9"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            <SubscriptionGate feature="audioCalls">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleStartCall("audio")}
                className="h-8 w-8 sm:h-9 sm:w-9"
              >
                <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </SubscriptionGate>

            <SubscriptionGate feature="videoCalls">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleStartCall("video")}
                className="h-8 w-8 sm:h-9 sm:w-9"
              >
                <Video className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </SubscriptionGate>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                  <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleStartVoiceChat}>Start voice chat</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/profile/${user.id}`)}>View profile</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Block user</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Search bar */}
      {showSearch && (
        <MessageSearch
          messages={messages}
          onHighlightMessage={(messageId) => {
            setHighlightedMessageId(messageId)
            setSearchTerm("")
          }}
          onClose={() => {
            setShowSearch(false)
            setHighlightedMessageId(null)
          }}
        />
      )}

      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-2 sm:p-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
              <span>{error}</span>
              <Button variant="ghost" size="sm" onClick={() => setError(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="mb-6">
              <div className="flex justify-center mb-4">
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                  {new Date(date).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                </span>
              </div>
              <div className="space-y-4">
                {dateMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                    ref={(el) => (messageRefs.current[message.id] = el)}
                  >
                    {message.sender === "them" && (
                      <Avatar className="h-8 w-8 mr-2 self-end mb-1 flex-shrink-0">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                    )}

                    <ErrorBoundary>
                      {message.type === "text" ? (
                        <TextMessage
                          message={message}
                          sender={message.sender}
                          text={message.text}
                          time={message.time}
                          status={message.status}
                          reactions={message.reactions || []}
                          onAddReaction={handleAddReaction}
                          onRemoveReaction={handleRemoveReaction}
                          currentUserId={currentUserId}
                          isHighlighted={highlightedMessageId === message.id}
                          searchTerm={highlightedMessageId === message.id ? searchTerm : undefined}
                        />
                      ) : (
                        <div className="group max-w-[85%] sm:max-w-[75%] md:max-w-[70%]">
                          <MediaMessage
                            type={message.type}
                            url={message.url}
                            fileName={message.fileName}
                            fileSize={message.fileSize}
                            sender={message.sender}
                            time={message.time}
                            status={message.status}
                          />
                          {message.reactions && message.reactions.length > 0 && (
                            <MessageReaction
                              reactions={message.reactions}
                              onAddReaction={(emoji) => handleAddReaction(message.id, emoji)}
                              onRemoveReaction={(emoji) => handleRemoveReaction(message.id, emoji)}
                              currentUserId={currentUserId}
                              messageId={message.id}
                              variant={message.sender === "me" ? "dark" : "light"}
                            />
                          )}
                        </div>
                      )}
                    </ErrorBoundary>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </main>

      {/* Message limit alert */}
      <MessageLimitAlert />

      {/* Recording indicator */}
      {isRecording && (
        <div className="bg-rose-500 text-white p-2 flex items-center justify-between">
          <div className="flex items-center">
            <div className="animate-pulse h-3 w-3 bg-white rounded-full mr-2"></div>
            <span>Recording... {formatRecordingTime(recordingTime)}</span>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-rose-600" onClick={handleStopRecording}>
            Send
          </Button>
        </div>
      )}

      <footer className="bg-white border-t border-gray-200 p-2 sm:p-4">
        <form onSubmit={sendMessage} className="flex items-center gap-1 sm:gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="application/pdf,application/msword,application/vnd.ms-excel,text/plain"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0], "file")
                e.target.value = ""
              }
            }}
          />

          <input
            type="file"
            ref={imageInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0], "image")
                e.target.value = ""
              }
            }}
          />

          <input
            type="file"
            ref={videoInputRef}
            className="hidden"
            accept="video/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0], "video")
                e.target.value = ""
              }
            }}
          />

          <input
            type="file"
            ref={audioInputRef}
            className="hidden"
            accept="audio/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0], "audio")
                e.target.value = ""
              }
            }}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowMediaOptions(!showMediaOptions)}
            className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 relative"
          >
            <Paperclip className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
            {showMediaOptions && (
              <div className="absolute bottom-full left-0 mb-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 justify-start"
                  onClick={() => {
                    setShowMediaOptions(false)
                    setShowImageUploader(true)
                  }}
                >
                  <ImageIcon className="h-4 w-4" />
                  <span>Upload Image</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 justify-start"
                  onClick={() => {
                    imageInputRef.current?.click()
                    setShowMediaOptions(false)
                  }}
                >
                  <ImageIcon className="h-4 w-4" />
                  <span>Gallery</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 justify-start"
                  onClick={() => {
                    videoInputRef.current?.click()
                    setShowMediaOptions(false)
                  }}
                >
                  <Video className="h-4 w-4" />
                  <span>Video</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 justify-start"
                  onClick={() => {
                    audioInputRef.current?.click()
                    setShowMediaOptions(false)
                  }}
                >
                  <Mic className="h-4 w-4" />
                  <span>Audio</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 justify-start"
                  onClick={() => {
                    fileInputRef.current?.click()
                    setShowMediaOptions(false)
                  }}
                >
                  <Paperclip className="h-4 w-4" />
                  <span>File</span>
                </Button>
              </div>
            )}
          </Button>

          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                <Smile className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" side="top">
              <EmojiPicker onEmojiSelect={handleEmojiSelect} />
            </PopoverContent>
          </Popover>

          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 h-10"
            disabled={isLoading || isRecording}
          />

          {newMessage.trim() ? (
            <Button
              type="submit"
              size="icon"
              className="bg-rose-500 hover:bg-rose-600 h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
          ) : (
            <Button
              type="button"
              size="icon"
              className={`${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-rose-500 hover:bg-rose-600"} h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0`}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
            >
              <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          )}
        </form>
      </footer>

      {/* Voice Chat Dialog */}
      {showVoiceChat && <VoiceChat user={user} onClose={() => setShowVoiceChat(false)} />}

      {/* Image Uploader Modal */}
      {showImageUploader && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Send Image</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowImageUploader(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <ImageUploader
              onImageSelect={handleImageSelect}
              onCancel={() => setShowImageUploader(false)}
              buttonText="Select an image to send"
              maxSizeMB={10}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default function ChatPageWrapper() {
  const { canUseFeature } = useSubscriptionStore()

  // Check if user can open messages
  const canOpenMessages = canUseFeature("messageOpening")

  // If user can't open messages, show the subscription gate
  if (!canOpenMessages) {
    return (
      <SubscriptionGate feature="messageOpening">
        <ChatPage />
      </SubscriptionGate>
    )
  }

  // Otherwise, show the chat page
  return (
    <ErrorBoundary>
      <ChatPage />
    </ErrorBoundary>
  )
}
