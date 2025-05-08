import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  registerUser,
  signIn as firebaseSignIn,
  signOut as firebaseSignOut,
  getCurrentUserData,
  onAuthStateChange,
} from "@/lib/firebase/auth"

interface User {
  uid: string
  email: string
  displayName?: string
  firstName?: string
  lastName?: string
  photoURL?: string
  gender?: string
  dateOfBirth?: string
  maritalStatus?: string
  numberOfChildren?: string
  createdAt?: any
  lastActive?: any
  [key: string]: any // Allow for additional properties
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  isInitialized: boolean
  register: (userData: any) => Promise<boolean>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  clearError: () => void
  updateUserData: (userData: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      isInitialized: false,

      register: async (userData) => {
        set({ isLoading: true, error: null })
        try {
          const { user, error } = await registerUser(userData)

          if (error) {
            set({ error: error.message, isLoading: false })
            return false
          }

          if (user) {
            // Get the full user data from Firestore
            const userData = await getCurrentUserData()
            set({ user: userData, isLoading: false, isInitialized: true })
            return true
          }

          set({ isLoading: false })
          return false
        } catch (err: any) {
          set({ error: err.message || "Registration failed", isLoading: false })
          return false
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const { user, error } = await firebaseSignIn(email, password)

          if (error) {
            set({ error: error.message, isLoading: false })
            return false
          }

          if (user) {
            // Get the full user data from Firestore
            const userData = await getCurrentUserData()
            set({ user: userData, isLoading: false, isInitialized: true })
            return true
          }

          set({ isLoading: false })
          return false
        } catch (err: any) {
          set({ error: err.message || "Login failed", isLoading: false })
          return false
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null })
        try {
          await firebaseSignOut()
          set({ user: null, isLoading: false })
        } catch (err: any) {
          set({ error: err.message || "Logout failed", isLoading: false })
        }
      },

      clearError: () => set({ error: null }),

      updateUserData: (userData) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } })
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    },
  ),
)

// Initialize auth state listener
if (typeof window !== "undefined") {
  // Only run in browser environment
  const unsubscribe = onAuthStateChange((user) => {
    if (user) {
      useAuthStore.setState({
        user,
        isInitialized: true,
        isLoading: false,
      })
    } else {
      useAuthStore.setState({
        user: null,
        isInitialized: true,
        isLoading: false,
      })
    }
  })
}
