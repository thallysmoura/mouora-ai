// Troca o cabeçalho e o rodapé das páginas legais (Termos/Privacidade) pelo padrão visual Mouora.
const fs = require("fs");
const L = {
  pt: { base: "/pt", how: "/pt/como-funciona", about: "/pt/sobre", contact: "/pt/contato", nav: ["Como funciona", "Sobre", "Contato"], login: "Entrar", rights: "Todos os direitos reservados.", terms: ["/pt/terms", "Termos"], privacy: ["/pt/privacy", "Privacidade"], langs: ["/pt/", "/", "/es/"] },
  en: { base: "", how: "/como-funciona", about: "/sobre", contact: "/contato", nav: ["How it works", "About", "Contact"], login: "Log in", rights: "All rights reserved.", terms: ["/terms", "Terms"], privacy: ["/privacy", "Privacy"] },
  es: { base: "/es", how: "/es/como-funciona", about: "/es/sobre", contact: "/es/contato", nav: ["Cómo funciona", "Acerca de", "Contacto"], login: "Entrar", rights: "Todos los derechos reservados.", terms: ["/es/terms", "Términos"], privacy: ["/es/privacy", "Privacidad"] },
};
const files = { "pt_privacy": ["pt", "privacy"], "pt_terms": ["pt", "terms"], "x_privacy": ["en", "privacy"], "x_terms": ["en", "terms"], "x_es_privacy": ["es", "privacy"], "x_es_terms": ["es", "terms"] };
const arrow = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
for (const [f, [lang, kind]] of Object.entries(files)) {
  const p = `content/${f}.html`;
  let s = fs.readFileSync(p, "utf8");
  if (s.includes("lg-head")) continue;
  const t = L[lang];
  const paths = { pt: `/pt/${kind}`, en: `/${kind}`, es: `/es/${kind}` };
  const home = t.base || "/";
  const head = `<header class="lg-head"><a class="lg-logo" href="${home}" aria-label="MOUORA AI"><img src="/assets/brand/mouora-logo.webp" alt="MOUORA"/></a><nav class="lg-nav" aria-label="Principal"><a href="${t.how}">${t.nav[0]}</a><a href="${t.about}">${t.nav[1]}</a><a href="${t.contact}">${t.nav[2]}</a></nav><div class="lg-tools"><div class="lg-lang" role="group" aria-label="Idioma">${["pt", "en", "es"].map((k) => `<a href="${paths[k]}"${k === lang ? ' class="is-active" aria-current="true"' : ""}>${k.toUpperCase()}</a>`).join("")}</div><a class="lg-login" href="/login?lang=${lang}">${t.login}${arrow}</a></div></header>`;
  const foot = `<footer class="lg-foot"><a class="lg-logo" href="${home}" aria-label="MOUORA AI"><img src="/assets/brand/mouora-logo.webp" alt="MOUORA"/></a><span>© 2026 MOUORA AI. ${t.rights}</span><nav aria-label="Rodapé"><a href="${t.how}">${t.nav[0]}</a><a href="${t.about}">${t.nav[1]}</a><a href="${t.contact}">${t.nav[2]}</a><a href="${t.privacy[0]}">${t.privacy[1]}</a><a href="${t.terms[0]}">${t.terms[1]}</a></nav></footer>`;
  const before = s.length;
  s = s.replace(/<header class="terms-header">[\s\S]*?<\/header>/, head);
  s = s.replace(/<footer class="terms-footer">[\s\S]*?<\/footer>/, foot);
  fs.writeFileSync(p, s);
  console.log(f, before, "->", s.length);
}
