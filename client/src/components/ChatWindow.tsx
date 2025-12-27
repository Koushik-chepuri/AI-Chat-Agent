import { useChat } from "../hooks/useChat";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import "../styles/ChatWindow.css";

export function ChatWindow() {
  const { messages, isSending, isThinking, error, handleSend, bottomRef } =
    useChat();

  return (
    <div className="chat-window">
      <MessageList
        messages={messages}
        bottomRef={bottomRef}
        isThinking={isThinking}
      />

      {error && <div className="chat-error">{error}</div>}

      <ChatInput onSend={handleSend} disabled={isSending || isThinking} />
    </div>
  );
}
