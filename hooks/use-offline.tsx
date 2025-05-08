"use client"

import { useState, useEffect, useCallback } from "react"
import { isOnline, addOnlineListener, addOfflineListener } from "@/lib/network-status"

interface UseOfflineOptions {
  onOnline?: () => void
  onOffline?: () => void
}

export function useOffline(options: UseOfflineOptions = {}) {
  const [offline, setOffline] = useState(!isOnline())

  const handleOnline = useCallback(() => {
    setOffline(false)
    options.onOnline?.()
  }, [options])

  const handleOffline = useCallback(() => {
    setOffline(true)
    options.onOffline?.()
  }, [options])

  useEffect(() => {
    // Set initial state
    setOffline(!isOnline())

    // Add event listeners
    const removeOnlineListener = addOnlineListener(handleOnline)
    const removeOfflineListener = addOfflineListener(handleOffline)

    return () => {
      removeOnlineListener()
      removeOfflineListener()
    }
  }, [handleOnline, handleOffline])

  return offline
}
