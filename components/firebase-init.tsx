"use client"

import { useEffect, useState } from "react"
import { firebaseInitialized, serviceStatus } from "@/lib/firebase/firebase"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export function FirebaseInit() {
  const [error, setError] = useState<string | null>(null)
  const [showStatus, setShowStatus] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if Firebase is initialized
    if (!firebaseInitialized) {
      // Check if environment variables are set
      const envVars = [
        "NEXT_PUBLIC_FIREBASE_API_KEY",
        "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
        "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
        "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
        "NEXT_PUBLIC_FIREBASE_APP_ID",
      ]

      const missingVars = envVars.filter((varName) => !process.env[varName])

      if (missingVars.length > 0) {
        const errorMsg = `Missing Firebase environment variables: ${missingVars.join(", ")}`
        console.error(errorMsg)
        setError(errorMsg)

        toast({
          title: "Firebase Configuration Issue",
          description: "Some Firebase features may not work properly. Check the console for details.",
          variant: "destructive",
        })
      } else {
        setError("Firebase initialization failed. Check the console for details.")

        toast({
          title: "Firebase Configuration Issue",
          description: "Some Firebase features may not work properly. Check the console for details.",
          variant: "destructive",
        })
      }
    } else if (!serviceStatus.database && process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL) {
      // If database URL is provided but database service failed to initialize
      toast({
        title: "Firebase Realtime Database Issue",
        description: (
          <div>
            <p>Realtime Database is not available. This could be due to:</p>
            <ul className="list-disc pl-5 mt-1 text-sm">
              <li>Database not created in Firebase console</li>
              <li>Incorrect database URL or region</li>
              <li>Database rules preventing access</li>
            </ul>
            <p className="mt-1 text-sm">Visit /debug/database for diagnostics.</p>
          </div>
        ),
        variant: "warning",
        duration: 10000, // Show for 10 seconds
      })
    }
  }, [toast])

  if (error) {
    return (
      <>
        <Toaster />
        <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Firebase Configuration Error</AlertTitle>
            <AlertDescription>
              Firebase is not properly configured. Please add the required environment variables.
              <div className="mt-2">
                <strong>Missing:</strong> {error.replace("Missing Firebase environment variables: ", "")}
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </>
    )
  }

  // This component doesn't render anything visible if no errors
  return <Toaster />
}

// Create a separate component for debugging Firebase status
export function FirebaseDebug() {
  const [isOpen, setIsOpen] = useState(false)

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium"
      >
        Firebase Status
      </button>

      {isOpen && (
        <div className="absolute bottom-12 right-0 w-64 bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold mb-2">Firebase Services</h3>
          <ul className="space-y-1 text-sm">
            <li className="flex items-center justify-between">
              <span>Firestore:</span>
              {serviceStatus.firestore ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </li>
            <li className="flex items-center justify-between">
              <span>Authentication:</span>
              {serviceStatus.auth ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </li>
            <li className="flex items-center justify-between">
              <span>Realtime Database:</span>
              {serviceStatus.database ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </li>
            <li className="flex items-center justify-between">
              <span>Storage:</span>
              {serviceStatus.storage ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </li>
            <li className="flex items-center justify-between">
              <span>Messaging:</span>
              {serviceStatus.messaging ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
