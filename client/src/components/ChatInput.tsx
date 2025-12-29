import { useState } from "react";
import "../styles/ChatInput.css";

export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled: boolean;
}) {
  const [content, setContent] = useState("");

  function handleSubmit() {
    if (disabled) return;

    const trimmed = content.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setContent("");
  }

  return (
    <div className="chat-input">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={disabled ? "Sending..." : "Type a message..."}
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
      />
      <button onClick={handleSubmit} disabled={disabled}>
        Send
      </button>
    </div>
  );
}
