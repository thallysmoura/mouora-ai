import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { pool, ready } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { sendEmailChangeCode, sendEmailChangedNotice } from "@/lib/mail";
import { checkPassword } from "@/lib/password";
import { clientIp, limited } from "@/lib/ratelimit";
import { normalizeEmail, validateEmail } from "@/lib/validation";

const LOCK_DAYS = 7;

// Troca de e-mail em duas etapas: "request" (senha atual + novo e-mail → código no novo endereço) e "confirm" (código).
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sessão expirada. Entre novamente." }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  const { action, email, password, code } = body as Record<string, unknown>;
  const blocked = await limited([[`acct-email:${user.id}`, 20, 3600], [`acct-email-day:${user.id}`, 6, 86400], [`acct-email-ip:${clientIp(req)}`, 40, 3600]]);
  if (blocked) return blocked;
  await ready();

  // Segurança: só 1 troca de e-mail por semana. Mais que isso é comportamento suspeito (conta sequestrada, abuso).
  const lock = await pool.query("SELECT GREATEST(0, CEIL(EXTRACT(EPOCH FROM (email_changed_at + interval '7 days' - now())) / 86400))::int AS days FROM users WHERE id=$1 AND email_changed_at > now() - interval '7 days'", [user.id]);
  if (lock.rows[0]) {
    const msg = "Não foi possível alterar o e-mail no momento. Tente novamente mais tarde.";
    return NextResponse.json({ error: msg, locked: true }, { status: 429 });
  }

  if (action === "request") {
    const err = validateEmail(email);
    if (err) return NextResponse.json({ error: err, fields: { email: err } }, { status: 400 });
    const e = normalizeEmail(email);
    if (e === user.email.toLowerCase()) return NextResponse.json({ error: "Este já é o seu e-mail atual.", fields: { email: "Este já é o seu e-mail atual." } }, { status: 400 });
    const row = await pool.query("SELECT password_hash FROM users WHERE id=$1", [user.id]);
    if (typeof password !== "string" || !(await checkPassword(password.slice(0, 1000), row.rows[0]?.password_hash)))
      return NextResponse.json({ error: "Senha atual incorreta.", fields: { password: "Senha atual incorreta." } }, { status: 400 });
    const taken = await pool.query("SELECT 1 FROM users WHERE lower(email)=$1 AND id<>$2", [e, user.id]);
    if (taken.rowCount) return NextResponse.json({ error: "E-mail já cadastrado.", fields: { email: "E-mail já cadastrado. Use outro." } }, { status: 409 });
    try {
      const r = await sendEmailChangeCode({ id: user.id, name: user.name }, e);
      if (!r.ok) return NextResponse.json({ error: `Aguarde ${r.wait}s para pedir um novo código.` }, { status: 429 });
    } catch (err2) {
      console.error("[account/email] falha ao enviar e-mail:", err2);
      return NextResponse.json({ error: "Não foi possível enviar o código. Tente novamente em instantes." }, { status: 502 });
    }
    return NextResponse.json({ ok: true, email: e });
  }

  if (action === "confirm") {
    const c = typeof code === "string" ? code.trim() : "";
    if (!/^\d{6}$/.test(c)) return NextResponse.json({ error: "Informe o código de 6 dígitos.", fields: { code: "Informe o código de 6 dígitos." } }, { status: 400 });
    const r = await pool.query("SELECT pending_email, pending_email_hash, pending_email_expires, pending_email_attempts FROM users WHERE id=$1", [user.id]);
    const u = r.rows[0];
    if (!u?.pending_email || !u.pending_email_hash || !u.pending_email_expires || new Date(u.pending_email_expires) < new Date() || u.pending_email_attempts >= 5)
      return NextResponse.json({ error: "Código expirado ou tentativas esgotadas. Peça um novo código." }, { status: 400 });
    if (!(await bcrypt.compare(c, u.pending_email_hash))) {
      await pool.query("UPDATE users SET pending_email_attempts = pending_email_attempts + 1 WHERE id=$1", [user.id]);
      return NextResponse.json({ error: "Código incorreto.", fields: { code: "Código incorreto." } }, { status: 400 });
    }
    try {
      await pool.query("UPDATE users SET email=pending_email, email_verified=true, email_changed_at=now(), pending_email=NULL, pending_email_hash=NULL, pending_email_expires=NULL, pending_email_attempts=0 WHERE id=$1", [user.id]);
    } catch (err) {
      if ((err as { code?: string }).code === "23505") return NextResponse.json({ error: "E-mail já cadastrado. Use outro." }, { status: 409 });
      throw err;
    }
    // avisa o endereço antigo (se alguém tomou a conta, o dono legítimo fica sabendo)
    sendEmailChangedNotice(user.email, user.name, u.pending_email).catch((err) => console.error("[account/email] aviso ao e-mail antigo falhou:", err));
    return NextResponse.json({ ok: true, email: u.pending_email });
  }

  return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
}
