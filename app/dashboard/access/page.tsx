import DashboardView from "@/components/DashboardView";
import AccessManager, { type Row } from "@/components/dash/AccessManager";
import { pool, ready } from "@/lib/db";
import { isSuperAdmin } from "@/lib/roles";

export const dynamic = "force-dynamic";
export const metadata = { title: "Controle de acesso — Mouora AI", robots: { index: false } };

const PER = 15;
type Props = { searchParams: Promise<{ q?: string; page?: string; role?: string }> };

export default async function Page({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 80);
  const roleFilter = sp.role === "admin" || sp.role === "user" || sp.role === "suspended" || sp.role === "pending" ? sp.role : "";
  const page = Math.max(1, Math.min(10_000, Number.parseInt(sp.page ?? "1", 10) || 1));
  return (
    <DashboardView path="/dashboard/access" title="Controle de acesso" eyebrow="Administração" adminOnly>
      {async (me) => {
        await ready();
        const like = `%${q.replace(/[\\%_]/g, (c) => "\\" + c)}%`;
        const where = "($1 = '' OR u.name ILIKE $2 OR u.email ILIKE $2) AND ($3 = '' OR ($3 = 'suspended' AND u.status = 'suspended') OR ($3 = 'pending' AND u.status = 'pending') OR ($3 IN ('admin','user') AND u.role = $3))";
        const args = [q, like, roleFilter];
        const [list, total, stats] = await Promise.all([
          pool.query(
            `SELECT u.id, u.name, u.email, u.role, u.status, u.email_verified, u.avatar_url, u.created_at,
                    (SELECT max(a.created_at) FROM access_log a WHERE a.user_id = u.id AND a.event IN ('login','verify','reset','register')) AS last_access
             FROM users u WHERE ${where} ORDER BY u.created_at DESC LIMIT ${PER} OFFSET ${(page - 1) * PER}`, args),
          pool.query(`SELECT count(*)::int AS n FROM users u WHERE ${where}`, args),
          pool.query("SELECT count(*)::int AS total, count(*) FILTER (WHERE role='admin')::int AS admins, count(*) FILTER (WHERE status='suspended')::int AS suspended, count(*) FILTER (WHERE status='pending')::int AS pending FROM users"),
        ]);
        const rows: Row[] = list.rows.map((r) => ({
          id: String(r.id), name: r.name, email: r.email,
          role: r.role === "admin" || isSuperAdmin(r.email) ? "admin" : "user",
          status: r.status === "suspended" ? "suspended" : r.status === "pending" && !isSuperAdmin(r.email) ? "pending" : "active",
          verified: !!r.email_verified, avatarUrl: r.avatar_url ?? "",
          createdAt: new Date(r.created_at).toISOString(), lastAccess: r.last_access ? new Date(r.last_access).toISOString() : "",
          protectedUser: isSuperAdmin(r.email), isMe: String(r.id) === me.id,
        }));
        return <AccessManager rows={rows} total={total.rows[0].n} page={page} per={PER} q={q} roleFilter={roleFilter} stats={stats.rows[0]} />;
      }}
    </DashboardView>
  );
}
