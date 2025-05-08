// Network status utility functions

// Check if the browser is online
export const isOnline = (): boolean => {
  return typeof navigator !== "undefined" && navigator.onLine
}

// Add a listener for online status changes
export const addOnlineListener = (callback: () => void): (() => void) => {
  if (typeof window === "undefined") return () => {}

  window.addEventListener("online", callback)
  return () => window.removeEventListener("online", callback)
}

// Add a listener for offline status changes
export const addOfflineListener = (callback: () => void): (() => void) => {
  if (typeof window === "undefined") return () => {}

  window.addEventListener("offline", callback)
  return () => window.removeEventListener("offline", callback)
}

// Exponential backoff retry function
export const retry = async <T>(\
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000,
  backoffFactor: number = 2
)
: Promise<T> =>
{
  try {
    return await fn()
  } catch (error) {
    if (retries <= 0) throw error

    await new Promise((resolve) => setTimeout(resolve, delay))
    return retry(fn, retries - 1, delay * backoffFactor, backoffFactor)
  }
}

// Check connection to Firebase
export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    // This is a simple ping to check if we can reach Firebase
    const response = await fetch("https://firestore.googleapis.com/google.firestore.v1.Firestore/Listen/channel", {
      method: "OPTIONS",
      mode: "no-cors",
    })
    return true
  } catch (error) {
    return false
  }
}
