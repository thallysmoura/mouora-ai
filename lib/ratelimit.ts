import { NextResponse } from "next/server";
import { pool, ready } from "./db";
import { tr, type Lang } from "./authi18n";

/** IP real do cliente (atrás do Cloudflare/Coolify o proxy preenche estes cabeçalhos). */
export function clientIp(req: Request) {
  const h = req.headers;
  return (h.get("cf-connecting-ip") || h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0] || "unknown").trim().slice(0, 64);
}

/** Contador por janela fixa no PostgreSQL (vale para várias instâncias). */
async function hit(key: string, max: number, windowSec: number) {
  await ready();
  const r = await pool.query(
    `INSERT INTO rate_limit (key, count, window_start) VALUES ($1, 1, now())
     ON CONFLICT (key) DO UPDATE SET
       count = CASE WHEN rate_limit.window_start < now() - make_interval(secs => $2::double precision) THEN 1 ELSE rate_limit.count + 1 END,
       window_start = CASE WHEN rate_limit.window_start < now() - make_interval(secs => $2::double precision) THEN now() ELSE rate_limit.window_start END
     RETURNING count, GREATEST(1, CEIL($2::double precision - EXTRACT(EPOCH FROM (now() - window_start))))::int AS retry`,
    [key, windowSec],
  );
  if (Math.random() < 0.01) pool.query("DELETE FROM rate_limit WHERE window_start < now() - interval '1 day'").catch(() => {});
  return { ok: Number(r.rows[0].count) <= max, retry: Number(r.rows[0].retry) };
}

/** Aplica os limites [chave, máximo, janela em segundos]; devolve a resposta 429 se algum estourar. */
export async function limited(limits: [key: string, max: number, windowSec: number][], lang: Lang = "pt") {
  let retry = 0;
  for (const [key, max, win] of limits) {
    const r = await hit(key, max, win);
    if (!r.ok) retry = Math.max(retry, r.retry);
  }
  if (!retry) return null;
  return NextResponse.json({ error: tr(lang).eTooMany }, { status: 429, headers: { "Retry-After": String(retry) } });
}
