import { ref, set, get, update, remove, onValue, off, query, orderByChild, equalTo } from "firebase/database"
import { rtdb, serviceStatus } from "./firebase"

/**
 * Check if the Realtime Database is accessible
 * @returns {Promise<boolean>}
 */
export const checkDatabaseConnection = async () => {
  if (!isDatabaseAvailable()) {
    return false
  }

  try {
    // Try to access the .info/connected special path
    const connectedRef = ref(rtdb, ".info/connected")
    return new Promise((resolve) => {
      const unsubscribe = onValue(
        connectedRef,
        (snapshot) => {
          // Clean up the listener
          unsubscribe()
          resolve(!!snapshot.val())
        },
        (error) => {
          console.error("Database connection check error:", error)
          resolve(false)
        },
      )

      // Set a timeout in case the connection check hangs
      setTimeout(() => {
        unsubscribe()
        resolve(false)
      }, 5000)
    })
  } catch (error) {
    console.error("Error checking database connection:", error)
    return false
  }
}

// Check if Realtime Database is available
const isDatabaseAvailable = () => {
  if (!rtdb) {
    console.error("Firebase Realtime Database instance is not available. Check your Firebase initialization.")
    return false
  }

  if (!serviceStatus.database) {
    console.error(
      "Firebase Realtime Database service is not initialized. Make sure it's enabled in your Firebase project and the URL is correctly configured.",
    )
    return false
  }

  return true
}

/**
 * Set data at a specific path in the Realtime Database
 * @param {string} path - The path to set data at
 * @param {any} data - The data to set
 * @returns {Promise<void>}
 */
export const setData = async (path, data) => {
  if (!isDatabaseAvailable()) {
    return {
      success: false,
      error: new Error("Firebase Realtime Database is not available"),
    }
  }

  try {
    const reference = ref(rtdb, path)
    await set(reference, data)
    return { success: true }
  } catch (error) {
    console.error("Error setting data:", error)
    return { success: false, error }
  }
}

/**
 * Get data from a specific path in the Realtime Database
 * @param {string} path - The path to get data from
 * @returns {Promise<any>}
 */
export const getData = async (path) => {
  if (!isDatabaseAvailable()) {
    return {
      success: false,
      error: new Error("Firebase Realtime Database is not available"),
    }
  }

  try {
    const reference = ref(rtdb, path)
    const snapshot = await get(reference)
    return { success: true, data: snapshot.exists() ? snapshot.val() : null }
  } catch (error) {
    console.error("Error getting data:", error)
    return { success: false, error }
  }
}

/**
 * Update data at a specific path in the Realtime Database
 * @param {string} path - The path to update data at
 * @param {any} updates - The updates to apply
 * @returns {Promise<void>}
 */
export const updateData = async (path, updates) => {
  if (!isDatabaseAvailable()) {
    return {
      success: false,
      error: new Error("Firebase Realtime Database is not available"),
    }
  }

  try {
    const reference = ref(rtdb, path)
    await update(reference, updates)
    return { success: true }
  } catch (error) {
    console.error("Error updating data:", error)
    return { success: false, error }
  }
}

/**
 * Remove data at a specific path in the Realtime Database
 * @param {string} path - The path to remove data from
 * @returns {Promise<void>}
 */
export const removeData = async (path) => {
  if (!isDatabaseAvailable()) {
    return {
      success: false,
      error: new Error("Firebase Realtime Database is not available"),
    }
  }

  try {
    const reference = ref(rtdb, path)
    await remove(reference)
    return { success: true }
  } catch (error) {
    console.error("Error removing data:", error)
    return { success: false, error }
  }
}

/**
 * Subscribe to data changes at a specific path in the Realtime Database
 * @param {string} path - The path to subscribe to
 * @param {function} callback - The callback to call when data changes
 * @returns {function} - A function to unsubscribe
 */
export const subscribeToData = (path, callback) => {
  if (!isDatabaseAvailable()) {
    console.error("Firebase Realtime Database is not available")
    return () => {}
  }

  const reference = ref(rtdb, path)
  onValue(reference, (snapshot) => {
    callback(snapshot.val())
  })

  // Return a function to unsubscribe
  return () => off(reference)
}

/**
 * Query data in the Realtime Database
 * @param {string} path - The path to query
 * @param {string} child - The child to order by
 * @param {any} value - The value to equal
 * @returns {Promise<any>}
 */
export const queryData = async (path, child, value) => {
  if (!isDatabaseAvailable()) {
    return {
      success: false,
      error: new Error("Firebase Realtime Database is not available"),
    }
  }

  try {
    const reference = ref(rtdb, path)
    const queryRef = query(reference, orderByChild(child), equalTo(value))
    const snapshot = await get(queryRef)
    return { success: true, data: snapshot.exists() ? snapshot.val() : null }
  } catch (error) {
    console.error("Error querying data:", error)
    return { success: false, error }
  }
}
