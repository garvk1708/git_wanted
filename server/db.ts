import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { getEnv } from "../shared/env";

const env = getEnv();

// Create connection
export const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql);
