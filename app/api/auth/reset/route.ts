import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { pool, ready } from "@/lib/db";
import { createSession } from "@/lib/auth";

// Passo 3: define a nova senha usando o token emitido após a validação do código.
export async function POST(req: Request) {
  const { email, token, password } = await req.json().catch(() => ({}));
  const e = String(email ?? "").trim().toLowerCase();
  const p = String(password ?? "");
  if (p.length < 8 || p.length > 200) return NextResponse.json({ error: "A senha deve ter pelo menos 8 caracteres." }, { status: 400 });
  await ready();
  const r = await pool.query("SELECT id, reset_token_hash, reset_token_expires FROM users WHERE lower(email)=$1", [e]);
  const u = r.rows[0];
  const given = crypto.createHash("sha256").update(String(token ?? "")).digest("hex");
  const valid =
    u && u.reset_token_hash && u.reset_token_expires && new Date(u.reset_token_expires) > new Date() &&
    crypto.timingSafeEqual(Buffer.from(given), Buffer.from(u.reset_token_hash));
  if (!valid) return NextResponse.json({ error: "Sessão de redefinição expirada. Peça um novo código." }, { status: 400 });
  const hash = await bcrypt.hash(p, 10);
  await pool.query(
    "UPDATE users SET password_hash=$1, reset_token_hash=NULL, reset_token_expires=NULL, reset_hash=NULL, reset_expires=NULL, email_verified=true WHERE id=$2",
    [hash, u.id],
  );
  await createSession(String(u.id), true);
  return NextResponse.json({ ok: true });
}
