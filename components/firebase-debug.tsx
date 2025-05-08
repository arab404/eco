"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { firebaseInitialized, auth, db, rtdb, storage, messaging } from "@/lib/firebase/firebase"
import { Badge } from "@/components/ui/badge"

export function FirebaseDebug() {
  const [showDebug, setShowDebug] = useState(false)

  if (!showDebug) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 opacity-70 hover:opacity-100"
        onClick={() => setShowDebug(true)}
      >
        Show Firebase Debug
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Firebase Debug
            <Button variant="ghost" size="sm" onClick={() => setShowDebug(false)}>
              Close
            </Button>
          </CardTitle>
          <CardDescription>Firebase initialization status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Initialization Status</h3>
            <Badge variant={firebaseInitialized ? "success" : "destructive"}>
              {firebaseInitialized ? "Initialized" : "Failed"}
            </Badge>
          </div>

          <div>
            <h3 className="font-medium mb-2">Services</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Badge variant={auth ? "success" : "destructive"}>{auth ? "Active" : "Inactive"}</Badge>
                <span>Authentication</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={db ? "success" : "destructive"}>{db ? "Active" : "Inactive"}</Badge>
                <span>Firestore</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={rtdb ? "success" : "destructive"}>{rtdb ? "Active" : "Inactive"}</Badge>
                <span>Realtime DB</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={storage ? "success" : "destructive"}>{storage ? "Active" : "Inactive"}</Badge>
                <span>Storage</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={messaging ? "success" : "destructive"}>{messaging ? "Active" : "Inactive"}</Badge>
                <span>Messaging</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Environment Variables</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>API Key:</span>
                <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "outline" : "destructive"}>
                  {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Set" : "Missing"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Auth Domain:</span>
                <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "outline" : "destructive"}>
                  {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "Set" : "Missing"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Database URL:</span>
                <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ? "outline" : "destructive"}>
                  {process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ? "Set" : "Missing"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Project ID:</span>
                <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "outline" : "destructive"}>
                  {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "Set" : "Missing"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Storage Bucket:</span>
                <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "outline" : "destructive"}>
                  {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "Set" : "Missing"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Messaging Sender ID:</span>
                <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? "outline" : "destructive"}>
                  {process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? "Set" : "Missing"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>App ID:</span>
                <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "outline" : "destructive"}>
                  {process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "Set" : "Missing"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Measurement ID:</span>
                <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? "outline" : "destructive"}>
                  {process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? "Set" : "Missing"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>VAPID Key:</span>
                <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ? "outline" : "destructive"}>
                  {process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ? "Set" : "Missing"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          This debug panel is only visible in development mode
        </CardFooter>
      </Card>
    </div>
  )
}
