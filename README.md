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

## Estrutura
- `app/` rotas (início, login, cadastro, painel, Como funciona, Sobre, Contato, Termos, Privacidade) e API de autenticação
- `components/` telas e estilos
- `lib/` banco, sessão e e-mail
- `scripts/` utilitários (teste de e-mail, geração de imagens vetoriais)
