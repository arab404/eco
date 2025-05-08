import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile as updateAuthProfile,
  onAuthStateChanged,
} from "firebase/auth"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { auth, db, firebaseInitialized, serviceStatus } from "./firebase"
import { createUserProfile, updateUserProfile as updateUserProfileInFirestore } from "../user-profile-sync"

/**
 * Register a new user with email and password
 * @param userData User data including email and password
 * @returns Promise with user data and error if any
 */
export const registerUser = async (userData: any) => {
  if (!firebaseInitialized || !serviceStatus.auth || !serviceStatus.firestore) {
    console.error("Firebase not initialized")
    return { user: null, error: { message: "Firebase not initialized" } }
  }

  try {
    // Create user in Firebase Auth
    const { email, password, ...profileData } = userData
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Create user profile in Firestore
    const { success, error } = await createUserProfile({
      ...profileData,
      email,
      uid: user.uid,
    })

    if (!success) {
      console.error("Error creating user profile:", error)
      // We don't want to delete the auth user if profile creation fails
      // as they can complete their profile later
    }

    return { user, error: null }
  } catch (error: any) {
    console.error("Registration error:", error)
    return {
      user: null,
      error: {
        code: error.code,
        message: error.message,
      },
    }
  }
}

/**
 * Sign in with email and password
 * @param email User email
 * @param password User password
 * @returns Promise with user data and error if any
 */
export const signIn = async (email: string, password: string) => {
  if (!firebaseInitialized || !serviceStatus.auth) {
    console.error("Firebase not initialized")
    return { user: null, error: { message: "Firebase not initialized" } }
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update last active timestamp
    if (serviceStatus.firestore) {
      try {
        const userRef = doc(db, "users", user.uid)
        await updateDoc(userRef, {
          lastActive: serverTimestamp(),
        })
      } catch (err) {
        console.error("Error updating last active timestamp:", err)
        // Non-critical error, don't return it
      }
    }

    return { user, error: null }
  } catch (error: any) {
    console.error("Sign in error:", error)
    return {
      user: null,
      error: {
        code: error.code,
        message: error.message,
      },
    }
  }
}

/**
 * Sign out the current user
 * @returns Promise<void>
 */
export const signOut = async () => {
  if (!firebaseInitialized || !serviceStatus.auth) {
    console.error("Firebase not initialized")
    return
  }

  try {
    await firebaseSignOut(auth)
  } catch (error) {
    console.error("Sign out error:", error)
    throw error
  }
}

/**
 * Send password reset email
 * @param email User email
 * @returns Promise with success status and error if any
 */
export const resetPassword = async (email: string) => {
  if (!firebaseInitialized || !serviceStatus.auth) {
    console.error("Firebase not initialized")
    return { success: false, error: { message: "Firebase not initialized" } }
  }

  try {
    await sendPasswordResetEmail(auth, email)
    return { success: true, error: null }
  } catch (error: any) {
    console.error("Password reset error:", error)
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    }
  }
}

/**
 * Update user profile in Firebase Auth
 * @param profileData Profile data to update
 * @returns Promise with success status and error if any
 */
export const updateUserProfile = async (profileData: { displayName?: string; photoURL?: string }) => {
  if (!firebaseInitialized || !serviceStatus.auth || !auth.currentUser) {
    console.error("Firebase not initialized or user not logged in")
    return { success: false, error: { message: "Firebase not initialized or user not logged in" } }
  }

  try {
    await updateAuthProfile(auth.currentUser, profileData)

    // Also update in Firestore to keep data in sync
    if (serviceStatus.firestore) {
      await updateUserProfileInFirestore(profileData)
    }

    return { success: true, error: null }
  } catch (error: any) {
    console.error("Profile update error:", error)
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    }
  }
}

/**
 * Get current user data from Firestore
 * @returns Promise with user data
 */
export const getCurrentUserData = async () => {
  if (!firebaseInitialized || !serviceStatus.firestore || !auth.currentUser) {
    console.error("Firebase not initialized or user not logged in")
    return null
  }

  try {
    const userRef = doc(db, "users", auth.currentUser.uid)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      return { uid: auth.currentUser.uid, ...userDoc.data() }
    } else {
      console.warn("User document does not exist in Firestore")
      // Return basic user data from Auth
      return {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL,
      }
    }
  } catch (error) {
    console.error("Error getting user data:", error)
    // Return basic user data from Auth as fallback
    return {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      displayName: auth.currentUser.displayName,
      photoURL: auth.currentUser.photoURL,
    }
  }
}

/**
 * Set up auth state change listener
 * @param callback Callback function to handle auth state changes
 * @returns Unsubscribe function
 */
export const onAuthStateChange = (callback: (user: any) => void) => {
  if (!firebaseInitialized || !serviceStatus.auth) {
    console.error("Firebase not initialized")
    return () => {}
  }

  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Get user data from Firestore
      try {
        const userData = await getCurrentUserData()
        callback(userData)
      } catch (error) {
        console.error("Error getting user data:", error)
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        })
      }
    } else {
      callback(null)
    }
  })
}
