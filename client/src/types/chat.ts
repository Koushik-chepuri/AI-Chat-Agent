export type BackendMessage = {
  id: string;
  conversation_id: string;
  role: "user" | "ai";
  content: string;
  created_at: string;
};

export type BackendConversation = {
  id: string;
  title: string | null;
  created_at: string;
};
