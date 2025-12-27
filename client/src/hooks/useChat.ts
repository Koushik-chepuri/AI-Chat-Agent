import { useEffect, useRef, useState } from "react";
import {
  createConversation,
  fetchMessages,
  sendMessage,
} from "../api/chat.api";
import type { Message } from "../types/chat";

export function useChat() {
  // 🔒 Session is the source of truth
  const storedConversationId = localStorage.getItem("conversationId");

  const [conversationId, setConversationId] = useState<string | null>(
    storedConversationId
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * 🔑 Create conversation ONCE per session
   * - Runs only on mount
   * - Guarded by localStorage
   * - Immune to StrictMode, re-renders, async timing
   */
  useEffect(() => {
    if (storedConversationId) return;

    async function initConversation() {
      try {
        const convo = await createConversation();
        localStorage.setItem("conversationId", convo.id);
        setConversationId(convo.id);
      } catch {
        setError("Failed to start conversation.");
      }
    }

    initConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Load history once conversationId is known
   */
  useEffect(() => {
    if (!conversationId) return;

    const id = conversationId; // freeze for TS + async safety

    async function loadHistory() {
      try {
        const history = await fetchMessages(id);
        setMessages(history);
      } catch {
        setError("Failed to load previous messages.");
      }
    }

    loadHistory();
  }, [conversationId]);

  async function handleSend(text: string) {
    if (!text.trim() || isSending) return;
    if (!conversationId) {
      setError("Conversation not ready. Please try again.");
      return;
    }

    setError(null);
    setIsSending(true);

    const optimisticUser: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticUser]);

    try {
      const res = await sendMessage(text, conversationId);
      setMessages((prev) => [...prev, res.assistant]);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  return {
    messages,
    isSending,
    error,
    handleSend,
    bottomRef,
    conversationId, // optional: useful for disabling input
  };
}
