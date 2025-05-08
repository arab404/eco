// Firebase Cloud Messaging Service Worker
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js")

// Initialize Firebase app
const firebaseApp = firebase.initializeApp({
  apiKey: self.FIREBASE_CONFIG.apiKey,
  authDomain: self.FIREBASE_CONFIG.authDomain,
  projectId: self.FIREBASE_CONFIG.projectId,
  storageBucket: self.FIREBASE_CONFIG.storageBucket,
  messagingSenderId: self.FIREBASE_CONFIG.messagingSenderId,
  appId: self.FIREBASE_CONFIG.appId,
  measurementId: self.FIREBASE_CONFIG.measurementId,
})

const messaging = firebase.messaging()

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload)

  // Customize notification here
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icons/notification-icon.png",
    badge: "/icons/badge-icon.png",
    // You can add more options like click_action, etc.
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event)

  event.notification.close()

  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // Check if there is already a window/tab open with the target URL
        for (const client of clientList) {
          // You can customize this to match specific URLs or patterns
          if (client.url.includes("/messages") && "focus" in client) {
            return client.focus()
          }
        }

        // If no window/tab is open with the target URL, open a new one
        if (clients.openWindow) {
          return clients.openWindow("/messages")
        }
      }),
  )
})
