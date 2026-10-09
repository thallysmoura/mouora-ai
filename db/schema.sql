-- Schema do PostgreSQL da MOUORA AI.
-- Executado automaticamente na primeira subida do contêiner (docker-entrypoint-initdb.d)
-- e também mantido de forma idempotente pela aplicação (lib/db.ts → ready()).

CREATE TABLE IF NOT EXISTS users (
  id                   BIGSERIAL PRIMARY KEY,
  name                 TEXT        NOT NULL,
  email                TEXT        NOT NULL,
  password_hash        TEXT        NOT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- verificação de e-mail (código de 6 dígitos, guardado como hash)
  email_verified       BOOLEAN     NOT NULL DEFAULT false,
  code_hash            TEXT,
  code_expires         TIMESTAMPTZ,
  code_attempts        INT         NOT NULL DEFAULT 0,

  -- recuperação de senha: código (hash) e token de uso único (hash) emitido após validar o código
  reset_hash           TEXT,
  reset_expires        TIMESTAMPTZ,
  reset_attempts       INT         NOT NULL DEFAULT 0,
  reset_token_hash     TEXT,
  reset_token_expires  TIMESTAMPTZ,

  last_code_sent_at    TIMESTAMPTZ
);

-- e-mail único sem diferenciar maiúsculas/minúsculas
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON users (lower(email));

-- intervalo mínimo entre envios de código (por tipo e e-mail, ex.: "reset:fulano@x.com")
CREATE TABLE IF NOT EXISTS mail_throttle (
  key     TEXT PRIMARY KEY,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
