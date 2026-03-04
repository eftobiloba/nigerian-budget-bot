import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from "firebase/firestore"

export interface ConversationMessage {
  id?: string
  userID: string
  role: "user" | "assistant"
  content: string
  timestamp: Timestamp | Date
  uploadedFile?: string | null
}

const CONVERSATIONS_COLLECTION = "conversations"

/**
 * Store a message in Firestore for conversation history
 */
export async function storeMessage(
  userID: string,
  role: "user" | "assistant",
  content: string,
  uploadedFile?: string | null
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, CONVERSATIONS_COLLECTION), {
      userID,
      role,
      content,
      timestamp: Timestamp.now(),
      uploadedFile: uploadedFile || null,
    })
    return docRef.id
  } catch (error) {
    console.error("Error storing message:", error)
    throw error
  }
}

/**
 * Retrieve conversation history for a user
 */
export async function getConversationHistory(
  userID: string,
  messageLimit: number = 20
): Promise<ConversationMessage[]> {
  try {
    const q = query(
      collection(db, CONVERSATIONS_COLLECTION),
      where("userID", "==", userID),
      orderBy("timestamp", "asc"),
      limit(messageLimit)
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as ConversationMessage))
  } catch (error) {
    console.error("Error retrieving conversation history:", error)
    // Return empty array if collection doesn't exist yet
    return []
  }
}

/**
 * Convert conversation history to Gemini message format
 */
export function formatMessagesForGemini(
  messages: ConversationMessage[]
): Array<{ role: string; parts: Array<{ text: string }> }> {
  return messages.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }))
}
