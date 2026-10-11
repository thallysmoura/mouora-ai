import { NextResponse } from "next/server";
import { pool, ready } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { sendVerificationCode } from "@/lib/mail";
import { checkPassword, hashPassword, needsRehash } from "@/lib/password";
import { clientIp, limited } from "@/lib/ratelimit";
import { logAccess } from "@/lib/accesslog";
import { verifyTurnstile } from "@/lib/turnstile";
import { pickLang, tr } from "@/lib/authi18n";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body) || typeof body.email !== "string" || typeof body.password !== "string")
    return NextResponse.json({ error: tr(pickLang(body?.lang)).eInvalidCreds }, { status: 400 });
  const { email, password, remember, turnstile } = body;
  const lang = pickLang(body.lang);
  const e = String(email ?? "").trim().toLowerCase().slice(0, 254);
  const p = String(password ?? "").slice(0, 1000);
  const ip = clientIp(req);
  const blocked = await limited([[`login:ip:${ip}`, 40, 900], [`login:ip-email:${ip}:${e}`, 8, 900], [`login:email:${e}`, 30, 3600]], lang);
  if (blocked) return blocked;
  if (!(await verifyTurnstile(turnstile, ip, req))) return NextResponse.json({ error: tr(lang).eBot }, { status: 400 });
  await ready();
  const r = await pool.query("SELECT id, name, email, email_verified, status, password_hash FROM users WHERE lower(email) = $1", [e]);
  const u = r.rows[0];
  const ok = await checkPassword(p, u?.password_hash);
  if (!ok) {
    await logAccess(req, { userId: u?.id ?? null, email: e, event: "login_failed" });
    return NextResponse.json({ error: tr(lang).eInvalidCreds }, { status: 401 });
  }
  if (u.status === "suspended") {
    await logAccess(req, { userId: u.id, email: u.email, event: "login_failed" });
    return NextResponse.json({ error: tr(lang).eSuspended }, { status: 403 });
  }
  // senhas antigas com custo menor são regravadas com o custo atual
  if (needsRehash(u.password_hash)) await pool.query("UPDATE users SET password_hash=$1 WHERE id=$2", [await hashPassword(p), u.id]);
  if (!u.email_verified && process.env.REQUIRE_EMAIL_VERIFICATION === "true") {
    try {
      await sendVerificationCode(String(u.id), u.name, u.email);
    } catch (e) {
      console.error("mail error", e);
    }
    return NextResponse.json({ ok: true, verify: true, email: u.email });
  }
  await createSession(String(u.id), remember === true);
  await logAccess(req, { userId: u.id, email: u.email, event: "login" });
  return NextResponse.json({ ok: true });
}
