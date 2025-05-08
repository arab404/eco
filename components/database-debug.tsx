"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw } from "lucide-react"
import { checkDatabaseConnection } from "@/lib/firebase/database"
import { serviceStatus } from "@/lib/firebase/firebase"

export function DatabaseDebug() {
  const [isChecking, setIsChecking] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null)
  const [databaseUrl, setDatabaseUrl] = useState<string | null>(null)

  useEffect(() => {
    // Get the database URL from environment variables
    setDatabaseUrl(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || null)
  }, [])

  const checkConnection = async () => {
    setIsChecking(true)
    try {
      const isConnected = await checkDatabaseConnection()
      setConnectionStatus(isConnected)
    } catch (error) {
      console.error("Error checking connection:", error)
      setConnectionStatus(false)
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Firebase Realtime Database Diagnostics</CardTitle>
        <CardDescription>Check your database connection and configuration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Database Service:</span>
            {serviceStatus.database ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Initialized
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <XCircle className="h-3.5 w-3.5 mr-1" />
                Not Initialized
              </Badge>
            )}
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Database URL:</span>
            {databaseUrl ? (
              <span className="text-sm text-muted-foreground truncate max-w-[200px]">{databaseUrl}</span>
            ) : (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                Not Configured
              </Badge>
            )}
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Connection Status:</span>
            {connectionStatus === null ? (
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                Not Checked
              </Badge>
            ) : connectionStatus ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <XCircle className="h-3.5 w-3.5 mr-1" />
                Disconnected
              </Badge>
            )}
          </div>
        </div>

        {!serviceStatus.database && (
          <Alert variant="destructive">
            <AlertTitle>Database Service Not Available</AlertTitle>
            <AlertDescription>
              The Firebase Realtime Database service could not be initialized. Please check:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>You have created a Realtime Database in your Firebase project</li>
                <li>The database URL is correct in your environment variables</li>
                <li>Your Firebase project has the Realtime Database service enabled</li>
                <li>Your database rules allow read/write access for your application</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={checkConnection} disabled={isChecking || !serviceStatus.database} className="w-full">
          {isChecking ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Checking Connection...
            </>
          ) : (
            "Check Connection"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
