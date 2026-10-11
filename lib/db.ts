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
    ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS locale TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS email_changed_at TIMESTAMPTZ;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_public_id TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS pending_email TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS pending_email_hash TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS pending_email_expires TIMESTAMPTZ;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS pending_email_attempts INT NOT NULL DEFAULT 0;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';
    ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
    ALTER TABLE users ALTER COLUMN status SET DEFAULT 'pending';
    CREATE TABLE IF NOT EXISTS access_log (
      id BIGSERIAL PRIMARY KEY, user_id BIGINT, email TEXT, event TEXT NOT NULL, ip TEXT, user_agent TEXT,
      device_type TEXT, browser TEXT, os TEXT, device_model TEXT, country TEXT, region TEXT, city TEXT, lat DOUBLE PRECISION, lon DOUBLE PRECISION,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS access_log_created_idx ON access_log (created_at DESC);
    CREATE INDEX IF NOT EXISTS access_log_email_idx ON access_log (lower(email));
    CREATE TABLE IF NOT EXISTS mail_throttle (key TEXT PRIMARY KEY, sent_at TIMESTAMPTZ NOT NULL DEFAULT now());
    CREATE TABLE IF NOT EXISTS rate_limit (key TEXT PRIMARY KEY, count INT NOT NULL, window_start TIMESTAMPTZ NOT NULL DEFAULT now());
    CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON users (lower(email));
  `));
}
