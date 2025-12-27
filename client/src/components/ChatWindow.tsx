import { useChat } from "../hooks/useChat";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import "../styles/ChatWindow.css";

export function ChatWindow() {
  const { messages, isSending, error, handleSend, bottomRef } = useChat();

  return (
    <div className="chat-window">
      <MessageList messages={messages} bottomRef={bottomRef} />

      {error && <div className="chat-error">{error}</div>}

      <ChatInput onSend={handleSend} disabled={isSending} />
    </div>
  );
}
