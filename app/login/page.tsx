"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Heart, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthSuccessToast } from "@/components/auth-success-toast"

export default function LoginPage() {
  const router = useRouter()
  const { login, user, isLoading, error, clearError, isInitialized } = useAuthStore()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({})
  const [redirecting, setRedirecting] = useState(false)
  const [isLocalLoading, setIsLocalLoading] = useState(false) // Added local loading state

  // Redirect if already logged in
  useEffect(() => {
    if (isInitialized && user && !redirecting) {
      setRedirecting(true)
      // Add a small delay to ensure the store is fully updated
      setTimeout(() => {
        router.push("/dashboard")
      }, 100)
    }
  }, [user, router, isInitialized, redirecting])

  // Clear form errors when inputs change
  useEffect(() => {
    setFormErrors({})
  }, [email, password])

  // Clear API errors when form changes
  useEffect(() => {
    if (error) {
      clearError()
    }
  }, [email, password, clearError, error])

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {}

    if (!email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email"
    }

    if (!password) {
      errors.password = "Password is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Update the login form to make it easier to use
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // BYPASS: Allow empty fields for testing
    // Just use any values if fields are empty
    const loginEmail = email || "test@example.com"
    const loginPassword = password || "password123"

    setIsLocalLoading(true)
    const success = await login(loginEmail, loginPassword)
    setIsLocalLoading(false)

    if (success) {
      setRedirecting(true)
      router.push("/dashboard")
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  // For testing purposes, you can pre-fill the form
  const fillTestCredentials = () => {
    setEmail("test@example.com")
    setPassword("password123")
  }

  // Add a quick login button
  const quickLogin = async () => {
    setIsLocalLoading(true)
    const success = await login("test@example.com", "password123")
    setIsLocalLoading(false)
    if (success) {
      setRedirecting(true)
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-rose-100 p-4">
      <div className="flex items-center gap-2 mb-8">
        <Heart className="h-8 w-8 text-rose-500" />
        <h1 className="text-3xl font-bold text-gray-900">Ecohub</h1>
      </div>

      {/* Featured Profiles */}
      <div className="flex -space-x-4 mb-8">
        <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden">
          <Image src="/images/profile1.png" alt="Profile" width={64} height={64} className="object-cover" />
        </div>
        <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden">
          <Image src="/images/profile2.png" alt="Profile" width={64} height={64} className="object-cover" />
        </div>
        <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden">
          <Image src="/images/profile3.png" alt="Profile" width={64} height={64} className="object-cover" />
        </div>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Enter your credentials to sign in to your account</CardDescription>
        </CardHeader>

        <CardContent>
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
                className={formErrors.email ? "border-red-500" : ""}
                disabled={isLoading || redirecting || isLocalLoading}
              />
              {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-rose-500 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={formErrors.password ? "border-red-500 pr-10" : "pr-10"}
                  disabled={isLoading || redirecting || isLocalLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={toggleShowPassword}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600"
              disabled={isLoading || redirecting || isLocalLoading}
            >
              {isLoading || isLocalLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : redirecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            {/* Quick login button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={quickLogin}
              disabled={isLoading || redirecting || isLocalLoading}
            >
              Quick Login (Bypass Auth)
            </Button>

            {/* Test credentials button - for demo purposes */}
            <div className="text-center">
              <button
                type="button"
                onClick={fillTestCredentials}
                className="text-xs text-gray-500 hover:text-rose-500"
                disabled={isLoading || redirecting || isLocalLoading}
              >
                Use test account
              </button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="text-rose-500 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
      <AuthSuccessToast />
    </div>
  )
}
