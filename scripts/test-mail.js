// Testa o envio de e-mail (SMTP) usando as variáveis do .env.local.
// Uso: node scripts/test-mail.js [destinatario@exemplo.com]
const fs = require("fs");
const nodemailer = require("nodemailer");
const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8").split("\n").filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.split("=")[0], l.slice(l.indexOf("=") + 1).replace(/^"|"$/g, "")]),
);
const to = process.argv[2] || env.SMTP_USER;
const t = nodemailer.createTransport({ host: env.SMTP_HOST, port: Number(env.SMTP_PORT || 465), secure: Number(env.SMTP_PORT || 465) === 465, auth: { user: env.SMTP_USER, pass: env.SMTP_PASS } });
t.verify()
  .then(() => {
    const site = (env.NEXT_PUBLIC_SITE_URL || "https://mouora.xyz").replace(/\/$/, "");
    const font = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
    const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Teste de e-mail — MOUORA AI</title></head>
<body style="margin:0;padding:0;background-color:#f6f3f0;${font};color:#12152a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f6f3f0"><tr><td align="center" style="padding:32px 12px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;background-color:#ffffff;border-radius:16px;border:1px solid #ece6e1">
<tr><td height="5" style="height:5px;line-height:5px;font-size:0;background-color:#f4501a;border-radius:16px 16px 0 0">&nbsp;</td></tr>
<tr><td align="center" style="padding:30px 32px 6px"><img src="cid:mouora-logo@mouora" width="168" alt="MOUORA AI" style="display:block;border:0;height:auto;width:168px;max-width:100%"></td></tr>
<tr><td style="padding:22px 36px 30px"><h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;font-weight:700;color:#12152a">Teste de e-mail</h1>
<p style="margin:0;font-size:16px;line-height:1.6;color:#4b5063">Se você recebeu esta mensagem, o envio de e-mails da MOUORA AI está funcionando.</p></td></tr>
<tr><td style="border-top:1px solid #efe9e4;padding:22px 36px 26px;text-align:center;font-size:12px;line-height:1.7;color:#9a9fae">
<a href="${site}" style="color:#6b7186;text-decoration:none;font-weight:600">MOUORA AI</a><br>
<a href="${site}/pt/privacy" style="color:#9a9fae;text-decoration:underline">Política de Privacidade</a> &nbsp;·&nbsp; <a href="${site}/pt/terms" style="color:#9a9fae;text-decoration:underline">Termos de Uso</a><br>
Este é um e-mail automático, por favor não responda.<br>© ${new Date().getFullYear()} MOUORA AI. Todos os direitos reservados.</td></tr>
</table></td></tr></table></body></html>`;
    const text = `Teste de e-mail

Se você recebeu esta mensagem, o envio de e-mails da MOUORA AI está funcionando.

—
MOUORA AI · ${site}
Este é um e-mail automático, por favor não responda.`;
    return t.sendMail({ from: env.SMTP_FROM, to, subject: "Teste de e-mail — MOUORA AI", text, html, attachments: [{ filename: "mouora-logo.png", path: "public/assets/email/mouora-logo.png", cid: "mouora-logo@mouora" }] });
  })
  .then((i) => console.log("OK — e-mail enviado para", to, "id:", i.messageId))
  .catch((e) => {
    console.error("FALHOU:", e.responseCode || e.code, String(e.response || e.message).split("\n")[0]);
    if (e.responseCode === 535) console.error("\n→ O Gmail recusou o login. Use uma SENHA DE APP (não a senha normal da conta). Veja o passo a passo.");
    process.exit(1);
  });
