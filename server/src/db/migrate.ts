import fs from "fs";
import path from "path";
import { pool } from "./postgres.js";

async function runSchema() {
  const schemaPath = path.join(process.cwd(), "src/db/schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf-8");

  try {
    await pool.query(sql);
    console.log("Database schema applied successfully");
  } catch (err) {
    console.error("Failed to apply schema", err);
  } finally {
    await pool.end();
  }
}

runSchema();
