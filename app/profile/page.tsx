"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Plus, X, Loader2, AlertCircle, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { InviteLink } from "@/components/invite-link"
import { ProfileImageUploader } from "@/components/image-uploader"
import { useToast } from "@/components/ui/use-toast"
import { useAuthStore } from "@/lib/auth-store"
import { updateUserProfile } from "@/lib/firebase/auth"
import { getUserProfile, updateUserProfile as updateProfile } from "@/lib/user-profile-sync"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Profile() {
  const [selectedTab, setSelectedTab] = useState("photos")
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [photos, setPhotos] = useState<string[]>([])
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    location: "",
    bio: "",
    interestedIn: "women",
    ageRangeMin: 25,
    ageRangeMax: 35,
    maxDistance: 50,
  })

  const { toast } = useToast()
  const { user, updateUserData } = useAuthStore()

  // Available interests
  const interests = [
    "Travel",
    "Photography",
    "Hiking",
    "Coffee",
    "Music",
    "Coding",
    "Concerts",
    "Reading",
    "Art",
    "Museums",
    "Wine Tasting",
    "Yoga",
    "Cooking",
    "Restaurants",
    "Food",
    "Wine",
    "Movies",
    "Gaming",
    "Fitness",
    "Dancing",
    "Pets",
    "Nature",
  ]

  // Check online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
      // Reload data when coming back online
      if (user) {
        loadUserData()
      }
    }

    const handleOffline = () => {
      setIsOffline(true)
    }

    // Set initial state
    setIsOffline(!navigator.onLine)

    // Add event listeners
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [user])

  // Load user data
  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const { success, data, error: profileError, fromCache } = await getUserProfile(user.uid)

      if (!success) {
        throw new Error(profileError?.message || "Failed to load profile data")
      }

      if (data) {
        // Set profile data
        setProfileData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          dateOfBirth: data.dateOfBirth || "",
          location: data.location || "",
          bio: data.bio || "",
          interestedIn: data.preferences?.interestedIn || "women",
          ageRangeMin: data.preferences?.ageRange?.min || 25,
          ageRangeMax: data.preferences?.ageRange?.max || 35,
          maxDistance: data.preferences?.maxDistance || 50,
        })

        // Set interests
        setSelectedInterests(data.interests || [])

        // Set photos
        setPhotos(data.photos || [])
        if (data.photoURL && !data.photos?.includes(data.photoURL)) {
          setPhotos((prev) => [data.photoURL!, ...prev])
        }

        // Show toast if using cached data
        if (fromCache) {
          toast({
            title: "Offline Mode",
            description: "You're viewing cached profile data. Some features may be limited.",
            variant: "warning",
          })
        }
      }
    } catch (err: any) {
      console.error("Error loading user data:", err)
      setError(err.message || "Failed to load profile data")

      toast({
        title: "Error",
        description: err.message || "Failed to load profile data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleInterest = async (interest: string) => {
    if (!user) return

    try {
      // Optimistically update UI
      if (selectedInterests.includes(interest)) {
        // Remove interest
        setSelectedInterests(selectedInterests.filter((i) => i !== interest))
      } else {
        // Add interest
        setSelectedInterests([...selectedInterests, interest])
      }

      // Update in database
      const { success, error: updateError } = await updateProfile({
        interests: selectedInterests.includes(interest)
          ? selectedInterests.filter((i) => i !== interest)
          : [...selectedInterests, interest],
      })

      if (!success) {
        throw new Error(updateError?.message || "Failed to update interests")
      }

      toast({
        title: "Interests updated",
        description: selectedInterests.includes(interest)
          ? `Removed "${interest}" from your interests`
          : `Added "${interest}" to your interests`,
      })
    } catch (err: any) {
      console.error("Error updating interests:", err)

      // Revert optimistic update
      setSelectedInterests(selectedInterests)

      toast({
        title: "Error",
        description: err.message || "Failed to update interests",
        variant: "destructive",
      })
    }
  }

  const handleAddPhoto = () => {
    setUploadingIndex(photos.length)
  }

  const handlePhotoSelect = async (index: number, file: File, previewUrl: string) => {
    if (!user) return

    try {
      // In a real app, the URL would come from Firebase Storage
      // The image-uploader component handles the upload to Firebase

      // Optimistically update UI
      const newPhotos = [...photos]
      newPhotos[index] = previewUrl
      setPhotos(newPhotos)

      // Update in database
      const { success, error: updateError } = await updateProfile({
        photos: newPhotos,
        ...(index === 0 ? { photoURL: previewUrl } : {}),
      })

      if (!success) {
        throw new Error(updateError?.message || "Failed to upload photo")
      }

      // If this is the first photo, set it as the profile photo
      if (index === 0) {
        await updateUserProfile({
          photoURL: previewUrl,
        })
        updateUserData({ photoURL: previewUrl })
      }

      setUploadingIndex(null)

      toast({
        title: "Photo uploaded",
        description: "Your new photo has been added to your profile",
      })
    } catch (err: any) {
      console.error("Error uploading photo:", err)

      // Revert optimistic update
      setPhotos(photos)

      toast({
        title: "Error",
        description: err.message || "Failed to upload photo",
        variant: "destructive",
      })
    }
  }

  const removePhoto = async (index: number) => {
    if (!user) return

    try {
      // Optimistically update UI
      const newPhotos = [...photos]
      const removedPhoto = newPhotos[index]
      newPhotos.splice(index, 1)
      setPhotos(newPhotos)

      // Update in database
      const { success, error: updateError } = await updateProfile({
        photos: newPhotos,
        ...(index === 0 && newPhotos.length > 0 ? { photoURL: newPhotos[0] } : {}),
      })

      if (!success) {
        throw new Error(updateError?.message || "Failed to remove photo")
      }

      // If the removed photo was the profile photo, update the profile photo
      if (index === 0 && newPhotos.length > 0) {
        await updateUserProfile({
          photoURL: newPhotos[0],
        })
        updateUserData({ photoURL: newPhotos[0] })
      }

      toast({
        title: "Photo removed",
        description: "The photo has been removed from your profile",
      })
    } catch (err: any) {
      console.error("Error removing photo:", err)

      // Revert optimistic update
      setPhotos(photos)

      toast({
        title: "Error",
        description: err.message || "Failed to remove photo",
        variant: "destructive",
      })
    }
  }

  const handleSaveChanges = async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      // Update user profile
      const { success, error: updateError } = await updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        displayName: `${profileData.firstName} ${profileData.lastName}`,
        dateOfBirth: profileData.dateOfBirth,
        location: profileData.location,
        bio: profileData.bio,
        preferences: {
          interestedIn: profileData.interestedIn,
          ageRange: {
            min: profileData.ageRangeMin,
            max: profileData.ageRangeMax,
          },
          maxDistance: profileData.maxDistance,
        },
      })

      if (!success) {
        throw new Error(updateError?.message || "Failed to save profile changes")
      }

      // Update display name in Firebase Auth
      await updateUserProfile({
        displayName: `${profileData.firstName} ${profileData.lastName}`,
      })

      // Update local user data
      updateUserData({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        displayName: `${profileData.firstName} ${profileData.lastName}`,
      })

      toast({
        title: "Changes saved",
        description: isOffline
          ? "Your changes will be saved when you're back online"
          : "Your profile has been updated successfully",
      })
    } catch (err: any) {
      console.error("Error saving profile:", err)
      setError(err.message || "Failed to save profile changes")

      toast({
        title: "Error",
        description: err.message || "Failed to save profile changes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string | number) => {
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRetry = () => {
    loadUserData()
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-rose-500" />
          <p>Please sign in to view your profile</p>
          <Button asChild className="mt-4 bg-rose-500 hover:bg-rose-600">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {isOffline && (
          <Alert variant="warning" className="mb-4">
            <WifiOff className="h-4 w-4" />
            <AlertTitle>You're offline</AlertTitle>
            <AlertDescription>
              Changes will be saved when you're back online. Some features may be limited.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
              <Button variant="link" className="p-0 h-auto text-white underline ml-2" onClick={handleRetry}>
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="photos" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="photos" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white">
              Photos
            </TabsTrigger>
            <TabsTrigger value="info" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white">
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white">
              Preferences
            </TabsTrigger>
            <TabsTrigger value="invite" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white">
              Invite
            </TabsTrigger>
          </TabsList>

          <TabsContent value="photos">
            <Card>
              <CardHeader>
                <CardTitle>Profile Photos</CardTitle>
                <CardDescription>
                  Add up to 15 photos to your profile. Your first photo will be your main profile picture.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        {uploadingIndex === index ? (
                          <div className="aspect-square relative overflow-hidden rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <ProfileImageUploader
                              onImageSelect={(file, previewUrl) => handlePhotoSelect(index, file, previewUrl)}
                            />
                          </div>
                        ) : (
                          <>
                            <div className="aspect-square relative overflow-hidden rounded-lg">
                              <Image
                                src={photo || "/placeholder.svg?height=300&width=300"}
                                alt={`Profile photo ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removePhoto(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            {index === 0 && <Badge className="absolute bottom-2 left-2 bg-rose-500">Main</Badge>}
                          </>
                        )}
                      </div>
                    ))}
                    {photos.length < 15 && uploadingIndex === photos.length && (
                      <div className="aspect-square relative overflow-hidden rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <ProfileImageUploader
                          onImageSelect={(file, previewUrl) => handlePhotoSelect(photos.length, file, previewUrl)}
                        />
                      </div>
                    )}
                    {photos.length < 15 && uploadingIndex === null && (
                      <Button
                        variant="outline"
                        className="aspect-square flex flex-col items-center justify-center border-dashed"
                        onClick={handleAddPhoto}
                      >
                        <Plus className="h-6 w-6 mb-1" />
                        <span className="text-xs">Add Photo</span>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex-col items-start space-y-4">
                <div className="space-y-2 w-full">
                  <h3 className="text-lg font-semibold">Interests</h3>
                  <p className="text-sm text-gray-500">
                    Select interests to display on your profile. These help others get to know you better.
                  </p>
                  <ScrollArea className="h-48 w-full">
                    <div className="flex flex-wrap gap-2 p-1">
                      {interests.map((interest) => (
                        <Badge
                          key={interest}
                          variant={selectedInterests.includes(interest) ? "default" : "outline"}
                          className={`cursor-pointer ${
                            selectedInterests.includes(interest) ? "bg-rose-500 hover:bg-rose-600" : ""
                          }`}
                          onClick={() => toggleInterest(interest)}
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                <Button
                  className="w-full bg-rose-500 hover:bg-rose-600"
                  onClick={handleSaveChanges}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and profile information.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
                  </div>
                ) : (
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium">
                          First Name
                        </label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium">
                          Last Name
                        </label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="dateOfBirth" className="text-sm font-medium">
                        Date of Birth
                      </label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium">
                        Location
                      </label>
                      <Input
                        id="location"
                        name="location"
                        value={profileData.location}
                        onChange={handleInputChange}
                        placeholder="City, State"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="bio" className="text-sm font-medium">
                        Bio
                      </label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell others about yourself..."
                        className="resize-none h-32"
                      />
                      <p className="text-xs text-gray-500">{profileData.bio.length}/500 characters</p>
                    </div>

                    <Button
                      type="button"
                      className="w-full bg-rose-500 hover:bg-rose-600"
                      onClick={handleSaveChanges}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Search Preferences</CardTitle>
                <CardDescription>Update your search preferences to find better matches.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
                  </div>
                ) : (
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">I am interested in</label>
                      <div className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="pref-women"
                            name="interestedIn"
                            value="women"
                            checked={profileData.interestedIn === "women"}
                            onChange={() => handleSelectChange("interestedIn", "women")}
                          />
                          <label htmlFor="pref-women">Women</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="pref-men"
                            name="interestedIn"
                            value="men"
                            checked={profileData.interestedIn === "men"}
                            onChange={() => handleSelectChange("interestedIn", "men")}
                          />
                          <label htmlFor="pref-men">Men</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="pref-both"
                            name="interestedIn"
                            value="both"
                            checked={profileData.interestedIn === "both"}
                            onChange={() => handleSelectChange("interestedIn", "both")}
                          />
                          <label htmlFor="pref-both">Both</label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Age Range</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Min:</span>
                          <Input
                            type="number"
                            min="18"
                            max="100"
                            value={profileData.ageRangeMin}
                            onChange={(e) => handleSelectChange("ageRangeMin", Number.parseInt(e.target.value))}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Max:</span>
                          <Input
                            type="number"
                            min="18"
                            max="100"
                            value={profileData.ageRangeMax}
                            onChange={(e) => handleSelectChange("ageRangeMax", Number.parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Maximum Distance (miles)</label>
                      <Input
                        type="number"
                        min="1"
                        max="500"
                        value={profileData.maxDistance}
                        onChange={(e) => handleSelectChange("maxDistance", Number.parseInt(e.target.value))}
                      />
                    </div>

                    <Button
                      type="button"
                      className="w-full bg-rose-500 hover:bg-rose-600"
                      onClick={handleSaveChanges}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Preferences"
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invite">
            <InviteLink />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
