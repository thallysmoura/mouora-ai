import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";
import { pool, ready } from "./db";
import { clientIp } from "./ratelimit";

export type AccessEvent = "login" | "login_failed" | "register" | "verify" | "reset" | "logout";

const isPrivateIp = (ip: string) => /^(::1|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|fe80:|fc|fd|unknown)/i.test(ip);
const num = (v: string | null) => { const n = v == null ? NaN : Number(v); return Number.isFinite(n) ? n : null; };

/** Localização aproximada: cabeçalhos do Cloudflare (se ativos) e, na falta deles, base GeoLite local (sem enviar o IP a terceiros). */
function locate(req: Request, ip: string) {
  const h = req.headers;
  const cfCountry = h.get("cf-ipcountry");
  if (cfCountry && cfCountry !== "XX" && h.get("cf-ipcity")) {
    return { country: cfCountry, region: h.get("cf-region") || null, city: decodeURIComponent(h.get("cf-ipcity") || "") || null, lat: num(h.get("cf-iplatitude")), lon: num(h.get("cf-iplongitude")) };
  }
  if (isPrivateIp(ip)) return { country: null, region: null, city: null, lat: null, lon: null };
  const g = geoip.lookup(ip.replace(/^::ffff:/, ""));
  if (!g) return { country: cfCountry && cfCountry !== "XX" ? cfCountry : null, region: null, city: null, lat: null, lon: null };
  return { country: g.country || null, region: g.region || null, city: g.city || null, lat: g.ll?.[0] ?? null, lon: g.ll?.[1] ?? null };
}

function device(ua: string) {
  const r = new UAParser(ua).getResult();
  const type = r.device.type === "mobile" ? "Celular" : r.device.type === "tablet" ? "Tablet" : "Computador";
  return {
    type,
    browser: [r.browser.name, r.browser.major].filter(Boolean).join(" ") || "Desconhecido",
    os: [r.os.name, r.os.version].filter(Boolean).join(" ") || "Desconhecido",
    model: [r.device.vendor, r.device.model].filter(Boolean).join(" ") || null,
  };
}

/** Registra um acesso. Nunca lança erro: falha de log não pode derrubar o login. */
export async function logAccess(req: Request, e: { userId?: string | number | null; email?: string | null; event: AccessEvent }) {
  try {
    const ip = clientIp(req).replace(/^::ffff:/, "");
    const ua = (req.headers.get("user-agent") || "").slice(0, 400);
    const d = device(ua);
    const g = locate(req, ip);
    await ready();
    await pool.query(
      `INSERT INTO access_log (user_id, email, event, ip, user_agent, device_type, browser, os, device_model, country, region, city, lat, lon)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [e.userId ?? null, e.email ? e.email.toLowerCase().slice(0, 254) : null, e.event, ip, ua, d.type, d.browser, d.os, d.model, g.country, g.region, g.city, g.lat, g.lon],
    );
    if (Math.random() < 0.01) pool.query("DELETE FROM access_log WHERE created_at < now() - interval '180 days'").catch(() => {});
  } catch (err) {
    console.error("[accesslog] falha ao registrar:", err);
  }
}
