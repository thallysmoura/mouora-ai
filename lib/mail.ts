import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import path from "path";
import { pool } from "./db";
import { SITE_URL } from "./site";
import { escapeHtml } from "./escape";

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
  await transport().sendMail({ from: process.env.SMTP_FROM, to, subject, text, html, attachments: [{ filename: "mouora-logo.png", path: LOGO_PATH, cid: LOGO_CID }] });
}

const esc = escapeHtml;

const LOGO_CID = "mouora-logo@mouora";
const LOGO_PATH = path.join(process.cwd(), "public", "assets", "email", "mouora-logo.png");

function template(name: string, title: string, intro: string, code: string, minutes: number, subjectLine: string) {
  const first = (name.trim().split(/\s+/)[0] || "").replace(/\p{Cc}/gu, "");
  const firstH = esc(first);
  const site = SITE_URL;
  const text = `Olá, ${first}!

${intro}

Seu código: ${code}

Ele expira em ${minutes} minutos. Por segurança, nunca compartilhe este código com ninguém — a equipe da MOUORA AI jamais pede esse código.
Se você não fez esta solicitação, ignore este e-mail: sua conta continua segura.

—
MOUORA AI · ${site}
Política de Privacidade: ${site}/pt/privacy
Termos de Uso: ${site}/pt/terms
Este é um e-mail automático, por favor não responda.`;
  const font = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${esc(subjectLine)}</title></head>
<body style="margin:0;padding:0;background-color:#f6f3f0;${font};color:#12152a;-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px">Seu código é ${code}. Ele expira em ${minutes} minutos.&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f6f3f0"><tr><td align="center" style="padding:32px 12px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;background-color:#ffffff;border-radius:16px;border:1px solid #ece6e1">
<tr><td height="5" style="height:5px;line-height:5px;font-size:0;background-color:#f4501a;border-radius:16px 16px 0 0">&nbsp;</td></tr>
<tr><td align="center" style="padding:30px 32px 6px"><img src="cid:${LOGO_CID}" width="168" alt="MOUORA AI" style="display:block;border:0;outline:none;height:auto;width:168px;max-width:100%"></td></tr>
<tr><td style="padding:22px 36px 4px"><h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;font-weight:700;letter-spacing:-.01em;color:#12152a">${title}</h1>
<p style="margin:0;font-size:16px;line-height:1.6;color:#4b5063">Olá, <strong style="color:#12152a">${firstH}</strong>! ${intro}</p></td></tr>
<tr><td align="center" style="padding:22px 36px 10px"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding:16px 30px;border-radius:12px;background-color:#fff3ec;border:1px solid #ffd9c7;font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;font-size:36px;line-height:1.1;letter-spacing:10px;font-weight:700;color:#f4501a">${code}</td></tr></table>
<p style="margin:12px 0 0;font-size:13px;color:#7c8190">Válido por ${minutes} minutos</p></td></tr>
<tr><td style="padding:18px 36px 30px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:14px 16px;border-radius:10px;background-color:#f8f7f5;font-size:13px;line-height:1.6;color:#5d6377"><strong style="color:#12152a">Segurança:</strong> nunca compartilhe este código. A equipe da MOUORA AI jamais pede esse código por e-mail, telefone ou mensagem. Se você não fez esta solicitação, ignore este e-mail: sua conta continua segura.</td></tr></table></td></tr>
<tr><td style="border-top:1px solid #efe9e4;padding:22px 36px 26px;text-align:center;font-size:12px;line-height:1.7;color:#9a9fae">
<a href="${site}" style="color:#6b7186;text-decoration:none;font-weight:600">MOUORA AI</a><br>
<a href="${site}/pt/privacy" style="color:#9a9fae;text-decoration:underline">Política de Privacidade</a> &nbsp;·&nbsp; <a href="${site}/pt/terms" style="color:#9a9fae;text-decoration:underline">Termos de Uso</a><br>
Este é um e-mail automático, por favor não responda.<br>© ${new Date().getFullYear()} MOUORA AI. Todos os direitos reservados.</td></tr>
</table></td></tr></table></body></html>`;
  return { text, html };
}

export type CodeKind = "verify" | "reset";

/** Intervalo mínimo entre envios, por tipo de código e e-mail (independe de a conta existir). Retorna true se pode enviar. */
export async function allowSend(kind: CodeKind | "email", email: string): Promise<{ ok: boolean; wait: number }> {
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
  const subject = kind === "verify" ? "Seu código de verificação — MOUORA AI" : "Código para redefinir sua senha — MOUORA AI";
  const m =
    kind === "verify"
      ? template(user.name, "Confirme seu e-mail", "Use o código abaixo para confirmar seu cadastro na MOUORA AI.", code, 15, subject)
      : template(user.name, "Redefinir sua senha", "Recebemos um pedido para redefinir a senha da sua conta. Use o código abaixo para continuar.", code, 15, subject);
  await deliver(user.email, subject, m.text, m.html);
  return true;
}

/** Compatibilidade com o código existente. */
export const sendVerificationCode = (userId: string, name: string, email: string) => sendCode("verify", { id: userId, name, email });

/** Código para confirmar a troca de e-mail: enviado ao NOVO endereço e guardado (hash) junto ao usuário. */
export async function sendEmailChangeCode(user: { id: string; name: string }, newEmail: string) {
  const gate = await allowSend("email", newEmail);
  if (!gate.ok) return { ok: false as const, wait: gate.wait };
  const code = String(crypto.randomInt(0, 1000000)).padStart(6, "0");
  const hash = await bcrypt.hash(code, 8);
  await pool.query("UPDATE users SET pending_email=$1, pending_email_hash=$2, pending_email_expires=now()+interval '15 minutes', pending_email_attempts=0 WHERE id=$3", [newEmail, hash, user.id]);
  const subject = "Confirme seu novo e-mail — MOUORA AI";
  const m = template(user.name, "Confirme seu novo e-mail", "Use o código abaixo para confirmar a alteração do e-mail da sua conta na MOUORA AI.", code, 15, subject);
  await deliver(newEmail, subject, m.text, m.html);
  return { ok: true as const, wait: 0 };
}

/** Aviso de segurança enviado ao e-mail ANTIGO depois que a troca é concluída. */
export async function sendEmailChangedNotice(oldEmail: string, name: string, newEmail: string) {
  const first = (name.trim().split(/\s+/)[0] || "").replace(/\p{Cc}/gu, "");
  const [local, domain = ""] = newEmail.split("@");
  const masked = `${local.slice(0, 2)}***@${domain}`;
  const subject = "O e-mail da sua conta foi alterado — MOUORA AI";
  const text = `Olá, ${first}!\n\nO e-mail da sua conta MOUORA AI foi alterado para ${masked}.\n\nSe foi você, não precisa fazer nada. Se NÃO reconhece essa alteração, redefina sua senha imediatamente em ${SITE_URL}/forgot-password e entre em contato com o nosso suporte.\n\n—\nMOUORA AI · ${SITE_URL}\nEste é um e-mail automático, por favor não responda.`;
  const font = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background-color:#f6f3f0;${font};color:#12152a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f6f3f0"><tr><td align="center" style="padding:32px 12px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;background-color:#ffffff;border-radius:16px;border:1px solid #ece6e1">
<tr><td height="5" style="height:5px;line-height:5px;font-size:0;background-color:#f4501a;border-radius:16px 16px 0 0">&nbsp;</td></tr>
<tr><td align="center" style="padding:30px 32px 6px"><img src="cid:${LOGO_CID}" width="168" alt="MOUORA AI" style="display:block;border:0;height:auto;width:168px;max-width:100%"></td></tr>
<tr><td style="padding:22px 36px 8px"><h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;font-weight:700;color:#12152a">E-mail da conta alterado</h1>
<p style="margin:0;font-size:16px;line-height:1.6;color:#4b5063">Olá, <strong style="color:#12152a">${esc(first)}</strong>! O e-mail da sua conta MOUORA AI foi alterado para <strong style="color:#12152a">${esc(masked)}</strong>.</p></td></tr>
<tr><td style="padding:16px 36px 30px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:14px 16px;border-radius:10px;background-color:#fff3ec;border:1px solid #ffd9c7;font-size:13.5px;line-height:1.6;color:#5d3a2c"><strong>Não foi você?</strong> Redefina sua senha agora em <a href="${SITE_URL}/forgot-password" style="color:#ef481f">${SITE_URL}/forgot-password</a> e fale com o nosso suporte.</td></tr></table></td></tr>
<tr><td style="border-top:1px solid #efe9e4;padding:22px 36px 26px;text-align:center;font-size:12px;line-height:1.7;color:#9a9fae">
Este é um e-mail automático, por favor não responda.<br>© ${new Date().getFullYear()} MOUORA AI. Todos os direitos reservados.</td></tr>
</table></td></tr></table></body></html>`;
  await deliver(oldEmail, subject, text, html);
}
