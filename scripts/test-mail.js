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
  .then(() => t.sendMail({ from: env.SMTP_FROM, to, subject: "Teste de e-mail — MOUORA AI", text: "Se você recebeu esta mensagem, o envio de e-mails está funcionando.", html: "<p>Se você recebeu esta mensagem, o <b>envio de e-mails</b> da MOUORA AI está funcionando.</p>" }))
  .then((i) => console.log("OK — e-mail enviado para", to, "id:", i.messageId))
  .catch((e) => {
    console.error("FALHOU:", e.responseCode || e.code, String(e.response || e.message).split("\n")[0]);
    if (e.responseCode === 535) console.error("\n→ O Gmail recusou o login. Use uma SENHA DE APP (não a senha normal da conta). Veja o passo a passo.");
    process.exit(1);
  });
