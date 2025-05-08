"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, X, Star } from "lucide-react"
import { useSubscriptionStore } from "@/lib/subscription-store"
import { SubscriptionGate } from "@/components/subscription-gate"

interface SwipeCardProps {
  user: {
    id: number
    name: string
    age: number
    location: string
    bio: string
    interests: string[]
    images: string[]
    match?: number
    online?: boolean
  }
  onSwipe: (direction: "left" | "right" | "up", userId: number) => void
}

export function SwipeCard({ user, onSwipe }: SwipeCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [exitDirection, setExitDirection] = useState<"left" | "right" | "up" | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const { canUseFeature } = useSubscriptionStore()
  const canRewind = canUseFeature("rewind")
  const canSwipeUnlimited = canUseFeature("unlimitedSwipes")

  // Motion values for the card
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-20, 0, 20])

  // Indicators for swipe direction
  const likeOpacity = useTransform(x, [0, 100], [0, 1])
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0])
  const superLikeOpacity = useTransform(y, [-100, 0], [1, 0])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100

    if (info.offset.x > threshold) {
      setExitDirection("right")
      onSwipe("right", user.id)
    } else if (info.offset.x < -threshold) {
      setExitDirection("left")
      onSwipe("left", user.id)
    } else if (info.offset.y < -threshold) {
      setExitDirection("up")
      onSwipe("up", user.id)
    } else {
      // Reset position if not swiped far enough
      x.set(0)
      y.set(0)
    }
  }

  const nextImage = () => {
    if (currentImageIndex < user.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  const handleSwipeButton = (direction: "left" | "right" | "up") => {
    setExitDirection(direction)
    onSwipe(direction, user.id)
  }

  // Calculate exit animation based on direction
  const getExitAnimation = () => {
    switch (exitDirection) {
      case "left":
        return { x: -500, opacity: 0, transition: { duration: 0.3 } }
      case "right":
        return { x: 500, opacity: 0, transition: { duration: 0.3 } }
      case "up":
        return { y: -500, opacity: 0, transition: { duration: 0.3 } }
      default:
        return {}
    }
  }

  return (
    <motion.div
      ref={cardRef}
      className="absolute w-full max-w-sm bg-white rounded-xl overflow-hidden shadow-lg"
      style={{ x, y, rotate, zIndex: 10 }}
      drag={canSwipeUnlimited ? true : undefined}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={exitDirection ? getExitAnimation() : {}}
    >
      {/* Like/Nope/Super Like Indicators */}
      <motion.div
        className="absolute top-10 right-10 bg-green-500 text-white px-6 py-2 rounded-lg font-bold text-2xl border-4 border-white z-20 rotate-12"
        style={{ opacity: likeOpacity }}
      >
        LIKE
      </motion.div>

      <motion.div
        className="absolute top-10 left-10 bg-red-500 text-white px-6 py-2 rounded-lg font-bold text-2xl border-4 border-white z-20 -rotate-12"
        style={{ opacity: nopeOpacity }}
      >
        NOPE
      </motion.div>

      <motion.div
        className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-2 rounded-lg font-bold text-2xl border-4 border-white z-20"
        style={{ opacity: superLikeOpacity }}
      >
        SUPER LIKE
      </motion.div>

      {/* Image Gallery */}
      <div className="relative h-[350px] sm:h-[400px] md:h-[450px] w-full">
        <Image
          src={user.images[currentImageIndex] || "/placeholder.svg"}
          alt={user.name}
          fill
          className="object-cover"
        />

        {/* Image Navigation Dots */}
        <div className="absolute top-4 left-0 right-0 flex justify-center gap-1">
          {user.images.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full ${
                index === currentImageIndex ? "w-6 bg-rose-500" : "w-2 bg-white bg-opacity-60"
              }`}
            />
          ))}
        </div>

        {/* Image Navigation Areas */}
        <div className="absolute inset-y-0 left-0 w-1/4" onClick={prevImage} />
        <div className="absolute inset-y-0 right-0 w-1/4" onClick={nextImage} />

        {/* User Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center">
                {user.name}, {user.age}
                {user.online && <span className="ml-2 h-3 w-3 rounded-full bg-green-500 inline-block"></span>}
              </h3>
              <p className="text-white/80 text-sm">{user.location}</p>
            </div>
            {user.match && <Badge className="bg-rose-500">{user.match}% Match</Badge>}
          </div>
        </div>
      </div>

      {/* User Details */}
      <div className="p-3">
        <p className="text-gray-700 mb-2 text-sm line-clamp-2 sm:line-clamp-3">{user.bio}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {user.interests.map((interest) => (
            <Badge key={interest} variant="outline">
              {interest}
            </Badge>
          ))}
        </div>

        {/* Swipe Buttons */}
        <div className="flex justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-red-500 text-red-500"
            onClick={() => handleSwipeButton("left")}
          >
            <X className="h-5 w-5" />
          </Button>

          <SubscriptionGate
            feature="rewind"
            fallback={
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-blue-500 text-blue-500 opacity-50"
                disabled
              >
                <Star className="h-5 w-5" />
              </Button>
            }
          >
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-blue-500 text-blue-500"
              onClick={() => handleSwipeButton("up")}
            >
              <Star className="h-5 w-5" />
            </Button>
          </SubscriptionGate>

          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-green-500 text-green-500"
            onClick={() => handleSwipeButton("right")}
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
