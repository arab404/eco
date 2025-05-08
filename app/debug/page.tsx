"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { firebaseInitialized, auth, db, rtdb, storage, messaging } from "@/lib/firebase/firebase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Copy, Info } from "lucide-react"

export default function DebugPage() {
  const [copied, setCopied] = useState(false)
  const [authUser, setAuthUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    if (auth) {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setAuthUser(user)
      })
      return () => unsubscribe()
    }
  }, [])

  const copyEnvTemplate = () => {
    const template = `NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=`

    navigator.clipboard.writeText(template)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Firebase Debug Page</CardTitle>
          <CardDescription>This page helps you diagnose Firebase configuration issues</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Initialization Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {firebaseInitialized ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span>Firebase successfully initialized</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span>Firebase initialization failed</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Authentication Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {authUser ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span>Logged in as: {authUser.email}</span>
                    </>
                  ) : (
                    <>
                      <Info className="h-5 w-5 text-amber-500" />
                      <span>Not logged in</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="services">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="env">Environment Variables</TabsTrigger>
              <TabsTrigger value="help">Setup Help</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="p-4 border rounded-md mt-2">
              <h3 className="font-medium mb-4">Firebase Services Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Badge variant={auth ? "success" : "destructive"}>{auth ? "Active" : "Inactive"}</Badge>
                  <span>Authentication</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={db ? "success" : "destructive"}>{db ? "Active" : "Inactive"}</Badge>
                  <span>Firestore Database</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={rtdb ? "success" : "destructive"}>{rtdb ? "Active" : "Inactive"}</Badge>
                  <span>Realtime Database</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={storage ? "success" : "destructive"}>{storage ? "Active" : "Inactive"}</Badge>
                  <span>Storage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={messaging ? "success" : "destructive"}>{messaging ? "Active" : "Inactive"}</Badge>
                  <span>Cloud Messaging</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="env" className="p-4 border rounded-md mt-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Environment Variables Status</h3>
                <Button variant="outline" size="sm" onClick={copyEnvTemplate} className="flex items-center gap-1">
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied!" : "Copy Template"}
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span>NEXT_PUBLIC_FIREBASE_API_KEY</span>
                  <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "outline" : "destructive"}>
                    {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Set" : "Missing"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</span>
                  <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "outline" : "destructive"}>
                    {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "Set" : "Missing"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span>NEXT_PUBLIC_FIREBASE_DATABASE_URL</span>
                  <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ? "outline" : "destructive"}>
                    {process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ? "Set" : "Missing"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span>NEXT_PUBLIC_FIREBASE_PROJECT_ID</span>
                  <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "outline" : "destructive"}>
                    {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "Set" : "Missing"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</span>
                  <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "outline" : "destructive"}>
                    {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "Set" : "Missing"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</span>
                  <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? "outline" : "destructive"}>
                    {process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? "Set" : "Missing"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span>NEXT_PUBLIC_FIREBASE_APP_ID</span>
                  <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "outline" : "destructive"}>
                    {process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "Set" : "Missing"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span>NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID</span>
                  <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? "outline" : "destructive"}>
                    {process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? "Set" : "Missing"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span>NEXT_PUBLIC_FIREBASE_VAPID_KEY</span>
                  <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ? "outline" : "destructive"}>
                    {process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ? "Set" : "Missing"}
                  </Badge>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="help" className="p-4 border rounded-md mt-2">
              <h3 className="font-medium mb-4">Firebase Setup Help</h3>

              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Getting Started</AlertTitle>
                  <AlertDescription>
                    To use Firebase in your app, you need to create a Firebase project and register your app.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <h4 className="font-medium">Step 1: Create a Firebase Project</h4>
                  <p className="text-sm text-muted-foreground">
                    Go to the{" "}
                    <a
                      href="https://console.firebase.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      Firebase Console
                    </a>{" "}
                    and create a new project.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Step 2: Register Your Web App</h4>
                  <p className="text-sm text-muted-foreground">
                    In your Firebase project, click the web icon ({"</>"}) to add a web app. Follow the setup
                    instructions to get your configuration.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Step 3: Add Environment Variables</h4>
                  <p className="text-sm text-muted-foreground">
                    Add the Firebase configuration values as environment variables in your Vercel project settings.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Step 4: Enable Firebase Services</h4>
                  <p className="text-sm text-muted-foreground">
                    In the Firebase Console, enable the services you need (Authentication, Firestore, Storage, etc.).
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">This page is only visible in development mode</p>
          <Button variant="outline" onClick={() => window.history.back()}>
            Back to App
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
