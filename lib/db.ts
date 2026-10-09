import { Pool } from "pg";

const g = globalThis as unknown as { pool?: Pool; ready?: Promise<unknown> };
export const pool = (g.pool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 10 }));

export function ready() {
  return (g.ready ??= pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT false;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS code_hash TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS code_expires TIMESTAMPTZ;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS code_attempts INT NOT NULL DEFAULT 0;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_hash TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_expires TIMESTAMPTZ;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_attempts INT NOT NULL DEFAULT 0;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS last_code_sent_at TIMESTAMPTZ;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_hash TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMPTZ;
    CREATE TABLE IF NOT EXISTS mail_throttle (key TEXT PRIMARY KEY, sent_at TIMESTAMPTZ NOT NULL DEFAULT now());
    CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON users (lower(email));
  `));
}
