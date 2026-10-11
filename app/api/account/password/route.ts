import { NextResponse } from "next/server";
import { pool, ready } from "@/lib/db";
import { createSession, currentUser } from "@/lib/auth";
import { checkPassword, hashPassword } from "@/lib/password";
import { clientIp, limited } from "@/lib/ratelimit";
import { validatePassword } from "@/lib/validation";

// Troca de senha com a senha atual. A sessão é reemitida (o cookie antigo deixa de valer junto com a senha antiga).
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sessão expirada. Entre novamente." }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  const { current, password, confirm } = body as Record<string, unknown>;
  const blocked = await limited([[`acct-pass:${user.id}`, 8, 900], [`acct-pass-ip:${clientIp(req)}`, 30, 900]]);
  if (blocked) return blocked;

  const fields: Record<string, string> = {};
  const perr = validatePassword(password, user.email);
  if (perr) fields.password = perr;
  else if (password === current) fields.password = "A nova senha deve ser diferente da atual.";
  if (typeof confirm !== "string" || !confirm) fields.confirm = "Confirme a nova senha.";
  else if (confirm !== password) fields.confirm = "As senhas não coincidem.";
  if (typeof current !== "string" || !current) fields.current = "Informe a senha atual.";
  if (Object.keys(fields).length) return NextResponse.json({ error: Object.values(fields)[0], fields }, { status: 400 });

  await ready();
  const row = await pool.query("SELECT password_hash FROM users WHERE id=$1", [user.id]);
  if (!(await checkPassword((current as string).slice(0, 1000), row.rows[0]?.password_hash)))
    return NextResponse.json({ error: "Senha atual incorreta.", fields: { current: "Senha atual incorreta." } }, { status: 400 });

  await pool.query("UPDATE users SET password_hash=$1, reset_hash=NULL, reset_expires=NULL, reset_token_hash=NULL, reset_token_expires=NULL WHERE id=$2", [await hashPassword(password as string), user.id]);
  await createSession(user.id, true);
  return NextResponse.json({ ok: true });
}
