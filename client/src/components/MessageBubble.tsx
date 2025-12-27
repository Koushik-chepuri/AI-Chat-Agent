import type { Message } from "../types/chat";
import "../styles/MessageBubble.css";

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.sender === "user";

  return (
    <div className={`bubble-row ${isUser ? "right" : "left"}`}>
      <div className={`bubble ${isUser ? "bubble-user" : "bubble-ai"}`}>
        {message.text}
      </div>
    </div>
  );
}
    