// Firebase Storage utilities
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage"
import { storage } from "./firebase"
import { updateUserProfile } from "./auth"

// Upload a profile image
export const uploadProfileImage = async (userId, file, onProgress) => {
  try {
    const fileExtension = file.name.split(".").pop()
    const fileName = `${userId}_${Date.now()}.${fileExtension}`
    const storageRef = ref(storage, `profile_images/${userId}/${fileName}`)

    // Upload the file with progress monitoring
    const uploadTask = uploadBytesResumable(storageRef, file)

    // Return a promise that resolves with the download URL when complete
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`Upload is ${progress}% done`)
          if (onProgress) onProgress(progress)
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error("Error uploading image:", error)
          reject(error)
        },
        async () => {
          // Handle successful uploads
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)

          // Update the user's profile with the new image URL
          await updateUserProfile({
            photoURL: downloadURL,
          })

          resolve({
            url: downloadURL,
            path: `profile_images/${userId}/${fileName}`,
          })
        },
      )
    })
  } catch (error) {
    console.error("Error in uploadProfileImage:", error)
    throw error
  }
}

// Upload a chat image
export const uploadChatImage = async (matchId, senderId, file, onProgress) => {
  try {
    const fileExtension = file.name.split(".").pop()
    const fileName = `${senderId}_${Date.now()}.${fileExtension}`
    const storageRef = ref(storage, `chat_images/${matchId}/${fileName}`)

    // Upload the file
    const uploadTask = uploadBytesResumable(storageRef, file)

    // Return a promise that resolves with the download URL when complete
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`Upload is ${progress}% done`)
          if (onProgress) onProgress(progress)
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error("Error uploading chat image:", error)
          reject(error)
        },
        async () => {
          // Handle successful uploads
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          resolve({
            url: downloadURL,
            path: `chat_images/${matchId}/${fileName}`,
          })
        },
      )
    })
  } catch (error) {
    console.error("Error in uploadChatImage:", error)
    throw error
  }
}

// Upload an audio message
export const uploadAudioMessage = async (matchId, senderId, file, onProgress) => {
  try {
    const fileExtension = file.name.split(".").pop() || "mp3"
    const fileName = `${senderId}_${Date.now()}.${fileExtension}`
    const storageRef = ref(storage, `chat_audio/${matchId}/${fileName}`)

    // Upload the file
    const uploadTask = uploadBytesResumable(storageRef, file)

    // Return a promise that resolves with the download URL when complete
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`Upload is ${progress}% done`)
          if (onProgress) onProgress(progress)
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error("Error uploading audio message:", error)
          reject(error)
        },
        async () => {
          // Handle successful uploads
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          resolve({
            url: downloadURL,
            path: `chat_audio/${matchId}/${fileName}`,
          })
        },
      )
    })
  } catch (error) {
    console.error("Error in uploadAudioMessage:", error)
    throw error
  }
}

// Delete an image
export const deleteImage = async (imagePath) => {
  try {
    const imageRef = ref(storage, imagePath)
    await deleteObject(imageRef)
    return { success: true }
  } catch (error) {
    console.error("Error deleting image:", error)
    throw error
  }
}
