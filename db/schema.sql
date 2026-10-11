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

  last_code_sent_at    TIMESTAMPTZ,

  -- perfil (configurações do painel)
  phone                   TEXT,
  locale                  TEXT,
  avatar_url              TEXT,  -- foto de perfil (Cloudinary)
  email_changed_at        TIMESTAMPTZ,  -- última troca de e-mail (só 1 por semana)
  avatar_public_id        TEXT,  -- mouora/<hash único>, usado para apagar a foto antiga
  -- troca de e-mail: novo endereço aguardando confirmação por código (hash)
  pending_email           TEXT,
  pending_email_hash      TEXT,
  pending_email_expires   TIMESTAMPTZ,
  pending_email_attempts  INT NOT NULL DEFAULT 0
);

-- e-mail único sem diferenciar maiúsculas/minúsculas
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON users (lower(email));

-- intervalo mínimo entre envios de código (por tipo e e-mail, ex.: "reset:fulano@x.com")
CREATE TABLE IF NOT EXISTS mail_throttle (
  key     TEXT PRIMARY KEY,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- contadores de limite de tentativas (login, cadastro, códigos)
CREATE TABLE IF NOT EXISTS rate_limit (
  key          TEXT PRIMARY KEY,
  count        INT         NOT NULL,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- controle de acesso (perfil e situação do usuário)
ALTER TABLE users ADD COLUMN IF NOT EXISTS role   TEXT NOT NULL DEFAULT 'user';    -- 'admin' | 'user'
ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';  -- 'pending' (aguardando liberação) | 'active' | 'suspended'
ALTER TABLE users ALTER COLUMN status SET DEFAULT 'pending';

-- log de acessos (login, falhas, cadastro...) com IP, dispositivo e localização aproximada
CREATE TABLE IF NOT EXISTS access_log (
  id            BIGSERIAL PRIMARY KEY,
  user_id       BIGINT,
  email         TEXT,
  event         TEXT NOT NULL,
  ip            TEXT,
  user_agent    TEXT,
  device_type   TEXT,
  browser       TEXT,
  os            TEXT,
  device_model  TEXT,
  country       TEXT,
  region        TEXT,
  city          TEXT,
  lat           DOUBLE PRECISION,
  lon           DOUBLE PRECISION,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS access_log_created_idx ON access_log (created_at DESC);
CREATE INDEX IF NOT EXISTS access_log_email_idx ON access_log (lower(email));
