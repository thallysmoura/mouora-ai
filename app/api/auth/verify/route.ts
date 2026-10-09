import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { pool, ready } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { sendCode } from "@/lib/mail";

export async function POST(req: Request) {
  const { email, code, resend } = await req.json().catch(() => ({}));
  await ready();
  const r = await pool.query(
    "SELECT id, name, email, code_hash, code_expires, code_attempts FROM users WHERE lower(email)=lower($1) AND NOT email_verified",
    [String(email ?? "").trim()],
  );
  const u = r.rows[0];
  if (!u) return NextResponse.json({ error: "Cadastro não encontrado ou já verificado." }, { status: 404 });
  if (resend) {
    try {
      const sent = await sendCode("verify", { id: String(u.id), name: u.name, email: u.email });
      if (!sent) return NextResponse.json({ error: "Aguarde cerca de 1 minuto para pedir um novo código." }, { status: 429 });
    } catch (err) {
      console.error("[verify] falha ao enviar e-mail:", err);
      return NextResponse.json({ error: "Falha ao reenviar o e-mail." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  }
  if (!u.code_hash || !u.code_expires || new Date(u.code_expires) < new Date() || u.code_attempts >= 5)
    return NextResponse.json({ error: "Código expirado ou tentativas esgotadas. Peça um novo código." }, { status: 400 });
  const ok = await bcrypt.compare(String(code ?? "").trim(), u.code_hash);
  if (!ok) {
    await pool.query("UPDATE users SET code_attempts = code_attempts + 1 WHERE id=$1", [u.id]);
    return NextResponse.json({ error: "Código incorreto." }, { status: 400 });
  }
  await pool.query("UPDATE users SET email_verified=true, code_hash=NULL, code_expires=NULL WHERE id=$1", [u.id]);
  await createSession(String(u.id));
  return NextResponse.json({ ok: true });
}
