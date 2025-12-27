import { api } from "./axios";
import type { Message } from "../types/chat";

type BackendConversation = {
  id: string;
  created_at: string;
};

type BackendMessage = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
};

function normalizeMessage(m: BackendMessage): Message {
  return {
    id: m.id,
    sender: m.role === "assistant" ? "ai" : "user",
    text: m.content,
    timestamp: m.created_at,
  };
}

export async function createConversation(): Promise<BackendConversation> {
  const res = await api.post("/conversations");
  return res.data;
}

/**
 * Backend now returns: { user: <saved user message> }
 */
export async function sendMessage(conversationId: string, content: string) {
  const res = await api.post("/messages", { conversationId, content });
  return res.data as { user: BackendMessage };
}

export async function fetchMessages(
  conversationId: string
): Promise<Message[]> {
  const res = await api.get(`/conversations/${conversationId}/messages`);
  return (res.data as BackendMessage[]).map(normalizeMessage);
}
