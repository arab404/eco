// Firestore database utilities
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  onSnapshot,
  addDoc,
} from "firebase/firestore"
import { db } from "./firebase"

// User profile operations
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId))
    if (userDoc.exists()) {
      return { ...userDoc.data(), id: userDoc.id }
    }
    return null
  } catch (error) {
    console.error("Error getting user profile:", error)
    throw error
  }
}

export const updateUserProfile = async (userId, data) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      ...data,
      updatedAt: serverTimestamp(),
    })
    return { success: true }
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

// User matching operations
export const getUserMatches = async (userId) => {
  try {
    const matchesQuery = query(
      collection(db, "matches"),
      where("participants", "array-contains", userId),
      orderBy("createdAt", "desc"),
    )

    const matchesSnapshot = await getDocs(matchesQuery)
    const matches = []

    for (const matchDoc of matchesSnapshot.docs) {
      const matchData = matchDoc.data()
      const otherUserId = matchData.participants.find((id) => id !== userId)

      // Get the other user's profile
      const otherUserDoc = await getDoc(doc(db, "users", otherUserId))

      if (otherUserDoc.exists()) {
        matches.push({
          id: matchDoc.id,
          ...matchData,
          otherUser: {
            id: otherUserDoc.id,
            ...otherUserDoc.data(),
          },
        })
      }
    }

    return matches
  } catch (error) {
    console.error("Error getting user matches:", error)
    throw error
  }
}

export const createMatch = async (user1Id, user2Id) => {
  try {
    // Check if a match already exists
    const matchesQuery = query(collection(db, "matches"), where("participants", "array-contains", user1Id))

    const matchesSnapshot = await getDocs(matchesQuery)
    const existingMatch = matchesSnapshot.docs.find((doc) => doc.data().participants.includes(user2Id))

    if (existingMatch) {
      return { id: existingMatch.id, ...existingMatch.data() }
    }

    // Create a new match
    const newMatchRef = await addDoc(collection(db, "matches"), {
      participants: [user1Id, user2Id],
      createdAt: serverTimestamp(),
      lastActivity: serverTimestamp(),
    })

    return { id: newMatchRef.id, participants: [user1Id, user2Id] }
  } catch (error) {
    console.error("Error creating match:", error)
    throw error
  }
}

// Chat messages operations
export const getMessages = async (matchId, lastMessageTimestamp = null, messageLimit = 20) => {
  try {
    let messagesQuery

    if (lastMessageTimestamp) {
      messagesQuery = query(
        collection(db, "matches", matchId, "messages"),
        orderBy("createdAt", "desc"),
        startAfter(lastMessageTimestamp),
        limit(messageLimit),
      )
    } else {
      messagesQuery = query(
        collection(db, "matches", matchId, "messages"),
        orderBy("createdAt", "desc"),
        limit(messageLimit),
      )
    }

    const messagesSnapshot = await getDocs(messagesQuery)
    return messagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting messages:", error)
    throw error
  }
}

export const sendMessage = async (matchId, senderId, message) => {
  try {
    // Add the message to the match's messages subcollection
    const messageRef = await addDoc(collection(db, "matches", matchId, "messages"), {
      senderId,
      text: message.text,
      type: message.type || "text",
      mediaUrl: message.mediaUrl || null,
      createdAt: serverTimestamp(),
      read: false,
    })

    // Update the match's last activity
    await updateDoc(doc(db, "matches", matchId), {
      lastActivity: serverTimestamp(),
      lastMessage: {
        text: message.text,
        senderId,
        type: message.type || "text",
      },
    })

    return { id: messageRef.id, senderId, ...message }
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
}

export const subscribeToMessages = (matchId, callback) => {
  const messagesQuery = query(collection(db, "matches", matchId, "messages"), orderBy("createdAt", "desc"), limit(50))

  return onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    callback(messages)
  })
}

// User discovery operations
export const discoverUsers = async (currentUserId, preferences, lastUserId = null, userLimit = 10) => {
  try {
    // Build a query based on user preferences
    let usersQuery = query(collection(db, "users"), where("uid", "!=", currentUserId))

    // Add filters based on preferences
    if (preferences.gender) {
      usersQuery = query(usersQuery, where("gender", "==", preferences.gender))
    }

    if (preferences.ageRange) {
      // This is simplified - in a real app, you'd calculate date ranges based on age
      usersQuery = query(usersQuery, where("age", ">=", preferences.ageRange.min))
      usersQuery = query(usersQuery, where("age", "<=", preferences.ageRange.max))
    }

    // Add pagination
    if (lastUserId) {
      const lastUserDoc = await getDoc(doc(db, "users", lastUserId))
      usersQuery = query(usersQuery, startAfter(lastUserDoc))
    }

    usersQuery = query(usersQuery, limit(userLimit))

    const usersSnapshot = await getDocs(usersQuery)
    return usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error discovering users:", error)
    throw error
  }
}
