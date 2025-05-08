"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, ArrowUp, ArrowDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MessageSearchProps {
  messages: any[]
  onHighlightMessage: (messageId: number | string) => void
  onClose: () => void
}

export function MessageSearch({ messages, onHighlightMessage, onClose }: MessageSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [currentResultIndex, setCurrentResultIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Perform search when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      setCurrentResultIndex(-1)
      return
    }

    const results = messages.filter((message) => {
      // Only search text messages
      if (message.type !== "text") return false

      return message.text.toLowerCase().includes(searchTerm.toLowerCase())
    })

    setSearchResults(results)
    setCurrentResultIndex(results.length > 0 ? 0 : -1)

    // Highlight first result if available
    if (results.length > 0) {
      onHighlightMessage(results[0].id)
    }
  }, [searchTerm, messages, onHighlightMessage])

  const handlePrevResult = () => {
    if (searchResults.length === 0) return

    const newIndex = currentResultIndex > 0 ? currentResultIndex - 1 : searchResults.length - 1

    setCurrentResultIndex(newIndex)
    onHighlightMessage(searchResults[newIndex].id)
  }

  const handleNextResult = () => {
    if (searchResults.length === 0) return

    const newIndex = currentResultIndex < searchResults.length - 1 ? currentResultIndex + 1 : 0

    setCurrentResultIndex(newIndex)
    onHighlightMessage(searchResults[newIndex].id)
  }

  const handleClear = () => {
    setSearchTerm("")
    setSearchResults([])
    setCurrentResultIndex(-1)
  }

  return (
    <div className="flex flex-col bg-white border-b border-gray-200 p-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search in conversation..."
            className="pl-8 pr-8 h-9"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {searchResults.length > 0 && (
        <div className="flex items-center justify-between mt-2">
          <Badge variant="outline" className="text-xs">
            {currentResultIndex + 1} of {searchResults.length} results
          </Badge>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handlePrevResult}
              disabled={searchResults.length === 0}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handleNextResult}
              disabled={searchResults.length === 0}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
