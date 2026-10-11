import { NextResponse } from "next/server";

// Verificação de saúde para o Docker/Cloudflare (sem acessar o banco nem expor detalhes).
export const dynamic = "force-dynamic";
export function GET() {
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
