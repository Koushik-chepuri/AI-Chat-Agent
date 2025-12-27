import type React from "react";
import type { Message } from "../types/chat";
import { MessageBubble } from "./MessageBubble";
import "../styles/MessageList.css";

export function MessageList({
  messages,
  bottomRef,
  isThinking,
}: {
  messages: Message[];
  bottomRef: React.RefObject<HTMLDivElement | null>;
  isThinking: boolean;
}) {
  return (
    <div className="message-list">
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} />
      ))}

      {isThinking && (
        <div className="thinking-row">
          <div className="bubble bubble-ai">Agent is replying…</div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
