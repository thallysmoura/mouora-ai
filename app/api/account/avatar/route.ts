import { NextResponse } from "next/server";
import { pool, ready } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { cloudinaryReady, deleteAvatar, uploadAvatar } from "@/lib/cloudinary";
import { limited } from "@/lib/ratelimit";

const MAX = 512 * 1024; // 512 KB: o navegador já envia ~256×256 WebP comprimido (10–30 KB)

/** Tipo real pelo conteúdo (não confia no nome nem no Content-Type enviados pelo navegador). */
function sniff(b: Uint8Array): string | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return "image/webp";
  return null;
}

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sessão expirada. Entre novamente." }, { status: 401 });
  if (!cloudinaryReady()) return NextResponse.json({ error: "O envio de foto ainda não está configurado." }, { status: 503 });
  const blocked = await limited([[`avatar:${user.id}`, 6, 3600]]);
  if (blocked) return blocked;
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Selecione uma imagem." }, { status: 400 });
  if (file.size === 0 || file.size > MAX) return NextResponse.json({ error: "A imagem deve ter até 512 KB (ela é reduzida automaticamente ao enviar pela tela de perfil)." }, { status: 400 });
  const buf = new Uint8Array(await file.arrayBuffer());
  const type = sniff(buf);
  if (!type) return NextResponse.json({ error: "Use uma imagem JPG, PNG ou WebP." }, { status: 400 });
  try {
    const { url, publicId } = await uploadAvatar(user.id, new Blob([buf], { type }));
    let old;
    try {
      await ready();
      old = await pool.query("SELECT avatar_public_id FROM users WHERE id=$1", [user.id]);
      await pool.query("UPDATE users SET avatar_url=$1, avatar_public_id=$2 WHERE id=$3", [url, publicId, user.id]);
    } catch (dbErr) {
      await deleteAvatar(publicId); // não deixa a foto órfã no Cloudinary se o banco falhar
      throw dbErr;
    }
    await deleteAvatar(old.rows[0]?.avatar_public_id); // não deixa fotos antigas órfãs
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    console.error("[avatar] falha no upload:", err);
    return NextResponse.json({ error: "Não foi possível enviar a foto. Tente novamente." }, { status: 502 });
  }
}

export async function DELETE() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sessão expirada. Entre novamente." }, { status: 401 });
  await ready();
  const old = await pool.query("SELECT avatar_public_id FROM users WHERE id=$1", [user.id]);
  await pool.query("UPDATE users SET avatar_url=NULL, avatar_public_id=NULL WHERE id=$1", [user.id]);
  await deleteAvatar(old.rows[0]?.avatar_public_id);
  return NextResponse.json({ ok: true });
}
