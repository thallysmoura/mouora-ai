import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { pool, ready } from "@/lib/db";

// Passo 2 da redefinição: valida o código recebido por e-mail e devolve um token de uso único (10 min)
// que autoriza a troca de senha no passo seguinte.
export async function POST(req: Request) {
  const { email, code } = await req.json().catch(() => ({}));
  const e = String(email ?? "").trim().toLowerCase();
  await ready();
  const r = await pool.query("SELECT id, reset_hash, reset_expires, reset_attempts FROM users WHERE lower(email)=$1", [e]);
  const u = r.rows[0];
  if (!u || !u.reset_hash || !u.reset_expires || new Date(u.reset_expires) < new Date() || u.reset_attempts >= 5)
    return NextResponse.json({ error: "Código expirado ou tentativas esgotadas. Peça um novo código." }, { status: 400 });
  const ok = await bcrypt.compare(String(code ?? "").trim(), u.reset_hash);
  if (!ok) {
    await pool.query("UPDATE users SET reset_attempts = reset_attempts + 1 WHERE id=$1", [u.id]);
    return NextResponse.json({ error: "Código incorreto." }, { status: 400 });
  }
  const token = crypto.randomBytes(24).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  await pool.query(
    "UPDATE users SET reset_hash=NULL, reset_expires=NULL, reset_attempts=0, reset_token_hash=$1, reset_token_expires=now()+interval '10 minutes' WHERE id=$2",
    [tokenHash, u.id],
  );
  return NextResponse.json({ ok: true, token });
}
