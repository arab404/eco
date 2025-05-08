"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle } from "lucide-react"

export function AuthSuccessToast() {
  const { successMessage, clearSuccessMessage } = useAuthStore()
  const { toast } = useToast()

  useEffect(() => {
    if (successMessage) {
      toast({
        title: "Success",
        description: successMessage,
        variant: "default",
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      })

      // Clear the success message after showing toast
      setTimeout(() => {
        clearSuccessMessage()
      }, 100)
    }
  }, [successMessage, toast, clearSuccessMessage])

  return null
}
