import { NextResponse } from "next/server";
import { pool, ready } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { limited } from "@/lib/ratelimit";
import { isSuperAdmin } from "@/lib/roles";

// Gestão de acessos: somente administradores. Altera o perfil (admin/user) e a situação (ativo/suspenso) de um usuário.
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Sessão expirada. Entre novamente." }, { status: 401 });
  if (!me.isAdmin) return NextResponse.json({ error: "Sem permissão." }, { status: 403 });
  const { id } = await params;
  if (!/^\d{1,18}$/.test(id)) return NextResponse.json({ error: "Usuário inválido." }, { status: 400 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  const { role, status } = body as Record<string, unknown>;
  if (role === undefined && status === undefined) return NextResponse.json({ error: "Nada para alterar." }, { status: 400 });
  if (role !== undefined && role !== "admin" && role !== "user") return NextResponse.json({ error: "Perfil inválido." }, { status: 400 });
  if (status !== undefined && status !== "active" && status !== "suspended" && status !== "pending") return NextResponse.json({ error: "Situação inválida." }, { status: 400 });
  const blocked = await limited([[`admin-users:${me.id}`, 60, 3600]]);
  if (blocked) return blocked;

  await ready();
  const r = await pool.query("SELECT id, email, role, status FROM users WHERE id=$1", [id]);
  const target = r.rows[0];
  if (!target) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  if (String(target.id) === me.id) return NextResponse.json({ error: "Você não pode alterar o seu próprio acesso." }, { status: 400 });
  if (isSuperAdmin(target.email)) return NextResponse.json({ error: "Este administrador é protegido e não pode ser alterado." }, { status: 400 });

  await pool.query("UPDATE users SET role=COALESCE($1, role), status=COALESCE($2, status) WHERE id=$3", [role ?? null, status ?? null, id]);
  console.info(`[admin] ${me.email} alterou usuário ${target.email}: role=${role ?? "-"} status=${status ?? "-"}`);
  return NextResponse.json({ ok: true });
}
