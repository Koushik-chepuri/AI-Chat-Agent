import { pool } from "../db/postgres.js";

export async function createConversation() {
    const result = await pool.query(
        `
        insert into conversations default values
        returning *
        `
    );

    return result.rows[0];
}

