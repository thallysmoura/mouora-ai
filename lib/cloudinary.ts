import crypto from "crypto";

// Upload assinado no servidor: o API secret nunca vai ao navegador.
const cfg = () => ({ cloud: process.env.CLOUDINARY_CLOUD_NAME, key: process.env.CLOUDINARY_API_KEY, secret: process.env.CLOUDINARY_API_SECRET, preset: process.env.CLOUDINARY_UPLOAD_PRESET });

export const cloudinaryReady = () => {
  const c = cfg();
  return !!(c.cloud && ((c.key && c.secret) || c.preset));
};

const sign = (params: Record<string, string | number>, secret: string) =>
  crypto.createHash("sha1").update(Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join("&") + secret).digest("hex");

const FOLDER = "mouora";
// Custo mínimo: o navegador já envia o recorte quadrado pequeno; o Cloudinary só limita a 256px e otimiza UMA vez, no envio
// (transformação "incoming"). A URL entregue não tem transformação → sem créditos de transformação por visualização, só CDN.
const TRANSFORM = "c_limit,w_256,h_256,q_auto,f_auto";

/** Nome único e imprevisível (não revela o id do usuário): 32 hex de hash sobre id + sal aleatório + hora. */
const uniqueName = (userId: string) => crypto.createHash("sha256").update(`${userId}:${crypto.randomBytes(16).toString("hex")}:${Date.now()}`).digest("hex").slice(0, 32);

export const isAvatarId = (v: unknown): v is string => typeof v === "string" && new RegExp(`^${FOLDER}/[0-9a-f]{32}$`).test(v);

/** Envia a foto para mouora/<hash> e devolve a URL segura e o public_id (para apagar depois). */
export async function uploadAvatar(userId: string, file: Blob): Promise<{ url: string; publicId: string }> {
  const { cloud, key, secret, preset } = cfg();
  if (!cloud || !((key && secret) || preset)) throw new Error("Cloudinary não configurado");
  const publicId = `${FOLDER}/${uniqueName(userId)}`;
  const endpoint = `https://api.cloudinary.com/v1_1/${cloud}/image/upload`;
  // Alternativa sem chave de API: preset de upload "unsigned" (usado só se a chave não puder criar arquivos)
  if (preset && !(key && secret && process.env.CLOUDINARY_FORCE_SIGNED === "true")) {
    const f = new FormData();
    f.set("upload_preset", preset);
    f.set("public_id", publicId);
    f.set("asset_folder", FOLDER); // contas com "dynamic folders": é o que coloca o arquivo na pasta mouora
    f.set("file", file);
    const r = await fetch(endpoint, { method: "POST", body: f, signal: AbortSignal.timeout(20_000) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || typeof d.secure_url !== "string") throw new Error(d?.error?.message || "Falha no upload");
    // recorte quadrado com foco no rosto e formato/qualidade automáticos aplicados na entrega (cache de CDN)
    return { url: (d.secure_url as string).replace("/upload/", `/upload/${TRANSFORM}/`), publicId: (d.public_id as string) || publicId };
  }
  if (!key || !secret) throw new Error("Cloudinary não configurado");
  const params = { asset_folder: FOLDER, overwrite: "false", public_id: publicId, timestamp: Math.floor(Date.now() / 1000), transformation: TRANSFORM };
  const form = new FormData();
  for (const [k, v] of Object.entries(params)) form.set(k, String(v));
  form.set("api_key", key);
  form.set("signature", sign(params, secret));
  form.set("file", file);
  const r = await fetch(endpoint, { method: "POST", body: form, signal: AbortSignal.timeout(20_000) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || typeof d.secure_url !== "string") throw new Error(d?.error?.message || "Falha no upload");
  return { url: d.secure_url as string, publicId };
}

/** Apaga uma foto antiga (melhor esforço; só aceita ids no formato gerado por este módulo). */
export async function deleteAvatar(publicId: string | null | undefined) {
  const { cloud, key, secret } = cfg();
  if (!cloud || !key || !secret || !isAvatarId(publicId)) return;
  const params = { invalidate: "true", public_id: publicId, timestamp: Math.floor(Date.now() / 1000) };
  const form = new FormData();
  for (const [k, v] of Object.entries(params)) form.set(k, String(v));
  form.set("api_key", key);
  form.set("signature", sign(params, secret));
  await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/destroy`, { method: "POST", body: form, signal: AbortSignal.timeout(10_000) }).catch(() => {});
}
