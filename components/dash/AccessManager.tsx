"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ISearch, IShield } from "./Icons";
import "./admin.css";

export type Row = {
  id: string; name: string; email: string; role: "admin" | "user"; status: "active" | "suspended" | "pending";
  verified: boolean; avatarUrl: string; createdAt: string; lastAccess: string; protectedUser: boolean; isMe: boolean;
};
type Props = { rows: Row[]; total: number; page: number; per: number; q: string; roleFilter: string; stats: { total: number; admins: number; suspended: number; pending: number } };

const fmt = (iso: string) => (iso ? new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "America/Manaus" }) : "—");
const initials = (n: string) => n.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";

export default function AccessManager({ rows, total, page, per, q, roleFilter, stats }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);
  const pages = Math.max(1, Math.ceil(total / per));
  const href = (p: number) => { const u = new URLSearchParams(); if (q) u.set("q", q); if (roleFilter) u.set("role", roleFilter); if (p > 1) u.set("page", String(p)); const s = u.toString(); return `/dashboard/access${s ? "?" + s : ""}`; };

  const change = async (r: Row, patch: { role?: string; status?: string }, label: string) => {
    if (!window.confirm(`${label}\n\n${r.name} <${r.email}>`)) return;
    setBusy(r.id); setNote(null);
    try {
      const res = await fetch(`/api/admin/users/${r.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) setNote({ ok: false, text: d.error || "Não foi possível alterar o acesso." });
      else { setNote({ ok: true, text: "Acesso atualizado." }); router.refresh(); }
    } catch { setNote({ ok: false, text: "Falha de conexão. Tente novamente." }); }
    setBusy(null);
  };

  return (
    <div className="ad">
      <div className="ad-stats">
        <div className="ad-stat"><span>Usuários</span><b>{stats.total}</b></div>
        <div className="ad-stat"><span>Administradores</span><b>{stats.admins}</b></div>
        <div className={`ad-stat${stats.pending ? " alert" : ""}`}><span>Aguardando liberação</span><b className={stats.pending ? "warn" : ""}>{stats.pending}</b></div>
        <div className="ad-stat"><span>Suspensos</span><b>{stats.suspended}</b></div>
      </div>

      <section className="dh-card ad-card">
        <form className="ad-filters" method="get" action="/dashboard/access" role="search">
          <label className="ad-search"><ISearch size={18} /><input name="q" defaultValue={q} placeholder="Buscar por nome ou e-mail" maxLength={80} aria-label="Buscar usuário" /></label>
          <select name="role" defaultValue={roleFilter} aria-label="Filtrar por perfil">
            <option value="">Todos</option><option value="pending">Aguardando liberação</option><option value="admin">Administradores</option><option value="user">Usuários</option><option value="suspended">Suspensos</option>
          </select>
          <button type="submit" className="ad-btn">Filtrar</button>
          {(q || roleFilter) && <a className="ad-link" href="/dashboard/access">Limpar</a>}
        </form>
        {note && <p className={`ad-note ${note.ok ? "ok" : "bad"}`} role="status">{note.text}</p>}

        <div className="ad-tablewrap">
          <table className="ad-table">
            <thead><tr><th>Usuário</th><th>Perfil</th><th>Situação</th><th>Cadastro</th><th>Último acesso</th><th className="r">Ações</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className={r.status === "suspended" ? "off" : ""}>
                  <td>
                    <div className="ad-user">
                      {r.avatarUrl ? <img src={r.avatarUrl} alt="" width={38} height={38} loading="lazy" decoding="async" /> : <span className="ad-ini" aria-hidden="true">{initials(r.name)}</span>}
                      <div><strong>{r.name}{r.isMe && <em> (você)</em>}</strong><span>{r.email}{!r.verified && " · e-mail não verificado"}</span></div>
                    </div>
                  </td>
                  <td><span className={`ad-badge ${r.role}`}>{r.role === "admin" ? <><IShield size={14} />Administrador</> : "Usuário"}</span></td>
                  <td><span className={`ad-badge ${r.status}`}>{r.status === "active" ? "Ativo" : r.status === "pending" ? "Aguardando" : "Suspenso"}</span></td>
                  <td>{fmt(r.createdAt)}</td>
                  <td>{fmt(r.lastAccess)}</td>
                  <td className="r">
                    {r.protectedUser || r.isMe ? (
                      <span className="ad-lock">{r.isMe ? "Seu acesso" : "Protegido"}</span>
                    ) : (
                      <div className="ad-actions">
                        <button type="button" className="ad-btn ghost" disabled={busy === r.id}
                          onClick={() => change(r, { role: r.role === "admin" ? "user" : "admin" }, r.role === "admin" ? "Remover o acesso de administrador deste usuário?" : "Tornar este usuário administrador? Ele poderá gerenciar acessos e ver os logs.")}>
                          {r.role === "admin" ? "Tornar usuário" : "Tornar admin"}
                        </button>
                        {r.status === "pending" ? (
                          <>
                            <button type="button" className="ad-btn ok" disabled={busy === r.id} onClick={() => change(r, { status: "active" }, "Liberar o acesso deste usuário ao painel?")}>Liberar acesso</button>
                            <button type="button" className="ad-btn danger" disabled={busy === r.id} onClick={() => change(r, { status: "suspended" }, "Recusar e suspender este usuário?")}>Recusar</button>
                          </>
                        ) : (
                          <button type="button" className={`ad-btn ${r.status === "active" ? "danger" : "ok"}`} disabled={busy === r.id}
                            onClick={() => change(r, { status: r.status === "active" ? "suspended" : "active" }, r.status === "active" ? "Suspender o acesso deste usuário? Ele será desconectado." : "Reativar o acesso deste usuário?")}>
                            {r.status === "active" ? "Suspender" : "Reativar"}
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={6} className="ad-empty">Nenhum usuário encontrado.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="ad-pager">
          <span>{total} {total === 1 ? "usuário" : "usuários"} · página {page} de {pages}</span>
          <div>
            {page > 1 && <a className="ad-btn ghost" href={href(page - 1)}>Anterior</a>}
            {page < pages && <a className="ad-btn ghost" href={href(page + 1)}>Próxima</a>}
          </div>
        </div>
      </section>
    </div>
  );
}
