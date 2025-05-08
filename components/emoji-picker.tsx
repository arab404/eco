"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

// Common emoji categories
const emojiCategories = [
  {
    id: "recent",
    name: "Recent",
    icon: "🕒",
    emojis: ["😊", "❤️", "👍", "😂", "🎉", "🔥", "👋", "😍"],
  },
  {
    id: "smileys",
    name: "Smileys",
    icon: "😀",
    emojis: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "🤣",
      "😂",
      "🙂",
      "🙃",
      "😉",
      "😊",
      "😇",
      "🥰",
      "😍",
      "🤩",
      "😘",
      "😗",
      "😚",
      "😙",
      "😋",
      "😛",
      "😜",
      "🤪",
      "😝",
      "🤑",
      "🤗",
      "🤭",
      "🤫",
      "🤔",
      "🤐",
      "🤨",
      "😐",
      "😑",
      "😶",
      "😏",
      "😒",
      "🙄",
      "😬",
      "🤥",
    ],
  },
  {
    id: "people",
    name: "People",
    icon: "👋",
    emojis: [
      "👋",
      "🤚",
      "🖐️",
      "✋",
      "🖖",
      "👌",
      "🤌",
      "🤏",
      "✌️",
      "🤞",
      "🤟",
      "🤘",
      "🤙",
      "👈",
      "👉",
      "👆",
      "🖕",
      "👇",
      "👍",
      "👎",
      "✊",
      "👊",
      "🤛",
      "🤜",
      "👏",
      "🙌",
      "👐",
      "🤲",
      "🤝",
      "🙏",
    ],
  },
  {
    id: "nature",
    name: "Nature",
    icon: "🌿",
    emojis: [
      "🐶",
      "🐱",
      "🐭",
      "🐹",
      "🐰",
      "🦊",
      "🐻",
      "🐼",
      "🐨",
      "🐯",
      "🦁",
      "🐮",
      "🐷",
      "🐸",
      "🐵",
      "🐔",
      "🐧",
      "🐦",
      "🐤",
      "🦆",
      "🌵",
      "🌲",
      "🌳",
      "🌴",
      "🌱",
      "🌿",
      "☘️",
      "🍀",
      "🍁",
      "🍂",
    ],
  },
  {
    id: "food",
    name: "Food",
    icon: "🍔",
    emojis: [
      "🍏",
      "🍎",
      "🍐",
      "🍊",
      "🍋",
      "🍌",
      "🍉",
      "🍇",
      "🍓",
      "🫐",
      "🍈",
      "🍒",
      "🍑",
      "🥭",
      "🍍",
      "🥥",
      "🥝",
      "🍅",
      "🍆",
      "🥑",
      "🍔",
      "🍟",
      "🍕",
      "🌭",
      "🍿",
      "🧂",
      "🥓",
      "🥚",
      "🍳",
      "🧇",
    ],
  },
  {
    id: "activities",
    name: "Activities",
    icon: "⚽",
    emojis: [
      "⚽",
      "🏀",
      "🏈",
      "⚾",
      "🥎",
      "🎾",
      "🏐",
      "🏉",
      "🥏",
      "🎱",
      "🪀",
      "🏓",
      "🏸",
      "🏒",
      "🏑",
      "🥍",
      "🏏",
      "🪃",
      "🥅",
      "⛳",
      "🎮",
      "🎯",
      "🎲",
      "🎭",
      "🎨",
      "🎬",
      "🎤",
      "🎧",
      "🎼",
      "🎹",
    ],
  },
  {
    id: "travel",
    name: "Travel",
    icon: "🚗",
    emojis: [
      "🚗",
      "🚕",
      "🚙",
      "🚌",
      "🚎",
      "🏎️",
      "🚓",
      "🚑",
      "🚒",
      "🚐",
      "✈️",
      "🛫",
      "🛬",
      "🛩️",
      "🚁",
      "🛸",
      "🚀",
      "🛶",
      "⛵",
      "🚤",
      "🏖️",
      "🏝️",
      "🏜️",
      "🌋",
      "⛰️",
      "🏔️",
      "🗻",
      "🏕️",
      "🏠",
      "🏡",
    ],
  },
  {
    id: "symbols",
    name: "Symbols",
    icon: "💯",
    emojis: [
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "🤎",
      "💔",
      "❣️",
      "💕",
      "💞",
      "💓",
      "💗",
      "💖",
      "💘",
      "💝",
      "💟",
      "☮️",
      "✝️",
      "☪️",
      "🕉️",
      "☸️",
      "✡️",
      "🔯",
      "🕎",
      "☯️",
      "☦️",
      "🛐",
    ],
  },
]

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  onClose?: () => void
}

export function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState("recent")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredEmojis, setFilteredEmojis] = useState<string[]>([])
  const [recentEmojis, setRecentEmojis] = useState<string[]>(emojiCategories[0].emojis)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load recent emojis from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("recentEmojis")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentEmojis(parsed)
          // Update the recent category
          emojiCategories[0].emojis = parsed
        }
      } catch (e) {
        console.error("Failed to parse recent emojis", e)
      }
    }
  }, [])

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEmojis([])
      return
    }

    // Flatten all emojis and filter by search query
    const allEmojis = emojiCategories.flatMap((category) => category.emojis)
    const uniqueEmojis = [...new Set(allEmojis)]

    // Simple filtering - in a real app you might want to use emoji names/keywords
    setFilteredEmojis(
      uniqueEmojis.filter((emoji) =>
        // This is a very basic search - in a real app you'd use emoji metadata
        emoji.includes(searchQuery),
      ),
    )
  }, [searchQuery])

  // Add emoji to recent list
  const addToRecent = (emoji: string) => {
    const updated = [emoji, ...recentEmojis.filter((e) => e !== emoji)].slice(0, 20)
    setRecentEmojis(updated)
    emojiCategories[0].emojis = updated
    localStorage.setItem("recentEmojis", JSON.stringify(updated))
  }

  // Handle emoji selection
  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji)
    addToRecent(emoji)
    if (onClose) onClose()
  }

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node) && onClose) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-sm overflow-hidden"
      style={{ maxHeight: "350px" }}
    >
      <div className="p-2 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search emojis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Tabs defaultValue="recent" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="w-full justify-start px-2 pt-2 bg-gray-50 overflow-x-auto flex-nowrap">
          {emojiCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="px-3 py-1.5">
              {category.icon}
            </TabsTrigger>
          ))}
        </TabsList>

        {searchQuery ? (
          <div className="p-2">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Search Results</h3>
            <div className="grid grid-cols-8 gap-1">
              {filteredEmojis.length > 0 ? (
                filteredEmojis.map((emoji, index) => (
                  <Button
                    key={`search-${index}`}
                    variant="ghost"
                    className="h-8 w-8 p-0 text-lg"
                    onClick={() => handleEmojiClick(emoji)}
                  >
                    {emoji}
                  </Button>
                ))
              ) : (
                <p className="text-sm text-gray-500 col-span-8 py-2 text-center">No emojis found</p>
              )}
            </div>
          </div>
        ) : (
          emojiCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="m-0">
              <ScrollArea className="h-[220px]">
                <div className="p-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{category.name}</h3>
                  <div className="grid grid-cols-8 gap-1">
                    {category.emojis.map((emoji, index) => (
                      <Button
                        key={`${category.id}-${index}`}
                        variant="ghost"
                        className="h-8 w-8 p-0 text-lg"
                        onClick={() => handleEmojiClick(emoji)}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          ))
        )}
      </Tabs>
    </div>
  )
}
