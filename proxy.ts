import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MAX_BODY = 10_000; // bytes — os corpos da API de autenticação são minúsculos
const MAX_UPLOAD = 1024 * 1024; // somente a rota de foto de perfil (arquivo de até 512 KB + cabeçalhos do multipart)

// Defesa contra CSRF e abuso nas rotas da API (a página em si é protegida pelos cabeçalhos em next.config.ts).
export function proxy(req: NextRequest) {
  // CORS: a API é só do próprio site. Sem cabeçalhos Access-Control-*, o navegador bloqueia qualquer outra origem.
  if (req.method === "OPTIONS") return new NextResponse(null, { status: 204, headers: { Allow: "GET, HEAD, POST, PATCH, DELETE" } });
  if (["GET", "HEAD"].includes(req.method)) return NextResponse.next();

  const origin = req.headers.get("origin");
  if (origin) {
    const site = (() => { try { return new URL(process.env.SITE_URL || "").host; } catch { return ""; } })();
    const hosts = [req.headers.get("host"), req.headers.get("x-forwarded-host"), site, site && `www.${site}`].filter(Boolean);
    let ok = false;
    try { ok = hosts.includes(new URL(origin).host); } catch { /* origem inválida */ }
    if (!ok) return NextResponse.json({ error: "Origem não permitida." }, { status: 403 });
  } else if (req.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json({ error: "Origem não permitida." }, { status: 403 });
  }

  const limit = req.nextUrl.pathname === "/api/account/avatar" ? MAX_UPLOAD : MAX_BODY;
  if (Number(req.headers.get("content-length") ?? 0) > limit)
    return NextResponse.json({ error: "Requisição grande demais." }, { status: 413 });
  return NextResponse.next();
}

export const config = { matcher: "/api/:path*" };
