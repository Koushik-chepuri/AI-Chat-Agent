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
        c.title
    from conversations c
    order by c.created_at desc;
  `);

  return result.rows;
}
