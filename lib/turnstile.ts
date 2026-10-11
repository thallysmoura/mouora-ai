// Proteção contra bots: Cloudflare Turnstile (gratuito). Desligada enquanto TURNSTILE_SECRET_KEY não estiver definido.
export const turnstileEnabled = () => !!process.env.TURNSTILE_SECRET_KEY;

/** Acesso direto pela máquina local (http://localhost:3100): o widget só vale para mouora.com, então não se aplica.
 *  Pelo túnel o Host é mouora.com e a Cloudflare sempre acrescenta cf-ray, então um robô na internet não consegue se passar por "localhost". */
const isLocalRequest = (req?: Request) => {
  if (!req) return false;
  const host = (req.headers.get("host") || "").split(":")[0];
  return (host === "localhost" || host === "127.0.0.1") && !req.headers.get("cf-ray") && !req.headers.get("cf-connecting-ip");
};

export async function verifyTurnstile(token: unknown, ip: string, req?: Request): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || isLocalRequest(req)) return true;
  if (typeof token !== "string" || token.length < 10 || token.length > 4096) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== "unknown") body.set("remoteip", ip);
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body, signal: AbortSignal.timeout(6000) });
    const d = await r.json().catch(() => ({}));
    return d?.success === true;
  } catch (err) {
    console.error("[turnstile] falha ao validar:", err);
    return false; // se não dá para validar, não deixa passar
  }
}
