import { useEffect, useRef, useState } from "react";
import {
  createConversation,
  fetchMessages,
  sendMessage,
} from "../api/chat.api";
import type { BackendMessage, BackendConversation } from "../types/chat";

export function useChat() {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [conversationId, setConversationId] = useState<string | null>(
    localStorage.getItem("conversationId")
  );

  const [messages, setMessages] = useState<BackendMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (!conversationId) return;

    fetchMessages(conversationId)
      .then(setMessages)
      .catch(() => setError("Failed to load messages"));
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  useEffect(() => {
    if (!conversationId || !isThinking) return;

    const interval = setInterval(async () => {
      try {
        const data = await fetchMessages(conversationId);
        setMessages(data);

        const last = data[data.length - 1];
        if (last?.role === "ai") {
          setIsThinking(false);
        }
      } catch {}
    }, 1000);

    return () => clearInterval(interval);
  }, [conversationId, isThinking]);

  async function ensureConversation(): Promise<BackendConversation> {
    if (conversationId) {
      return { id: conversationId } as BackendConversation;
    }

    const convo = await createConversation();
    localStorage.setItem("conversationId", convo.id);
    setConversationId(convo.id);
    return convo;
  }

  async function handleSend(text: string) {
    const content = text.trim();
    if (!content) return;

    setError(null);
    setIsSending(true);

    try {
      const convo = await ensureConversation();

      await sendMessage(convo.id, content);

      const data = await fetchMessages(convo.id);
      setMessages(data);

      setIsThinking(true);

      return convo;
    } catch {
      setError("Failed to send message");
      return null;
    } finally {
      setIsSending(false);
    }
  }

  return {
    messages,
    isSending,
    isThinking,
    error,
    handleSend,
    bottomRef,
    conversationId,
    setConversationId,
    resetConversation: () => {
      localStorage.removeItem("conversationId");
      setConversationId(null);
      setMessages([]);
    },
  };
}
