import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { getEnv } from "../shared/env";

const env = getEnv();

// Destructure Pool from the default export
const { Pool } = pg;

// Create a PostgreSQL connection pool without SSL
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

// Initialize drizzle with the pool
export const db = drizzle(pool);

export async function getUserById(userId: number) {
  const query = "SELECT * FROM users WHERE id = $1";
  const values = [userId];

  const result = await pool.query(query, values);
  return result.rows[0];
}
