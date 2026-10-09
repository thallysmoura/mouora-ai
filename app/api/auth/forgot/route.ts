import { NextResponse } from "next/server";
import { pool, ready } from "@/lib/db";
import { allowSend, sendCode } from "@/lib/mail";

// Resposta sempre genérica: não revela se o e-mail existe.
export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}));
  const e = String(email ?? "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
  await ready();
  // Intervalo mínimo aplicado antes de consultar a conta: a resposta é idêntica exista ou não o e-mail.
  const gate = await allowSend("reset", e);
  if (!gate.ok) return NextResponse.json({ ok: true, throttled: true, wait: gate.wait });
  const r = await pool.query("SELECT id, name, email FROM users WHERE lower(email)=$1 AND email_verified", [e]);
  const u = r.rows[0];
  if (u) {
    try {
      await sendCode("reset", { id: String(u.id), name: u.name, email: u.email }, { skipThrottle: true });
    } catch (err) {
      console.error("[forgot] falha ao enviar e-mail:", err);
    }
  }
  return NextResponse.json({ ok: true });
}
