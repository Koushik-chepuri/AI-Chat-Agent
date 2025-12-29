import { api } from "./axios";
import type { BackendMessage, BackendConversation } from "../types/chat";

export async function sendMessage(conversationId: string, content: string) {
  const res = await api.post("/messages", { conversationId, content });
  return res.data as { user: BackendMessage };
}

export async function fetchMessages(
  conversationId: string
): Promise<BackendMessage[]> {
  const res = await api.get(`/conversations/${conversationId}/messages`);
  return res.data;
}

export async function createConversation(): Promise<BackendConversation> {
  const res = await api.post("/conversations");
  return res.data;
}

export async function fetchConversations(): Promise<BackendConversation[]> {
  const res = await api.get("/conversations");
  return res.data;
}
