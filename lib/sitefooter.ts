import { escapeHtml } from "./escape";
import type { Lang } from "./langswitch";

const T = {
  pt: { base: "/pt", tag: "Trabalhe no seu ritmo. Conquiste mais.", rights: "Todos os direitos reservados.", nav: "Links do rodapé", legal: "Links legais", links: [["Como funciona", "/pt/como-funciona"], ["Sobre", "/pt/sobre"], ["Contato", "/pt/contato"], ["Termos", "/pt/terms"], ["Privacidade", "/pt/privacy"]] },
  en: { base: "", tag: "Work at your pace. Achieve more.", rights: "All rights reserved.", nav: "Footer links", legal: "Legal links", links: [["How it works", "/como-funciona"], ["About", "/sobre"], ["Contact", "/contato"], ["Terms", "/terms"], ["Privacy", "/privacy"]] },
  es: { base: "/es", tag: "Trabaja a tu ritmo. Logra más.", rights: "Todos los derechos reservados.", nav: "Enlaces del pie de página", legal: "Enlaces legales", links: [["Cómo funciona", "/es/como-funciona"], ["Acerca de", "/es/sobre"], ["Contacto", "/es/contato"], ["Términos", "/es/terms"], ["Privacidad", "/es/privacy"]] },
} as const;

/** Rodapé único do site (todas as páginas, exceto o painel). */
export function siteFooterHtml(lang: Lang): string {
  const t = T[lang];
  const a = (l: readonly [string, string]) => `<a href="${l[1]}">${escapeHtml(l[0])}</a>`;
  const main = t.links.slice(0, 3).map(a).join("");
  const legal = t.links.slice(3).map(a).join("");
  return `<footer class="sf" role="contentinfo"><div class="sf-in"><div class="sf-top"><div class="sf-brand"><a class="sf-logo" href="${t.base || "/"}" aria-label="MOUORA AI"><img src="/assets/brand/mouora-logo.webp" alt="MOUORA" width="120" height="40" loading="lazy"></a><p class="sf-tag">${escapeHtml(t.tag)}</p></div><nav class="sf-nav" aria-label="${t.nav}">${main}</nav></div><div class="sf-bottom"><p class="sf-copy">© ${new Date().getFullYear()} MOUORA AI. ${t.rights}</p><nav class="sf-legal" aria-label="${t.legal}">${legal}</nav></div></div></footer>`;
}

/** Troca o primeiro <footer> de um HTML estático pelo rodapé padrão. */
export const withSiteFooter = (html: string, lang: Lang) => html.replace(/<footer[\s\S]*?<\/footer>/, siteFooterHtml(lang));
