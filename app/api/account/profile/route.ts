import { NextResponse } from "next/server";
import { pool, ready } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { limited } from "@/lib/ratelimit";
import { normalizeName, normalizePhone, validateName } from "@/lib/validation";

// Atualiza nome, telefone e idioma do usuário logado. O e-mail e a senha têm rotas próprias (exigem confirmação).
export async function PATCH(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sessão expirada. Entre novamente." }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  const blocked = await limited([[`profile:${user.id}`, 30, 3600]]);
  if (blocked) return blocked;

  const { name, phone, locale } = body as Record<string, unknown>;
  const fields: Record<string, string> = {};
  const nameErr = validateName(name);
  if (nameErr) fields.name = nameErr;
  const ph = normalizePhone(phone ?? "");
  if (ph === null) fields.phone = "Telefone inválido. Use DDD + número, ex.: (92) 91234-5678.";
  if (locale !== "pt" && locale !== "en" && locale !== "es") fields.locale = "Idioma inválido.";
  if (Object.keys(fields).length) return NextResponse.json({ error: Object.values(fields)[0], fields }, { status: 400 });

  await ready();
  await pool.query("UPDATE users SET name=$1, phone=$2, locale=$3 WHERE id=$4", [normalizeName(name), ph || null, locale, user.id]);
  return NextResponse.json({ ok: true });
}
