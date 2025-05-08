"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { uploadProfileImage, uploadChatImage } from "@/lib/firebase/storage"
import { useAuthStore } from "@/lib/auth-store"

interface ImageUploaderProps {
  onImageSelect: (file: File, previewUrl: string) => void
  onCancel?: () => void
  buttonText?: string
  maxSizeMB?: number
  className?: string
  uploadType?: "profile" | "chat"
  chatId?: string
}

export function ImageUploader({
  onImageSelect,
  onCancel,
  buttonText = "Upload Image",
  maxSizeMB = 5,
  className = "",
  uploadType = "chat",
  chatId,
}: ImageUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuthStore()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit`)
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed")
      return
    }

    setError(null)
    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile || !user) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      let uploadResult

      // Upload to Firebase Storage based on upload type
      if (uploadType === "profile") {
        uploadResult = await uploadProfileImage(user.uid, selectedFile, (progress) => {
          setUploadProgress(progress)
        })
      } else if (uploadType === "chat" && chatId) {
        uploadResult = await uploadChatImage(chatId, user.uid, selectedFile, (progress) => {
          setUploadProgress(progress)
        })
      } else {
        // Fallback to local handling if Firebase upload isn't configured
        onImageSelect(selectedFile, previewUrl!)
        setIsUploading(false)
        return
      }

      if (uploadResult?.url) {
        // Pass both the file and the Firebase Storage URL
        onImageSelect(selectedFile, uploadResult.url)
      } else {
        // Fallback to local preview if Firebase upload fails
        onImageSelect(selectedFile, previewUrl!)
      }
    } catch (err: any) {
      console.error("Upload error:", err)
      setError(err.message || "Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (onCancel) onCancel()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {previewUrl ? (
        <div className="space-y-4">
          <div className="relative aspect-square w-full max-w-md mx-auto rounded-md overflow-hidden border border-gray-200">
            <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
          </div>

          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-center text-gray-500">Uploading... {uploadProgress.toFixed(0)}%</p>
            </div>
          )}

          <div className="flex justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isUploading}
              className="flex items-center"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className="flex items-center bg-rose-500 hover:bg-rose-600"
            >
              {isUploading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              {isUploading ? "Uploading..." : "Confirm"}
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <p className="text-sm font-medium mb-1">{buttonText}</p>
          <p className="text-xs text-gray-500 mb-4">Maximum file size: {maxSizeMB}MB</p>
          <Button type="button" variant="outline" size="sm">
            Select Image
          </Button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
      )}
    </div>
  )
}

// Specialized version for profile images
export function ProfileImageUploader(props: Omit<ImageUploaderProps, "uploadType">) {
  return <ImageUploader {...props} uploadType="profile" />
}
