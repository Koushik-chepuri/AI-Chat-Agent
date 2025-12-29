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
