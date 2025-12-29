import type { BackendMessage } from "../types/chat";
import "../styles/MessageBubble.css";

export function MessageBubble({ message }: { message: BackendMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`bubble-row ${isUser ? "right" : "left"}`}>
      <div className={`bubble ${isUser ? "bubble-user" : "bubble-ai"}`}>
        {message.content}
      </div>
    </div>
  );
}
