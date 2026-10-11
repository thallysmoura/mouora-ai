import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { pool, ready } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { sendCode } from "@/lib/mail";
import { clientIp, limited } from "@/lib/ratelimit";
import { logAccess } from "@/lib/accesslog";
import { pickLang, tr } from "@/lib/authi18n";

export async function POST(req: Request) {
  const { email, code, resend, lang: l } = await req.json().catch(() => ({}));
  const lang = pickLang(l);
  const t = tr(lang);
  const em = String(email ?? "").trim().toLowerCase().slice(0, 254);
  const blocked = await limited([[`verify:ip:${clientIp(req)}`, 30, 900], [`verify:email:${em}`, 20, 3600]], lang);
  if (blocked) return blocked;
  await ready();
  const r = await pool.query(
    "SELECT id, name, email, code_hash, code_expires, code_attempts FROM users WHERE lower(email)=$1 AND NOT email_verified",
    [em],
  );
  const u = r.rows[0];
  if (!u) return NextResponse.json({ error: t.eNotFound }, { status: 404 });
  if (resend) {
    try {
      const sent = await sendCode("verify", { id: String(u.id), name: u.name, email: u.email });
      if (!sent) return NextResponse.json({ error: t.eWait }, { status: 429 });
    } catch (err) {
      console.error("[verify] falha ao enviar e-mail:", err);
      return NextResponse.json({ error: t.eResendFail }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  }
  if (!u.code_hash || !u.code_expires || new Date(u.code_expires) < new Date() || u.code_attempts >= 5)
    return NextResponse.json({ error: t.eCodeExpired }, { status: 400 });
  const c = typeof code === "string" ? code.trim() : "";
  if (!/^\d{6}$/.test(c)) return NextResponse.json({ error: t.eCode6 }, { status: 400 });
  const ok = await bcrypt.compare(c, u.code_hash);
  if (!ok) {
    await pool.query("UPDATE users SET code_attempts = code_attempts + 1 WHERE id=$1", [u.id]);
    return NextResponse.json({ error: t.eCodeWrong }, { status: 400 });
  }
  await pool.query("UPDATE users SET email_verified=true, code_hash=NULL, code_expires=NULL WHERE id=$1", [u.id]);
  await createSession(String(u.id));
  await logAccess(req, { userId: u.id, email: u.email, event: "verify" });
  return NextResponse.json({ ok: true });
}
