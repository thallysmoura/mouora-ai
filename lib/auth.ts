import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { pool, ready } from "./db";

const key = () => new TextEncoder().encode(process.env.AUTH_SECRET);
const COOKIE = "mouora_session";

export async function createSession(userId: string, remember = true) {
  const days = remember ? 30 : 1;
  const token = await new SignJWT({}).setProtectedHeader({ alg: "HS256" }).setSubject(userId).setExpirationTime(`${days}d`).sign(key());
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
    const { payload } = await jwtVerify(token, key());
    await ready();
    const r = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [payload.sub]);
    return (r.rows[0] as { id: string; name: string; email: string }) ?? null;
  } catch {
    return null;
  }
}
