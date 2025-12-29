import { useState, useEffect } from "react";
import { useChat } from "../hooks/useChat";
import { Sidebar } from "./Sidebar";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import type { BackendConversation } from "../types/chat";
import { fetchConversations } from "../api/chat.api";
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

  const [refreshKey, setRefreshKey] = useState(0);
  const [conversations, setConversations] = useState<BackendConversation[]>([]);
  const [loadingConvos, setLoadingConvos] = useState(true);

  useEffect(() => {
    fetchConversations()
      .then(setConversations)
      .finally(() => setLoadingConvos(false));
  }, []);

  function handleNewChat() {
    resetConversation();
    setRefreshKey((k) => k + 1);
  }

  function handleSelectConversation(id: string) {
    localStorage.setItem("conversationId", id);
    setConversationId(id);
  }

  async function handleSendAndRefreshSidebar(text: string) {
    const isFirstMessage = messages.length === 0;

    const convo = await handleSend(text);

    if (isFirstMessage && convo) {
      setConversations((prev) => [convo, ...prev]);
    }
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
        <MessageList
          messages={messages}
          bottomRef={bottomRef}
          isThinking={isThinking}
        />

        {error && <div className="chat-error">{error}</div>}

        <ChatInput
          onSend={handleSendAndRefreshSidebar}
          disabled={isSending || isThinking}
        />
      </div>
    </div>
  );
}
