"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Smile } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Common emoji reactions
const commonEmojis = ["👍", "❤️", "😂", "😮", "😢", "🔥", "👏", "🎉"]

interface Reaction {
  emoji: string
  users: {
    id: string | number
    name: string
    avatar?: string
  }[]
}

interface MessageReactionProps {
  reactions: Reaction[]
  onAddReaction: (emoji: string) => void
  onRemoveReaction: (emoji: string) => void
  currentUserId: string | number
  messageId: number | string
  variant?: "light" | "dark"
}

export function MessageReaction({
  reactions,
  onAddReaction,
  onRemoveReaction,
  currentUserId,
  messageId,
  variant = "light",
}: MessageReactionProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // Check if current user has reacted with a specific emoji
  const hasUserReacted = (emoji: string) => {
    const reaction = reactions.find((r) => r.emoji === emoji)
    return reaction?.users.some((user) => user.id === currentUserId) || false
  }

  // Get count of reactions for a specific emoji
  const getReactionCount = (emoji: string) => {
    const reaction = reactions.find((r) => r.emoji === emoji)
    return reaction?.users.length || 0
  }

  // Handle emoji click
  const handleEmojiClick = (emoji: string) => {
    if (hasUserReacted(emoji)) {
      onRemoveReaction(emoji)
    } else {
      onAddReaction(emoji)
    }
    setShowEmojiPicker(false)
  }

  const textColor = variant === "light" ? "text-gray-700" : "text-white"
  const bgColor = variant === "light" ? "bg-gray-100 hover:bg-gray-200" : "bg-gray-700 hover:bg-gray-600"
  const activeBgColor = variant === "light" ? "bg-blue-100" : "bg-blue-800"

  return (
    <div className="flex items-center gap-1 mt-1">
      {reactions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {reactions.map((reaction) => (
            <TooltipProvider key={reaction.emoji}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 px-1.5 rounded-full ${
                      hasUserReacted(reaction.emoji) ? activeBgColor : bgColor
                    } ${textColor}`}
                    onClick={() => handleEmojiClick(reaction.emoji)}
                  >
                    <span className="mr-1">{reaction.emoji}</span>
                    <span className="text-xs">{reaction.users.length}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="p-2">
                  <div className="text-sm font-medium mb-1">
                    {reaction.emoji} {reaction.users.length}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {reaction.users.map((user) => (
                      <div key={user.id} className="flex items-center gap-1.5">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={user.avatar || "/placeholder.svg?height=20&width=20"} alt={user.name} />
                          <AvatarFallback className="text-[10px]">{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{user.name}</span>
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      )}

      <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${bgColor} ${textColor}`}
          >
            <Smile className="h-3.5 w-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="grid grid-cols-4 gap-1">
            {commonEmojis.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-lg"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
