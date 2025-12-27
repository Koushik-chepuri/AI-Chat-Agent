import { api } from "./axios";
import type { Message } from "../types/chat";

// Backend message shape
type BackendMessage = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

// Helper: normalize backend → frontend
function normalizeMessage(m: BackendMessage): Message {
  return {
    id: m.id,
    sender: m.role === "assistant" ? "ai" : "user",
    text: m.content,
    timestamp: m.created_at,
  };
}

// Create new conversation
export async function createConversation(): Promise<{ id: string }> {
  const res = await api.post("/conversations");
  return res.data;
}

// Send message
export async function sendMessage(
  content: string,
  conversationId: string
): Promise<{ assistant: Message }> {
  const res = await api.post("/messages", {
    content,
    conversationId,
  });

  return {
    assistant: normalizeMessage(res.data.assistant),
  };
}

// Fetch conversation history
export async function fetchMessages(
  conversationId: string
): Promise<Message[]> {
  const res = await api.get(`/conversations/${conversationId}/messages`);

  return res.data.map(normalizeMessage);
}
