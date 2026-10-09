import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { pool } from "./db";

const COOLDOWN_SECONDS = 60;

const transport = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

async function deliver(to: string, subject: string, text: string, html: string) {
  // Modo de desenvolvimento: imprime o e-mail no console do servidor em vez de enviar.
  if (process.env.MAIL_DEV_LOG === "true") {
    console.log(`\n[MAIL_DEV_LOG] Para: ${to}\nAssunto: ${subject}\n${text}\n`);
    return;
  }
  await transport().sendMail({ from: process.env.SMTP_FROM, to, subject, text, html });
}

const esc = (s: string) => s.replace(/[<>&"]/g, "");

function template(name: string, title: string, intro: string, code: string, minutes: number) {
  const text = `Olá, ${esc(name)}!\n\n${intro}\n\nSeu código: ${code}\n\nEle expira em ${minutes} minutos. Se você não fez esta solicitação, ignore este e-mail.\n\nMOUORA AI`;
  const html = `<!doctype html><html><body style="margin:0;background:#fdfaf7;font-family:Arial,Helvetica,sans-serif;color:#12152a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px"><tr><td align="center">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #efe7e1">
<tr><td style="background:linear-gradient(90deg,#f4501a,#fb7a2a);padding:22px 28px;color:#fff;font-size:20px;font-weight:800;letter-spacing:.02em">MOUORA AI</td></tr>
<tr><td style="padding:30px 28px 8px"><h1 style="margin:0 0 10px;font-size:22px;letter-spacing:-.02em">${title}</h1>
<p style="margin:0;font-size:15px;line-height:1.6;color:#4b5063">Olá, ${esc(name)}! ${intro}</p></td></tr>
<tr><td align="center" style="padding:18px 28px"><div style="display:inline-block;padding:16px 28px;border-radius:14px;background:#fff3ec;border:1px solid #ffd9c7;font-size:34px;letter-spacing:10px;font-weight:800;color:#f4501a">${code}</div></td></tr>
<tr><td style="padding:0 28px 28px"><p style="margin:0;font-size:13px;line-height:1.6;color:#7c8190">O código expira em ${minutes} minutos. Se você não fez esta solicitação, ignore este e-mail: sua conta continua segura.</p></td></tr>
</table><p style="margin:16px 0 0;font-size:12px;color:#9a9fae">© MOUORA AI</p></td></tr></table></body></html>`;
  return { text, html };
}

export type CodeKind = "verify" | "reset";

/** Intervalo mínimo entre envios, por tipo de código e e-mail (independe de a conta existir). Retorna true se pode enviar. */
export async function allowSend(kind: CodeKind, email: string): Promise<{ ok: boolean; wait: number }> {
  const key = `${kind}:${email.toLowerCase()}`;
  const r = await pool.query(
    "INSERT INTO mail_throttle (key, sent_at) VALUES ($1, now()) ON CONFLICT (key) DO UPDATE SET sent_at = now() WHERE mail_throttle.sent_at < now() - make_interval(secs => $2) RETURNING 1",
    [key, COOLDOWN_SECONDS],
  );
  if (r.rowCount) return { ok: true, wait: 0 };
  const w = await pool.query("SELECT GREATEST(0, $2 - EXTRACT(EPOCH FROM (now() - sent_at)))::int AS wait FROM mail_throttle WHERE key = $1", [key, COOLDOWN_SECONDS]);
  return { ok: false, wait: Number(w.rows[0]?.wait ?? COOLDOWN_SECONDS) };
}

/** Gera e envia um código de 6 dígitos. Retorna false se ainda estiver no intervalo mínimo entre envios. */
export async function sendCode(kind: CodeKind, user: { id: string; name: string; email: string }, opts: { skipThrottle?: boolean } = {}) {
  if (!opts.skipThrottle && !(await allowSend(kind, user.email)).ok) return false;
  const code = String(crypto.randomInt(0, 1000000)).padStart(6, "0");
  const hash = await bcrypt.hash(code, 8);
  const col = kind === "verify" ? ["code_hash", "code_expires", "code_attempts"] : ["reset_hash", "reset_expires", "reset_attempts"];
  await pool.query(`UPDATE users SET ${col[0]}=$1, ${col[1]}=now()+interval '15 minutes', ${col[2]}=0 WHERE id=$2`, [hash, user.id]);
  const m =
    kind === "verify"
      ? template(user.name, "Confirme seu e-mail", "Use o código abaixo para confirmar seu cadastro na MOUORA AI.", code, 15)
      : template(user.name, "Redefinir sua senha", "Recebemos um pedido para redefinir a senha da sua conta. Use o código abaixo para continuar.", code, 15);
  await deliver(user.email, kind === "verify" ? "Seu código de verificação — MOUORA AI" : "Código para redefinir sua senha — MOUORA AI", m.text, m.html);
  return true;
}

/** Compatibilidade com o código existente. */
export const sendVerificationCode = (userId: string, name: string, email: string) => sendCode("verify", { id: userId, name, email });
