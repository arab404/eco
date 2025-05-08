import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db, auth, firebaseInitialized, serviceStatus } from "./firebase/firebase"
import { updateProfile } from "firebase/auth"
import { useAuthStore } from "./auth-store"

// Define user profile data interface
export interface UserProfile {
  uid: string
  email: string
  firstName: string
  lastName: string
  displayName?: string
  photoURL?: string
  gender?: string
  dateOfBirth?: string
  maritalStatus?: string
  numberOfChildren?: string
  bio?: string
  location?: string
  interests?: string[]
  photos?: string[]
  preferences?: {
    interestedIn?: string
    ageRange?: {
      min: number
      max: number
    }
    maxDistance?: number
  }
  accountStatus?: string
  accountType?: string
  createdAt?: any
  updatedAt?: any
  lastActive?: any
  [key: string]: any // Allow for additional properties
}

/**
 * Create a new user profile in Firestore
 * @param userData User profile data
 * @returns Promise with success status and error if any
 */
export const createUserProfile = async (
  userData: Partial<UserProfile>,
): Promise<{ success: boolean; error?: Error }> => {
  if (!firebaseInitialized || !serviceStatus.firestore || !auth.currentUser) {
    console.error("Firebase not initialized or user not logged in")
    return {
      success: false,
      error: new Error("Firebase not initialized or user not logged in"),
    }
  }

  try {
    const uid = auth.currentUser.uid

    // Check if we're online
    if (!navigator.onLine) {
      // Store data to be synced later
      localStorage.setItem(
        `pending_profile_create_${uid}`,
        JSON.stringify({
          ...userData,
          uid,
          timestamp: Date.now(),
        }),
      )

      console.log("Offline: User profile creation queued for sync")
      return { success: true }
    }

    // Check if user document already exists
    const userRef = doc(db, "users", uid)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      console.log("User profile already exists, updating instead")
      return await updateUserProfile(userData)
    }

    // Create new user document
    const userProfile: UserProfile = {
      uid,
      email: auth.currentUser.email || userData.email || "",
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      displayName: userData.displayName || `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
      photoURL: userData.photoURL || auth.currentUser.photoURL || "",
      gender: userData.gender || "",
      dateOfBirth: userData.dateOfBirth || "",
      maritalStatus: userData.maritalStatus || "",
      numberOfChildren: userData.numberOfChildren || "",
      bio: userData.bio || "",
      location: userData.location || "",
      interests: userData.interests || [],
      photos: userData.photos || [],
      preferences: userData.preferences || {
        interestedIn: "both",
        ageRange: { min: 18, max: 50 },
        maxDistance: 50,
      },
      accountStatus: userData.accountStatus || "active",
      accountType: userData.accountType || "free",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastActive: serverTimestamp(),
    }

    // Save to Firestore
    await setDoc(userRef, userProfile)

    // Update Auth profile
    await updateProfile(auth.currentUser, {
      displayName: userProfile.displayName,
      photoURL: userProfile.photoURL,
    })

    // Update local state
    useAuthStore.getState().updateUserData(userProfile)

    console.log("User profile created successfully")
    return { success: true }
  } catch (error) {
    console.error("Error creating user profile:", error)
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error creating user profile"),
    }
  }
}

/**
 * Update an existing user profile in Firestore
 * @param userData Partial user profile data to update
 * @returns Promise with success status and error if any
 */
export const updateUserProfile = async (
  userData: Partial<UserProfile>,
): Promise<{ success: boolean; error?: Error }> => {
  if (!firebaseInitialized || !serviceStatus.firestore || !auth.currentUser) {
    console.error("Firebase not initialized or user not logged in")
    return {
      success: false,
      error: new Error("Firebase not initialized or user not logged in"),
    }
  }

  try {
    const uid = auth.currentUser.uid

    // Check if we're online
    if (!navigator.onLine) {
      // Store data to be synced later
      localStorage.setItem(
        `pending_profile_update_${uid}`,
        JSON.stringify({
          ...userData,
          uid,
          timestamp: Date.now(),
        }),
      )

      console.log("Offline: User profile update queued for sync")
      return { success: true }
    }

    // Update Firestore document
    const userRef = doc(db, "users", uid)

    // Check if user document exists
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      console.log("User profile doesn't exist, creating instead")
      return await createUserProfile(userData)
    }

    // Prepare update data
    const updateData: any = {
      ...userData,
      updatedAt: serverTimestamp(),
      lastActive: serverTimestamp(),
    }

    // If first name or last name is updated, update display name
    if (userData.firstName || userData.lastName) {
      const currentData = userDoc.data()
      const firstName = userData.firstName || currentData.firstName || ""
      const lastName = userData.lastName || currentData.lastName || ""
      updateData.displayName = `${firstName} ${lastName}`.trim()
    }

    await updateDoc(userRef, updateData)

    // Update Auth profile if needed
    if (updateData.displayName || updateData.photoURL) {
      await updateProfile(auth.currentUser, {
        displayName: updateData.displayName,
        photoURL: updateData.photoURL,
      })
    }

    // Update local state
    useAuthStore.getState().updateUserData(updateData)

    console.log("User profile updated successfully")
    return { success: true }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error updating user profile"),
    }
  }
}

/**
 * Get user profile from Firestore
 * @param uid User ID (optional, defaults to current user)
 * @returns Promise with user profile data and success status
 */
export const getUserProfile = async (
  uid?: string,
): Promise<{
  success: boolean
  data?: UserProfile
  error?: Error
  fromCache?: boolean
}> => {
  if (!firebaseInitialized || !serviceStatus.firestore) {
    console.error("Firebase not initialized")
    return {
      success: false,
      error: new Error("Firebase not initialized"),
    }
  }

  try {
    // Use provided UID or current user's UID
    const userId = uid || auth.currentUser?.uid

    if (!userId) {
      return {
        success: false,
        error: new Error("No user ID provided and no user is logged in"),
      }
    }

    // Check if we're online
    if (!navigator.onLine) {
      // Try to get from cache
      const cachedData = localStorage.getItem(`user_profile_${userId}`)
      if (cachedData) {
        console.log("Offline: Using cached user profile")
        return {
          success: true,
          data: JSON.parse(cachedData),
          fromCache: true,
        }
      }

      return {
        success: false,
        error: new Error("You're offline and no cached data is available"),
        fromCache: false,
      }
    }

    // Get from Firestore
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      return {
        success: false,
        error: new Error("User profile not found"),
      }
    }

    const userData = userDoc.data() as UserProfile

    // Cache the data for offline use
    localStorage.setItem(`user_profile_${userId}`, JSON.stringify(userData))

    // If this is the current user, update the auth store
    if (userId === auth.currentUser?.uid) {
      useAuthStore.getState().updateUserData(userData)
    }

    return { success: true, data: userData }
  } catch (error) {
    console.error("Error getting user profile:", error)
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error getting user profile"),
    }
  }
}

/**
 * Sync pending profile changes when coming back online
 * @returns Promise with success status
 */
export const syncPendingProfileChanges = async (): Promise<{ success: boolean; error?: Error }> => {
  if (!firebaseInitialized || !serviceStatus.firestore || !auth.currentUser) {
    console.error("Firebase not initialized or user not logged in")
    return {
      success: false,
      error: new Error("Firebase not initialized or user not logged in"),
    }
  }

  try {
    const uid = auth.currentUser.uid

    // Check for pending profile creation
    const pendingCreate = localStorage.getItem(`pending_profile_create_${uid}`)
    if (pendingCreate) {
      const userData = JSON.parse(pendingCreate)
      const result = await createUserProfile(userData)

      if (result.success) {
        localStorage.removeItem(`pending_profile_create_${uid}`)
      }
    }

    // Check for pending profile updates
    const pendingUpdate = localStorage.getItem(`pending_profile_update_${uid}`)
    if (pendingUpdate) {
      const userData = JSON.parse(pendingUpdate)
      const result = await updateUserProfile(userData)

      if (result.success) {
        localStorage.removeItem(`pending_profile_update_${uid}`)
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error syncing pending profile changes:", error)
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error syncing pending profile changes"),
    }
  }
}

// Listen for online status changes to sync pending changes
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    if (auth.currentUser) {
      syncPendingProfileChanges()
        .then((result) => {
          if (result.success) {
            console.log("Synced pending profile changes successfully")
          }
        })
        .catch((error) => {
          console.error("Error syncing pending profile changes:", error)
        })
    }
  })
}
