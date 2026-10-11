import crypto from "crypto";
import { NextResponse } from "next/server";
import { pool, ready } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { validatePassword } from "@/lib/validation";
import { clientIp, limited } from "@/lib/ratelimit";
import { logAccess } from "@/lib/accesslog";
import { pickLang, tr } from "@/lib/authi18n";

// Passo 3: define a nova senha usando o token emitido após a validação do código.
export async function POST(req: Request) {
  const { email, token, password, lang: l } = await req.json().catch(() => ({}));
  const lang = pickLang(l);
  const t = tr(lang);
  const e = String(email ?? "").trim().toLowerCase();
  const p = String(password ?? "");
  const perr = validatePassword(p, e, lang);
  if (perr) return NextResponse.json({ error: perr }, { status: 400 });
  const blocked = await limited([[`reset:ip:${clientIp(req)}`, 20, 3600], [`reset:email:${e}`, 10, 3600]], lang);
  if (blocked) return blocked;
  await ready();
  const r = await pool.query("SELECT id, reset_token_hash, reset_token_expires FROM users WHERE lower(email)=$1", [e]);
  const u = r.rows[0];
  if (typeof token !== "string" || !/^[0-9a-f]{48}$/.test(token)) return NextResponse.json({ error: t.eSession }, { status: 400 });
  const given = crypto.createHash("sha256").update(String(token ?? "")).digest("hex");
  const valid =
    u && u.reset_token_hash && u.reset_token_expires && new Date(u.reset_token_expires) > new Date() &&
    crypto.timingSafeEqual(Buffer.from(given), Buffer.from(u.reset_token_hash));
  if (!valid) return NextResponse.json({ error: t.eSession }, { status: 400 });
  const hash = await hashPassword(p);
  await pool.query(
    "UPDATE users SET password_hash=$1, reset_token_hash=NULL, reset_token_expires=NULL, reset_hash=NULL, reset_expires=NULL, email_verified=true WHERE id=$2",
    [hash, u.id],
  );
  await createSession(String(u.id), true);
  await logAccess(req, { userId: u.id, email: e, event: "reset" });
  return NextResponse.json({ ok: true });
}
