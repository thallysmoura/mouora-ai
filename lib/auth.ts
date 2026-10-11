import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import crypto from "crypto";
import { pool, ready } from "./db";
import { isSuperAdmin } from "./roles";

const key = () => {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error("AUTH_SECRET ausente ou curto demais (mínimo 32 caracteres).");
  return new TextEncoder().encode(s);
};
const ISSUER = "mouora";
// "versão da senha": trocar a senha invalida as sessões antigas
const pv = (hash: string) => crypto.createHash("sha256").update(hash).digest("hex").slice(0, 16);
const COOKIE = "mouora_session";

export async function createSession(userId: string, remember = true) {
  const days = remember ? 30 : 1;
  await ready();
  const u = await pool.query("SELECT password_hash FROM users WHERE id = $1", [userId]);
  const token = await new SignJWT({ pv: pv(u.rows[0].password_hash) }).setProtectedHeader({ alg: "HS256" }).setSubject(userId).setIssuer(ISSUER).setIssuedAt().setExpirationTime(`${days}d`).sign(key());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // Lembrar de mim: cookie persistente por 30 dias; caso contrário, cookie de sessão (some ao fechar o navegador)
    ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {}),
  });
}

export async function clearSession() {
  (await cookies()).delete(COOKIE);
}

export async function currentUser() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"], issuer: ISSUER });
    await ready();
    const r = await pool.query("SELECT id, name, email, phone, locale, avatar_url, email_changed_at, role, status, email_verified, password_hash FROM users WHERE id = $1", [payload.sub]);
    const u = r.rows[0];
    if (!u || payload.pv !== pv(u.password_hash)) return null;
    if (u.status === "suspended") return null; // conta suspensa: a sessão deixa de valer na hora
    // super admins (lista em lib/roles.ts) são sempre administradores, desde que o e-mail esteja verificado
    const isAdmin = u.role === "admin" || (isSuperAdmin(u.email as string) && !!u.email_verified);
    if (isAdmin && (u.role !== "admin" || u.status !== "active")) pool.query("UPDATE users SET role='admin', status='active' WHERE id=$1", [u.id]).catch(() => {});
    return { id: String(u.id), name: u.name as string, email: u.email as string, phone: (u.phone as string | null) ?? "", locale: (u.locale as string | null) ?? "pt", avatarUrl: (u.avatar_url as string | null) ?? "", emailChangedAt: u.email_changed_at ? new Date(u.email_changed_at as string).toISOString() : "", role: (isAdmin ? "admin" : "user") as "admin" | "user", isAdmin, status: (isAdmin || u.status === "active" ? "active" : "pending") as "active" | "pending" };
  } catch {
    return null;
  }
}
