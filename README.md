# MOUORA AI

Site e painel da MOUORA AI (Next.js 16 + PostgreSQL).

## Como rodar

```bash
cp .env.example .env.local      # preencha AUTH_SECRET e SMTP_*
docker compose up -d            # Postgres 17 na porta 5433
npm install
npx next dev -p 3100
```

Abra http://localhost:3100. Teste o envio de e-mail com `node scripts/test-mail.js seu@email.com`.

## Banco de dados

- PostgreSQL 17 (alpine) via `docker-compose.yml`, porta `5433`, volume `mouora_pgdata`.
- O schema está em [`db/schema.sql`](db/schema.sql) e é aplicado automaticamente na **primeira** subida do contêiner (volume vazio).
- A aplicação também garante o schema de forma idempotente (`lib/db.ts`), então um banco já existente é atualizado sozinho.
- Para recriar do zero: `docker compose down -v && docker compose up -d` (apaga os dados).
- Variáveis opcionais: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT` (mantenha o `DATABASE_URL` do `.env.local` igual).

## Estrutura
- `app/` rotas (início, login, cadastro, painel, Como funciona, Sobre, Contato, Termos, Privacidade) e API de autenticação
- `components/` telas e estilos
- `db/` schema SQL do PostgreSQL
- `lib/` banco, sessão e e-mail
- `scripts/` utilitários (teste de e-mail, geração de imagens vetoriais)
