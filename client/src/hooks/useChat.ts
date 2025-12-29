import { useEffect, useRef, useState } from "react";
import { fetchMessages, sendMessage } from "../api/chat.api";
import type { BackendMessage } from "../types/chat";

export function useChat() {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const stored = localStorage.getItem("conversationId");
  const [conversationId, setConversationId] = useState<string | null>(
    stored && stored !== "null" ? stored : null
  );

  const [messages, setMessages] = useState<BackendMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    setError(null);

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

  async function handleSend(text: string) {
    const content = text.trim();
    if (!content) return;

    if (!conversationId) {
      setError("No active conversation");
      return;
    }

    setError(null);
    setIsSending(true);

    try {
      await sendMessage(conversationId, content);

      const data = await fetchMessages(conversationId);
      setMessages(data);

      setIsThinking(true);
    } catch {
      setError("Failed to send message");
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
