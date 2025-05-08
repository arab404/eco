// Firebase Cloud Messaging utilities
import { getToken, onMessage } from "firebase/messaging"
import { messaging } from "./firebase"
import { doc, setDoc } from "firebase/firestore"
import { db } from "./firebase"

// Request notification permission and get FCM token
export const requestNotificationPermission = async (userId) => {
  if (!messaging) {
    console.warn("Firebase messaging is not supported in this browser")
    return { error: "Notifications not supported in this browser" }
  }

  try {
    // Request permission
    const permission = await Notification.requestPermission()

    if (permission !== "granted") {
      return { error: "Notification permission denied" }
    }

    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    })

    if (token) {
      // Save the token to the user's document
      await saveTokenToDatabase(userId, token)
      return { token }
    } else {
      return { error: "No registration token available" }
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error)
    return { error }
  }
}

// Save FCM token to Firestore
const saveTokenToDatabase = async (userId, token) => {
  try {
    // Add this token to the user's tokens array
    await setDoc(doc(db, "users", userId, "tokens", token), {
      token,
      createdAt: new Date(),
      platform: "web",
      // You can add more device info here if needed
    })

    return { success: true }
  } catch (error) {
    console.error("Error saving token to database:", error)
    throw error
  }
}

// Set up foreground message handler
export const setupMessageHandler = (callback) => {
  if (!messaging) {
    console.warn("Firebase messaging is not supported in this browser")
    return null
  }

  return onMessage(messaging, (payload) => {
    console.log("Message received in the foreground:", payload)

    // Call the callback with the notification payload
    if (callback) {
      callback(payload)
    }

    // You can also show a notification manually
    if (payload.notification) {
      const { title, body } = payload.notification

      // Show notification if the browser supports it
      if ("Notification" in window && Notification.permission === "granted") {
        navigator.serviceWorker.getRegistration().then((registration) => {
          registration.showNotification(title, {
            body,
            icon: "/icons/notification-icon.png",
            // Add more options as needed
          })
        })
      }
    }
  })
}
