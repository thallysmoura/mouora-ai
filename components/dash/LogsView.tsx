"use client";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { ISearch } from "./Icons";
import "./admin.css";

export type Entry = {
  id: string; email: string; event: string; ip: string; deviceType: string; browser: string; os: string; model: string; ua: string;
  country: string; region: string; city: string; lat: number | null; lon: number | null; at: string;
};
export type Point = { lat: number; lon: number; n: number; city: string; country: string; last: string; emails: string[] };
type Props = { entries: Entry[]; points: Point[]; total: number; page: number; per: number; q: string; event: string; period: string; stats: { ok: number; failed: number; ips: number; users: number } };

const EVENT: Record<string, string> = { login: "Login", login_failed: "Falha de login", register: "Cadastro", verify: "Verificação de e-mail", reset: "Redefinição de senha", logout: "Saída" };
const fmt = (iso: string) => new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "America/Manaus" });
const flag = (cc: string) => (/^[A-Z]{2}$/.test(cc) ? String.fromCodePoint(...[...cc].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)) : "");
const countryName = (cc: string) => { try { return new Intl.DisplayNames(["pt-BR"], { type: "region" }).of(cc) ?? cc; } catch { return cc; } };
const place = (e: { city: string; region: string; country: string }) => {
  const parts = [e.city, e.region, e.country ? countryName(e.country) : ""].filter(Boolean);
  return parts.length ? `${flag(e.country)} ${parts.join(", ")}`.trim() : "Local não identificado";
};

export default function LogsView({ entries, points, total, page, per, q, event, period, stats }: Props) {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [mapErr, setMapErr] = useState("");
  const pages = Math.max(1, Math.ceil(total / per));
  const href = (p: number) => { const u = new URLSearchParams(); if (q) u.set("q", q); if (event) u.set("event", event); if (period !== "7d") u.set("period", period); if (p > 1) u.set("page", String(p)); const s = u.toString(); return `/dashboard/logs${s ? "?" + s : ""}`; };

  // mapa estilo redes sociais: marcadores com a contagem de acessos por local (Leaflet + OpenStreetMap/CARTO)
  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const mod = await import("leaflet");
        const L = ((mod as { default?: typeof import("leaflet") }).default ?? mod) as typeof import("leaflet");
        if (dead || !mapEl.current) return;
        mapRef.current?.remove();
        const map = L.map(mapEl.current, { scrollWheelZoom: false, worldCopyJump: true, zoomControl: true }).setView([-14, -52], 3);
        mapRef.current = map;
        // OpenStreetMap: mapa 100% gratuito e aberto, sem chave de API.
        // (Não usar o CARTO como reserva: sem chave ele devolve tiles com o aviso "API KEY REQUIRED".)
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19 }).addTo(map);
        const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
        const bounds: [number, number][] = [];
        for (const p of points) {
          const icon = L.divIcon({ className: "ad-pin", html: `<span>${p.n > 99 ? "99+" : p.n}</span>`, iconSize: [34, 34], iconAnchor: [17, 17] });
          L.marker([p.lat, p.lon], { icon }).addTo(map).bindPopup(
            `<strong>${esc([p.city, p.country].filter(Boolean).join(", ") || "Local aproximado")}</strong><br>${p.n} ${p.n === 1 ? "acesso" : "acessos"}<br><small>${esc(p.emails.join(", "))}</small>`,
          );
          bounds.push([p.lat, p.lon]);
        }
        if (bounds.length === 1) map.setView(bounds[0], 8);
        else if (bounds.length > 1) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 9 });
        setTimeout(() => map.invalidateSize(), 150); // garante o tamanho correto depois do layout
        setMapErr("");
      } catch (err) {
        console.error("[mapa] falha ao iniciar:", err);
        setMapErr("Não foi possível carregar o mapa. Atualize a página.");
      }
    })();
    return () => { dead = true; mapRef.current?.remove(); mapRef.current = null; };
  }, [points]);

  const focus = (e: Entry) => {
    setSelected(e.id);
    if (e.lat != null && e.lon != null && mapRef.current) {
      mapRef.current.flyTo([e.lat, e.lon], 9, { duration: 0.8 });
      mapEl.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="ad">
      <div className="ad-stats">
        <div className="ad-stat"><span>Acessos bem-sucedidos</span><b>{stats.ok}</b></div>
        <div className="ad-stat"><span>Tentativas falhas</span><b className={stats.failed ? "warn" : ""}>{stats.failed}</b></div>
        <div className="ad-stat"><span>IPs diferentes</span><b>{stats.ips}</b></div>
        <div className="ad-stat"><span>E-mails</span><b>{stats.users}</b></div>
      </div>

      <section className="dh-card ad-card ad-mapcard">
        <div className="ad-map" ref={mapEl} role="region" aria-label="Mapa dos acessos" />
        {mapErr && <p className="ad-map-empty">{mapErr}</p>}
        {!mapErr && !points.length && <p className="ad-map-empty">Nenhum acesso com localização neste filtro. Acessos de rede local (127.0.0.1) não têm localização.</p>}
      </section>

      <section className="dh-card ad-card">
        <form className="ad-filters" method="get" action="/dashboard/logs" role="search">
          <label className="ad-search"><ISearch size={18} /><input name="q" defaultValue={q} placeholder="Buscar por e-mail ou IP" maxLength={80} aria-label="Buscar" /></label>
          <select name="event" defaultValue={event} aria-label="Tipo de evento">
            <option value="">Todos os eventos</option>
            {Object.entries(EVENT).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select name="period" defaultValue={period} aria-label="Período">
            <option value="24h">Últimas 24 horas</option><option value="7d">Últimos 7 dias</option><option value="30d">Últimos 30 dias</option><option value="all">Todo o período</option>
          </select>
          <button type="submit" className="ad-btn">Filtrar</button>
          {(q || event || period !== "7d") && <a className="ad-link" href="/dashboard/logs">Limpar</a>}
        </form>

        <div className="ad-tablewrap">
          <table className="ad-table ad-logs">
            <thead><tr><th>Horário</th><th>E-mail</th><th>Evento</th><th>IP</th><th>Localização</th><th>Dispositivo</th></tr></thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className={`${selected === e.id ? "sel" : ""}${e.lat != null ? " click" : ""}`} onClick={() => focus(e)} title={e.ua}>
                  <td className="nowrap">{fmt(e.at)}</td>
                  <td>{e.email || "—"}</td>
                  <td><span className={`ad-badge ev-${e.event}`}>{EVENT[e.event] ?? e.event}</span></td>
                  <td className="mono">{e.ip || "—"}</td>
                  <td>{place(e)}</td>
                  <td><strong className="ad-dev">{e.model || e.deviceType}</strong><span className="ad-sub">{e.browser} · {e.os}</span></td>
                </tr>
              ))}
              {!entries.length && <tr><td colSpan={6} className="ad-empty">Nenhum acesso registrado neste filtro.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="ad-pager">
          <span>{total} {total === 1 ? "registro" : "registros"} · página {page} de {pages}</span>
          <div>
            {page > 1 && <a className="ad-btn ghost" href={href(page - 1)}>Anterior</a>}
            {page < pages && <a className="ad-btn ghost" href={href(page + 1)}>Próxima</a>}
          </div>
        </div>
        <p className="ad-privacy">Os registros (IP, dispositivo e localização aproximada) são mantidos por 180 dias e visíveis somente a administradores.</p>
      </section>
    </div>
  );
}
