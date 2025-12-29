import {
  saveMessage,
  getMessagesByConversation,
} from "../repositories/messages.repo.js";

import { getLLMService } from "./llm/index.js";
import type { LLMMessage } from "./llm/llm.interface.js";


export async function createUserMessageService(
  conversationId: string,
  content: string
) {
  if (!conversationId || !content) {
    throw new Error("Invalid message payload");
  }

  return saveMessage(conversationId, "user", content);
}

export async function generateAssistantReplyService(
  conversationId: string,
  latestUserContent: string
) {
  if (!conversationId || !latestUserContent) return;

  const history = await getMessagesByConversation(conversationId);

  // multiple inp guard
  const last = history[history.length - 1];
  if (!last || last.role !== "user") return;

  const aiContext: LLMMessage[] = history
    .slice(0, -1)
    .filter((m) => m.role === "ai")
    .map((m) => ({
      role: "ai",
      content: m.content,
    }));

  const llm = await getLLMService();

  const reply = await llm.generateReply(aiContext, latestUserContent);

  await saveMessage(conversationId, "ai", reply);
}

export async function getMessagesByConversationService(conversationId: string) {
  if (!conversationId) {
    throw new Error("Conversation id required");
  }

  return getMessagesByConversation(conversationId);
}
