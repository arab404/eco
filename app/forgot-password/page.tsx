"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, Loader2, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ForgotPasswordPage() {
  const { resetPassword, isLoading, error, clearError } = useAuthStore()

  const [email, setEmail] = useState("")
  const [formError, setFormError] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Clear API errors when form changes
  useEffect(() => {
    if (error) {
      clearError()
    }
  }, [email, clearError, error])

  const validateForm = () => {
    if (!email) {
      setFormError("Email is required")
      return false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setFormError("Please enter a valid email")
      return false
    }

    setFormError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await resetPassword(email)
      setIsSubmitted(true)
    } catch (err) {
      // Error is handled by the store
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-rose-100 p-4">
      <div className="flex items-center gap-2 mb-8">
        <Heart className="h-8 w-8 text-rose-500" />
        <h1 className="text-3xl font-bold text-gray-900">Ecohub</h1>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>Enter your email address and we'll send you a link to reset your password</CardDescription>
        </CardHeader>

        <CardContent>
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h3 className="text-xl font-medium text-center">Check your email</h3>
              <p className="text-center text-gray-600">
                We've sent a password reset link to <span className="font-medium">{email}</span>
              </p>
              <p className="text-sm text-gray-500 text-center">
                If you don't see it in your inbox, please check your spam folder
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className={formError ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {formError && <p className="text-sm text-red-500">{formError}</p>}
              </div>

              <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <div className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <Link href="/login" className="text-rose-500 hover:underline">
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
