import { NextResponse } from "next/server";
import { pool, ready } from "@/lib/db";
import { sendVerificationCode } from "@/lib/mail";
import { createSession } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { isSuperAdmin } from "@/lib/roles";
import { normalizeEmail, normalizeName, validateRegister } from "@/lib/validation";
import { clientIp, limited } from "@/lib/ratelimit";
import { logAccess } from "@/lib/accesslog";
import { verifyTurnstile } from "@/lib/turnstile";
import { pickLang, tr } from "@/lib/authi18n";

const REQUIRE_VERIFY = process.env.REQUIRE_EMAIL_VERIFICATION === "true";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: tr("pt").eBadRequest }, { status: 400 });
  const { name, email, password, confirm, acceptTerms, website } = body as Record<string, unknown>;
  const lang = pickLang((body as Record<string, unknown>).lang);
  // campo-isca invisível: só robôs o preenchem
  if (typeof website === "string" && website.trim()) return NextResponse.json({ error: tr(lang).eBadRequest }, { status: 400 });
  const v = validateRegister({ name, email, password, confirm, terms: acceptTerms }, lang);
  if (!v.ok) return NextResponse.json({ error: Object.values(v.errors)[0], fields: v.errors }, { status: 400 });
  const n = normalizeName(name);
  const e = normalizeEmail(email);
  const p = password as string;
  const blocked = await limited([[`register:ip:${clientIp(req)}`, 10, 3600], [`register:email:${e}`, 5, 3600]], lang);
  if (blocked) return blocked;
  if (!(await verifyTurnstile((body as Record<string, unknown>).turnstile, clientIp(req), req))) return NextResponse.json({ error: tr(lang).eBot }, { status: 400 });
  await ready();
  const hash = await hashPassword(p);
  try {
    const ex = await pool.query("SELECT id, email_verified FROM users WHERE lower(email)=$1", [e]);
    let id: string;
    if (ex.rows[0] && !ex.rows[0].email_verified) {
      id = String(ex.rows[0].id);
      await pool.query("UPDATE users SET name=$1, password_hash=$2 WHERE id=$3", [n, hash, id]);
    } else {
      const r = await pool.query("INSERT INTO users (name, email, password_hash, email_verified, status) VALUES ($1,$2,$3,$4,$5) RETURNING id", [n, e, hash, !REQUIRE_VERIFY, isSuperAdmin(e) ? "active" : "pending"]);
      id = String(r.rows[0].id);
    }
    if (!REQUIRE_VERIFY) {
      await pool.query("UPDATE users SET email_verified=true WHERE id=$1", [id]);
      await createSession(id);
      await logAccess(req, { userId: id, email: e, event: "register" });
      return NextResponse.json({ ok: true });
    }
    try {
      await sendVerificationCode(id, n, e);
    } catch (mailErr) {
      console.error("mail error", mailErr);
      return NextResponse.json({ error: tr(lang).eMailFail }, { status: 502 });
    }
    return NextResponse.json({ ok: true, verify: true, email: e });
  } catch (err) {
    if ((err as { code?: string }).code === "23505") return NextResponse.json({ error: tr(lang).eEmailTaken, fields: { email: tr(lang).eEmailTakenField } }, { status: 409 });
    throw err;
  }
}
