import type { Message } from "../types/chat";
import { MessageBubble } from "./MessageBubble";
import "../styles/MessageList.css";

export function MessageList({
  messages,
  bottomRef,
}: {
  messages: Message[];
  bottomRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="message-list">
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
