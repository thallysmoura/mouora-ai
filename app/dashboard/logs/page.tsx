import DashboardView from "@/components/DashboardView";
import LogsView, { type Entry, type Point } from "@/components/dash/LogsView";
import { pool, ready } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Log de acesso — Mouora AI", robots: { index: false } };

const PER = 20;
const EVENTS = ["login", "login_failed", "register", "verify", "reset", "logout"];
const PERIODS: Record<string, string | null> = { "24h": "24 hours", "7d": "7 days", "30d": "30 days", all: null };
type Props = { searchParams: Promise<{ q?: string; event?: string; period?: string; page?: string }> };

export default async function Page({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 80);
  const event = EVENTS.includes(sp.event ?? "") ? (sp.event as string) : "";
  const period = sp.period && sp.period in PERIODS ? sp.period : "7d";
  const page = Math.max(1, Math.min(10_000, Number.parseInt(sp.page ?? "1", 10) || 1));
  return (
    <DashboardView path="/dashboard/logs" title="Log de acesso" eyebrow="Administração" adminOnly>
      {async () => {
        await ready();
        const like = `%${q.replace(/[\\%_]/g, (c) => "\\" + c)}%`;
        const where = "($1 = '' OR a.email ILIKE $2 OR a.ip ILIKE $2) AND ($3 = '' OR a.event = $3) AND ($4::text IS NULL OR a.created_at > now() - ($4::text)::interval)";
        const args = [q, like, event, PERIODS[period]];
        const [list, total, pts, stats] = await Promise.all([
          pool.query(
            `SELECT a.id, a.email, a.event, a.ip, a.device_type, a.browser, a.os, a.device_model, a.user_agent, a.country, a.region, a.city, a.lat, a.lon, a.created_at
             FROM access_log a WHERE ${where} ORDER BY a.created_at DESC LIMIT ${PER} OFFSET ${(page - 1) * PER}`, args),
          pool.query(`SELECT count(*)::int AS n FROM access_log a WHERE ${where}`, args),
          pool.query(
            `SELECT round(a.lat::numeric, 2)::float AS lat, round(a.lon::numeric, 2)::float AS lon, count(*)::int AS n,
                    max(a.city) AS city, max(a.country) AS country, max(a.created_at) AS last, array_agg(DISTINCT a.email) FILTER (WHERE a.email IS NOT NULL) AS emails
             FROM access_log a WHERE a.lat IS NOT NULL AND ${where} GROUP BY 1, 2 ORDER BY max(a.created_at) DESC LIMIT 300`, args),
          pool.query(
            `SELECT count(*) FILTER (WHERE event IN ('login','verify','reset','register'))::int AS ok, count(*) FILTER (WHERE event='login_failed')::int AS failed,
                    count(DISTINCT ip)::int AS ips, count(DISTINCT lower(email))::int AS users FROM access_log a WHERE ${where}`, args),
        ]);
        const entries: Entry[] = list.rows.map((r) => ({
          id: String(r.id), email: r.email ?? "", event: r.event, ip: r.ip ?? "", deviceType: r.device_type ?? "", browser: r.browser ?? "", os: r.os ?? "",
          model: r.device_model ?? "", ua: r.user_agent ?? "", country: r.country ?? "", region: r.region ?? "", city: r.city ?? "",
          lat: r.lat, lon: r.lon, at: new Date(r.created_at).toISOString(),
        }));
        const points: Point[] = pts.rows.map((r) => ({ lat: r.lat, lon: r.lon, n: r.n, city: r.city ?? "", country: r.country ?? "", last: new Date(r.last).toISOString(), emails: (r.emails ?? []).slice(0, 5) }));
        return <LogsView entries={entries} points={points} total={total.rows[0].n} page={page} per={PER} q={q} event={event} period={period} stats={stats.rows[0]} />;
      }}
    </DashboardView>
  );
}
