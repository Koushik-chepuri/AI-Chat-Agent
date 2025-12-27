import type { Message } from "../types/chat";
import "../styles/MessageBubble.css"

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.sender === "user";

  return (
    <div className={`message-bubble ${isUser ? "user" : "ai"}`}>
      {message.text}
    </div>
  );
}
