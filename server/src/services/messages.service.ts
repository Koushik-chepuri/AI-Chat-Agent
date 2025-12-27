import {
  saveMessage,
  getMessagesByConversation,
} from "../repositories/messages.repo.js";

import { getLLMService } from "./llm/index.js";
import type { LLMMessage } from "./llm/llm.interface.js";

/**
 * Phase 1 (critical path): Save user message fast.
 * This must succeed quickly or fail clearly.
 */
export async function createUserMessageService(
  conversationId: string,
  content: string
) {
  if (!conversationId || !content) {
    throw new Error("Invalid message payload");
  }

  return saveMessage(conversationId, "user", content);
}

/**
 * Phase 2 (best-effort): Generate assistant reply and save it.
 * This should NEVER cause the original POST /messages request to fail.
 */
export async function generateAssistantReplyService(
  conversationId: string,
  latestUserContent: string
) {
  if (!conversationId || !latestUserContent) return;

  const history = await getMessagesByConversation(conversationId);

  // 🔒 SAFETY: generate only once per user message
  const last = history[history.length - 1];
  if (!last || last.role !== "user") return;

  /**
   * CRITICAL CHANGE:
   * - Keep ONLY assistant messages as context
   * - DROP all previous user messages
   */
  const assistantContext: LLMMessage[] = history
    .slice(0, -1) // exclude current user message
    .filter((m) => m.role === "assistant")
    .map((m) => ({
      role: "assistant",
      content: m.content,
    }));

  const llm = await getLLMService();

  const reply = await llm.generateReply(assistantContext, latestUserContent);

  await saveMessage(conversationId, "assistant", reply);
}

export async function getMessagesByConversationService(conversationId: string) {
  if (!conversationId) {
    throw new Error("Conversation id required");
  }

  return getMessagesByConversation(conversationId);
}
