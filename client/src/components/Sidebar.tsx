import "../styles/Sidebar.css";
import type { BackendConversation } from "../types/chat";

function formatTitle(title: string | null) {
  const t = (title ?? "").trim();
  if (!t) return "New chat";
  return t.length > 50 ? t.slice(0, 50) + "…" : t;
}

type props = {
  conversations: BackendConversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  loading?: boolean;
};

export function Sidebar({
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
  loading = false,
}: props) {
  return (
    <aside className="sidebar">
      <button className="new-chat-btn" onClick={onNewChat}>
        + New Chat
      </button>

      <div className="conversation-list">
        {loading ? (
          <div className="sidebar-muted">Loading…</div>
        ) : conversations.length === 0 ? (
          <div className="sidebar-muted">No chats yet</div>
        ) : (
          conversations.map((c) => (
            <button
              key={c.id}
              className={`conversation-item ${
                c.id === activeConversationId ? "active" : "not-active"
              }`}
              onClick={() => onSelectConversation(c.id)}
              title={c.title ?? "New chat"}
            >
              {formatTitle(c.title)}
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
