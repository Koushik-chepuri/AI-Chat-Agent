import { useState, useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat";
import { Sidebar } from "./Sidebar";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import type { BackendConversation } from "../types/chat";
import { fetchConversations, createConversation } from "../api/chat.api";
import "../styles/ChatWindow.css";

export function ChatWindow() {
  const {
    messages,
    isSending,
    isThinking,
    error,
    handleSend,
    bottomRef,
    conversationId,
    setConversationId,
    resetConversation,
  } = useChat();

  const [conversations, setConversations] = useState<BackendConversation[]>([]);
  const [loadingConvos, setLoadingConvos] = useState(true);

  const hasAutoCreatedRef = useRef(false);

  // Load conversations
  useEffect(() => {
    fetchConversations()
      .then(setConversations)
      .finally(() => setLoadingConvos(false));
  }, []);

  useEffect(() => {
    if (loadingConvos) return;
    if (hasAutoCreatedRef.current) return;

    const exists =
      conversationId && conversations.some((c) => c.id === conversationId);

    if (conversations.length === 0 || !exists) {
      hasAutoCreatedRef.current = true;

      (async () => {
        const convo = await createConversation();

        setConversations([convo]);
        setConversationId(convo.id);
        localStorage.setItem("conversationId", convo.id);
      })();
    }
  }, [loadingConvos, conversations, conversationId]);

  async function handleNewChat() {
    resetConversation();

    const convo = await createConversation();

    setConversations((prev) => [convo, ...prev]);
    setConversationId(convo.id);
    localStorage.setItem("conversationId", convo.id);
  }

  function handleSelectConversation(id: string) {
    localStorage.setItem("conversationId", id);
    setConversationId(id);
  }

  async function handleSendAndSync(text: string) {
    await handleSend(text);

    const updated = await fetchConversations();
    setConversations(updated);
  }

  return (
    <div className="chat-layout">
      <Sidebar
        conversations={conversations}
        activeConversationId={conversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        loading={loadingConvos}
      />

      <div className="chat-main">
        <div className="chat-content">
          <MessageList
            messages={messages}
            bottomRef={bottomRef}
            isThinking={isThinking}
          />

          {error && <div className="chat-error">{error}</div>}

          <ChatInput
            onSend={handleSendAndSync}
            disabled={!conversationId || isSending || isThinking}
          />
        </div>
      </div>
    </div>
  );

}
