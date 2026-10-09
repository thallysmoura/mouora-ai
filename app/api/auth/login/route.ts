import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { pool, ready } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { sendVerificationCode } from "@/lib/mail";

export async function POST(req: Request) {
  const { email, password, remember } = await req.json().catch(() => ({}));
  await ready();
  const r = await pool.query("SELECT id, name, email, email_verified, password_hash FROM users WHERE lower(email) = lower($1)", [String(email ?? "").trim()]);
  const u = r.rows[0];
  const ok = u && (await bcrypt.compare(String(password ?? ""), u.password_hash));
  if (!ok) return NextResponse.json({ error: "E-mail ou senha incorretos." }, { status: 401 });
  if (!u.email_verified && process.env.REQUIRE_EMAIL_VERIFICATION === "true") {
    try {
      await sendVerificationCode(String(u.id), u.name, u.email);
    } catch (e) {
      console.error("mail error", e);
    }
    return NextResponse.json({ ok: true, verify: true, email: u.email });
  }
  await createSession(String(u.id), remember === true);
  return NextResponse.json({ ok: true });
}
