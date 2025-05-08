// Firebase configuration and initialization
import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getDatabase, ref, onValue, off } from "firebase/database"
import { getMessaging, isSupported } from "firebase/messaging"
import { getStorage } from "firebase/storage"

// Check if we're in the browser environment
const isBrowser = typeof window !== "undefined"

// Get Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Only add databaseURL if it's defined
if (process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL) {
  firebaseConfig.databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
}

// Debug environment variables in development
if (process.env.NODE_ENV === "development" && isBrowser) {
  console.log("Firebase environment variables status:", {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Set" : "Missing",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "Set" : "Missing",
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ? "Set" : "Missing",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "Set" : "Missing",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "Set" : "Missing",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? "Set" : "Missing",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "Set" : "Missing",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? "Set" : "Missing",
  })
}

// Initialize Firebase services
let firebaseApp = null
let auth = null
let db = null
let rtdb = null
let storage = null
let messaging = null
let isFirebaseInitialized = false
const serviceStatus = {
  firestore: false,
  auth: false,
  database: false,
  storage: false,
  messaging: false,
}

// Only initialize Firebase if we're in the browser
if (isBrowser) {
  try {
    // Initialize Firebase only if it hasn't been initialized already
    if (!getApps().length) {
      firebaseApp = initializeApp(firebaseConfig)
    } else {
      firebaseApp = getApps()[0]
    }

    // Initialize Firebase services with proper error handling
    try {
      auth = getAuth(firebaseApp)
      serviceStatus.auth = true
    } catch (error) {
      console.error("Firebase Auth initialization error:", error)
    }

    try {
      db = getFirestore(firebaseApp)
      serviceStatus.firestore = true
    } catch (error) {
      console.error("Firebase Firestore initialization error:", error)
    }

    try {
      storage = getStorage(firebaseApp)
      serviceStatus.storage = true
    } catch (error) {
      console.error("Firebase Storage initialization error:", error)
    }

    // Only initialize Realtime Database if URL is provided
    if (process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL) {
      try {
        rtdb = getDatabase(firebaseApp)

        // Verify database connection by attempting to access a reference
        // This will help identify if the database exists but has connectivity issues
        const testRef = ref(rtdb, ".info/connected")
        onValue(
          testRef,
          (snapshot) => {
            const connected = snapshot.val()
            if (connected) {
              console.log("Successfully connected to Firebase Realtime Database")
            } else {
              console.warn("Connected to Firebase but database connection is pending or offline")
            }
            // Remove the listener after first connection check
            off(testRef)
          },
          (error) => {
            console.error("Database connection verification error:", error)
          },
        )

        serviceStatus.database = true
      } catch (error) {
        console.error("Firebase Realtime Database initialization error:", error)

        // Provide more specific error guidance based on error message
        if (error.message.includes("database is not available")) {
          console.error(`
            Database service is not available. This could be due to:
            1. The Realtime Database may not be created in your Firebase project
            2. The database URL might be incorrect or the database might be in a different region
            3. There might be permission issues with your Firebase account
            
            Please verify in the Firebase console that:
            - You have created a Realtime Database (not just Firestore)
            - The database URL matches: ${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}
            - Your database rules allow read/write access for your application
          `)
        }
      }
    } else {
      console.log("Firebase Realtime Database URL not provided, skipping initialization")
    }

    // Initialize Firebase Cloud Messaging (only in browser environment)
    isSupported()
      .then((isSupported) => {
        if (isSupported) {
          try {
            messaging = getMessaging(firebaseApp)
            serviceStatus.messaging = true
          } catch (error) {
            console.error("Firebase Messaging initialization error:", error)
          }
        }
      })
      .catch((err) => {
        console.error("Firebase messaging not supported", err)
      })

    // Mark Firebase as initialized if core services are available
    isFirebaseInitialized = !!firebaseApp && !!auth && !!db

    if (isFirebaseInitialized) {
      console.log("Firebase initialized successfully with services:", serviceStatus)
    }
  } catch (error) {
    console.error("Firebase initialization error:", error)
    isFirebaseInitialized = false
  }
}

// Export Firebase services and initialization status
export const firebaseInitialized = isFirebaseInitialized
export { firebaseApp, auth, db, rtdb, messaging, storage, serviceStatus }
