import { withSiteFooter } from "./sitefooter";
export type Lang = "pt" | "en" | "es";

const flag: Record<Lang, string> = {
  pt: '<svg width="26" height="18" viewBox="0 0 28 20" aria-hidden="true"><rect width="28" height="20" rx="3" fill="#009b3a"/><path fill="#ffdf00" d="m14 2 12 8-12 8L2 10z"/><circle cx="14" cy="10" r="4.4" fill="#002776"/></svg>',
  en: '<svg width="26" height="18" viewBox="0 0 28 20" aria-hidden="true"><rect width="28" height="20" rx="3" fill="#fff"/><path fill="#d22f3c" d="M0 0h28v1.54H0zm0 3.08h28v1.54H0zm0 3.08h28V7.7H0zm0 3.08h28v1.54H0zm0 3.08h28v1.54H0zm0 3.08h28V20H0z"/><path fill="#2b3a8c" d="M0 3a3 3 0 0 1 3-3h9v10.8H0z"/></svg>',
  es: '<svg width="26" height="18" viewBox="0 0 28 20" aria-hidden="true"><rect width="28" height="20" rx="3" fill="#c8202f"/><rect y="5" width="28" height="10" fill="#f6c200"/></svg>',
};

const names: Record<Lang, string> = { pt: "Português", en: "English", es: "Español" };
const label: Record<Lang, string> = { pt: "Idioma", en: "Language", es: "Idioma" };
const prefix: Record<Lang, string> = { pt: "/pt", en: "", es: "/es" };
const chevron = '<svg class="lsw-chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
const check = '<svg class="lsw-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7"/></svg>';

/** slug = caminho da página sem prefixo de idioma, ex.: "", "/sobre", "/privacy" */
export function langSwitchHtml(lang: Lang, slug = "", query = false): string {
  const items = (["pt", "en", "es"] as Lang[]).map((l) => {
    const href = query ? `${slug}?lang=${l}` : prefix[l] + slug || "/";
    const on = l === lang;
    return `<a class="lsw-item${on ? " is-active" : ""}" href="${href}"${on ? ' aria-current="true"' : ""}>${flag[l]}<span>${names[l]}</span>${on ? check : ""}</a>`;
  }).join("");
  return `<details class="lsw"><summary aria-label="${label[lang]}">${flag[lang]}<b>${lang.toUpperCase()}</b>${chevron}</summary><div class="lsw-panel"><span class="lsw-label">${label[lang]}</span>${items}</div></details>`;
}

/** Troca o seletor PT/EN/ES antigo dos HTMLs legais pelo dropdown. */
export function withLangSwitch(html: string, lang: Lang, slug: string): string {
  return withSiteFooter(html, lang).replace(/<div class="lg-lang"[\s\S]*?<\/div>/, langSwitchHtml(lang, slug));
}
