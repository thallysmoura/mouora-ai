import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { pool, ready } from "@/lib/db";
import { sendVerificationCode } from "@/lib/mail";
import { createSession } from "@/lib/auth";

const REQUIRE_VERIFY = process.env.REQUIRE_EMAIL_VERIFICATION === "true";

export async function POST(req: Request) {
  const { name, email, password } = await req.json().catch(() => ({}));
  const n = String(name ?? "").trim();
  const e = String(email ?? "").trim().toLowerCase();
  const p = String(password ?? "");
  if (n.length < 2 || n.length > 120 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e) || p.length < 8 || p.length > 200)
    return NextResponse.json({ error: "Dados inválidos. Verifique nome, e-mail e senha (mínimo 8 caracteres)." }, { status: 400 });
  await ready();
  const hash = await bcrypt.hash(p, 10);
  try {
    const ex = await pool.query("SELECT id, email_verified FROM users WHERE lower(email)=$1", [e]);
    let id: string;
    if (ex.rows[0] && !ex.rows[0].email_verified) {
      id = String(ex.rows[0].id);
      await pool.query("UPDATE users SET name=$1, password_hash=$2 WHERE id=$3", [n, hash, id]);
    } else {
      const r = await pool.query("INSERT INTO users (name, email, password_hash, email_verified) VALUES ($1,$2,$3,$4) RETURNING id", [n, e, hash, !REQUIRE_VERIFY]);
      id = String(r.rows[0].id);
    }
    if (!REQUIRE_VERIFY) {
      await pool.query("UPDATE users SET email_verified=true WHERE id=$1", [id]);
      await createSession(id);
      return NextResponse.json({ ok: true });
    }
    try {
      await sendVerificationCode(id, n, e);
    } catch (mailErr) {
      console.error("mail error", mailErr);
      return NextResponse.json({ error: "Não foi possível enviar o e-mail de verificação. Tente novamente em instantes." }, { status: 502 });
    }
    return NextResponse.json({ ok: true, verify: true, email: e });
  } catch (err) {
    if ((err as { code?: string }).code === "23505") return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 409 });
    throw err;
  }
}
