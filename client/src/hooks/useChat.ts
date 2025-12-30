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

  const [thinkingByConversation, setThinkingByConversation] = useState<
    Record<string, boolean>
  >({});

  const pollingRef = useRef<string | null>(null);

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
  }, [messages, conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    const last = messages[messages.length - 1];
    if (!last || last.role !== "user") return;

    if (pollingRef.current === conversationId) return;

    pollingRef.current = conversationId;

    const interval = setInterval(async () => {
      const data = await fetchMessages(conversationId);
      setMessages(data);

      const updatedLast = data[data.length - 1];
      if (updatedLast?.role === "ai") {
        setThinkingByConversation((prev) => ({
          ...prev,
          [conversationId]: false,
        }));

        pollingRef.current = null;
        clearInterval(interval);
      }
    }, 1500);

    return () => {
      pollingRef.current = null;
      clearInterval(interval);
    };
  }, [conversationId, messages]);

  useEffect(() => {
    if (!conversationId) return;

    const last = messages[messages.length - 1];

    setThinkingByConversation((prev) => ({
      ...prev,
      [conversationId]: last?.role === "user",
    }));
  }, [conversationId, messages]);

  async function handleSend(text: string) {
    const content = text.trim();
    if (!content || !conversationId) return;

    setError(null);
    setIsSending(true);

    try {
      await sendMessage(conversationId, content);

      setThinkingByConversation((prev) => ({
        ...prev,
        [conversationId]: true,
      }));

      const data = await fetchMessages(conversationId);
      setMessages(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to send message");
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
    conversationId,
    setConversationId,

    isThinking:
      conversationId != null
        ? thinkingByConversation[conversationId] ?? false
        : false,

    resetConversation: () => {
      localStorage.removeItem("conversationId");
      setConversationId(null);
      setMessages([]);
    },
  };
}
