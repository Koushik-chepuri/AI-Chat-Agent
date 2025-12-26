import { saveMessage, getMessagesByConversation } from "../repositories/messages.repo.js";
import { getLLMService } from "./llm/index.js";
import type { LLMMessage } from "./llm/llm.interface.js";

export async function createUserMessageAndReplyService(
  conversationId: string,
  content: string
) {
  if (!conversationId || !content) {
    throw new Error("Invalid message payload");
  }

  // 1️⃣ Save user message
  const userMessage = await saveMessage(conversationId, "user", content);

  // 2️⃣ Load conversation history
  const history = await getMessagesByConversation(conversationId);

  // Exclude the last user message to avoid duplication
  const llmHistory: LLMMessage[] = history
    .slice(0, -1)
    .map(m => ({
      role: m.role,
      content: m.content
    }));

  // 3️⃣ Call LLM
  let assistantReply: string;

    try {
        const llm = await getLLMService();
        assistantReply = await llm.generateReply(llmHistory, content);
    } catch (err) {
        throw new Error("AI service is temporarily unavailable. Please try again.");
    }

  // 4️⃣ Save assistant message
  const assistantMessage = await saveMessage(
    conversationId,
    "assistant",
    assistantReply
  );

  return {
    user: userMessage,
    assistant: assistantMessage
  };
}

export async function getMessagesByConversationService(conversationId: string) {
  if (!conversationId) {
    throw new Error("Conversation id required");
  }

  return getMessagesByConversation(conversationId);
}
