import { pool } from "../db/postgres.js";

export async function createConversation() {
  const result = await pool.query(
    `
    insert into conversations (title)
    values ($1)
    returning *
    `,
    ["New Chat"]
  );

  return result.rows[0];
}

export async function getAllConversations() {
  const result = await pool.query(`
    select
      c.id,
      c.created_at,
      (
        select m.content
        from messages m
        where m.conversation_id = c.id
          and m.role = 'user'
        order by m.created_at asc
        limit 1
      ) as title
    from conversations c
    order by c.created_at desc
  `);

  return result.rows;
}
