import { useState } from "react";
import "../styles/ChatInput.css";

export function ChatInput({ onSend, disabled }: { onSend: (text: string) => void; disabled: boolean }) {
    const [text, setText] = useState("");

    function handleSubmit() {
        if (!text.trim()) return;
        onSend(text);
        setText("");
    }

    return (
        <div className="chat-input">
        <input
            value={text}
            disabled={disabled}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Type your message…"
        />
        <button onClick={handleSubmit} disabled={disabled}>
            Send
        </button>
        </div>
    );
}
