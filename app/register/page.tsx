"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Heart, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AuthSuccessToast } from "@/components/auth-success-toast"

export default function RegisterPage() {
  const router = useRouter()
  const { register, user, isLoading: authIsLoading, error, clearError, isInitialized } = useAuthStore()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "male",
    dateOfBirth: "",
    maritalStatus: "",
    numberOfChildren: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | null>(null)
  const [redirecting, setRedirecting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

  // Clear API errors when form changes
  useEffect(() => {
    if (error) {
      clearError()
    }
  }, [formData, clearError, error])

  // Calculate password strength
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(null)
      return
    }

    const hasLowerCase = /[a-z]/.test(formData.password)
    const hasUpperCase = /[A-Z]/.test(formData.password)
    const hasNumber = /\d/.test(formData.password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
    const isLongEnough = formData.password.length >= 8

    const score = [hasLowerCase, hasUpperCase, hasNumber, hasSpecialChar, isLongEnough].filter(Boolean).length

    if (score <= 2) setPasswordStrength("weak")
    else if (score <= 4) setPasswordStrength("medium")
    else setPasswordStrength("strong")
  }, [formData.password])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear specific field error when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })

    // Clear specific field error when user selects
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" })
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    const today = new Date()
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required"
    }

    if (!formData.email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      errors.password = "Password is required"
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long"
    }

    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required"
    } else {
      const birthDate = new Date(formData.dateOfBirth)
      if (birthDate > eighteenYearsAgo) {
        errors.dateOfBirth = "You must be at least 18 years old"
      }
    }

    if (!formData.maritalStatus) {
      errors.maritalStatus = "Marital status is required"
    }

    if (!formData.numberOfChildren) {
      errors.numberOfChildren = "Number of children is required"
    }

    if (!agreedToTerms) {
      errors.terms = "You must agree to the terms of service"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Prepare additional user data for Firebase
    const userData = {
      ...formData,
      // Add default profile data
      bio: "",
      location: "",
      interests: [],
      photos: [],
      preferences: {
        interestedIn: "both",
        ageRange: {
          min: 18,
          max: 50,
        },
        maxDistance: 50,
      },
      // Add account status
      accountStatus: "active",
      accountType: "free",
      createdAt: new Date(),
    }

    const success = await register(userData)

    if (success) {
      setRedirecting(true)
      router.push("/dashboard")
    } else {
      setIsLoading(false)
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "strong":
        return "bg-green-500"
      default:
        return "bg-gray-200"
    }
  }

  // For testing purposes, pre-fill the form with test data
  // const fillTestData = () => {
  //   setFormData({
  //     firstName: "John",
  //     lastName: "Doe",
  //     email: "john.doe@example.com",
  //     password: "Password123!",
  //     gender: "male",
  //     dateOfBirth: "1990-01-01",
  //     maritalStatus: "single",
  //     numberOfChildren: "0",
  //   })
  //   setAgreedToTerms(true)
  // }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-rose-100 p-4 py-10">
      <div className="flex items-center gap-2 mb-8">
        <Heart className="h-8 w-8 text-rose-500" />
        <h1 className="text-3xl font-bold text-gray-900">Ecohub</h1>
      </div>

      <Card className="w-full max-w-md mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Enter your information to create your account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={formErrors.firstName ? "border-red-500" : ""}
                  disabled={isLoading || redirecting}
                />
                {formErrors.firstName && <p className="text-sm text-red-500">{formErrors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={formErrors.lastName ? "border-red-500" : ""}
                  disabled={isLoading || redirecting}
                />
                {formErrors.lastName && <p className="text-sm text-red-500">{formErrors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={formErrors.email ? "border-red-500" : ""}
                disabled={isLoading || redirecting}
              />
              {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={formErrors.password ? "border-red-500 pr-10" : "pr-10"}
                  disabled={isLoading || redirecting}
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

              {formData.password && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getPasswordStrengthColor()}`}
                        style={{
                          width: passwordStrength === "weak" ? "33%" : passwordStrength === "medium" ? "66%" : "100%",
                        }}
                      ></div>
                    </div>
                    <span className="text-xs">
                      {passwordStrength === "weak" ? "Weak" : passwordStrength === "medium" ? "Medium" : "Strong"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Use at least 8 characters with a mix of uppercase, lowercase, numbers, and symbols
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Gender</label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
                className="flex space-x-4"
                disabled={isLoading || redirecting}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <label htmlFor="dateOfBirth" className="text-sm font-medium">
                Date of birth
              </label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={formErrors.dateOfBirth ? "border-red-500" : ""}
                max={new Date().toISOString().split("T")[0]}
                disabled={isLoading || redirecting}
              />
              {formErrors.dateOfBirth && <p className="text-sm text-red-500">{formErrors.dateOfBirth}</p>}
              <p className="text-xs text-gray-500">You must be at least 18 years old to use Ecohub</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="maritalStatus" className="text-sm font-medium">
                Marital Status
              </label>
              <Select
                value={formData.maritalStatus}
                onValueChange={(value) => handleSelectChange("maritalStatus", value)}
                disabled={isLoading || redirecting}
              >
                <SelectTrigger className={formErrors.maritalStatus ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                  <SelectItem value="separated">Separated</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.maritalStatus && <p className="text-sm text-red-500">{formErrors.maritalStatus}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="numberOfChildren" className="text-sm font-medium">
                Number of Children
              </label>
              <Select
                value={formData.numberOfChildren}
                onValueChange={(value) => handleSelectChange("numberOfChildren", value)}
                disabled={isLoading || redirecting}
              >
                <SelectTrigger className={formErrors.numberOfChildren ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4+">4 or more</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.numberOfChildren && <p className="text-sm text-red-500">{formErrors.numberOfChildren}</p>}
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => {
                  setAgreedToTerms(checked as boolean)
                  if (checked && formErrors.terms) {
                    setFormErrors({ ...formErrors, terms: "" })
                  }
                }}
                disabled={isLoading || redirecting}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                    formErrors.terms ? "text-red-500" : ""
                  }`}
                >
                  I agree to the{" "}
                  <Link href="/terms" className="text-rose-500 hover:underline">
                    terms of service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-rose-500 hover:underline">
                    privacy policy
                  </Link>
                </label>
                {formErrors.terms && <p className="text-sm text-red-500">{formErrors.terms}</p>}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 mt-6"
              disabled={isLoading || redirecting || authIsLoading}
            >
              {isLoading || authIsLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : redirecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-rose-500 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
      <AuthSuccessToast />
    </div>
  )
}
