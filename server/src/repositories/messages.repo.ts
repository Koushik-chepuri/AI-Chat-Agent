import { pool } from "../db/postgres.js";

export async function saveMessage(
  conversationId: string,
  role: "user" | "ai",
  content: string
) {
  const result = await pool.query(
    `
        insert into messages (conversation_id, role, content)
        values ($1, $2, $3)
        returning *
        `,
    [conversationId, role, content]
  );
  
  if (role === "user") {
    await pool.query(
      `
      update conversations
      set title = left($1, 50)
      where id = $2
        and title = 'New Chat'
      `,
      [content, conversationId]
    );
  }

  return result.rows[0];
}

export async function getMessagesByConversation(conversationId: string) {
  const result = await pool.query(
    `
    select *
    from messages
    where conversation_id = $1
    order by created_at asc
    `,
    [conversationId]
  );

  return result.rows;
}
