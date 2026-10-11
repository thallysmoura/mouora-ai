import { NextResponse } from "next/server";
import { pool, ready } from "@/lib/db";
import { allowSend, sendCode } from "@/lib/mail";
import { clientIp, limited } from "@/lib/ratelimit";
import { verifyTurnstile } from "@/lib/turnstile";
import { pickLang, tr } from "@/lib/authi18n";

// Resposta sempre genérica: não revela se o e-mail existe.
export async function POST(req: Request) {
  const { email, lang: l, turnstile } = await req.json().catch(() => ({}));
  const lang = pickLang(l);
  const e = String(email ?? "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return NextResponse.json({ error: tr(lang).eEmailValid }, { status: 400 });
  const blocked = await limited([[`forgot:ip:${clientIp(req)}`, 15, 3600], [`forgot:email:${e}`, 10, 3600]], lang);
  if (blocked) return blocked;
  if (!(await verifyTurnstile(turnstile, clientIp(req), req))) return NextResponse.json({ error: tr(lang).eBot }, { status: 400 });
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
