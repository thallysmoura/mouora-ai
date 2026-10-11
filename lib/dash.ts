import { readFileSync } from "fs";
import { join } from "path";
import { escapeHtml } from "./escape";

type Capture = { rail: string; header: string; sections: string[]; icons: string[] };
let cache: Capture | null = null;
const cap = () => (cache ??= JSON.parse(readFileSync(join(process.cwd(), "content", "dash.json"), "utf8")) as Capture);

export const ROUTES: Record<string, { section: number; label: string }> = {
  "/dashboard": { section: 0, label: "Início" },
  "/dashboard/referrals": { section: 1, label: "Rede" },
  "/dashboard/projects": { section: 2, label: "Projetos" },
  "/dashboard/earnings": { section: 3, label: "Ganhos" },
  "/dashboard/activity": { section: 4, label: "Atividade" },
};

const LOGO = `<img class="mouora-logo" src="/assets/brand/mouora-logo.webp" alt="MOUORA" width="150" height="49" style="height:44px;width:auto">`;

export function renderDashboard(path: string, user: { name: string; email: string; avatarUrl?: string }, stubTitle?: string, opts: { slot?: boolean; eyebrow?: string } = {}) {
  const c = cap();
  const first = user.name.trim().split(/\s+/)[0];
  const initials = user.name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
  const esc = escapeHtml;
  const photo = user.avatarUrl && user.avatarUrl.startsWith("https://res.cloudinary.com/") ? user.avatarUrl : "";
  const avatarHtml = photo ? `<img class="um-avatar" src="${esc(photo)}" alt="" width="32" height="32" loading="lazy" decoding="async">` : `<span class="um-avatar um-initials" aria-hidden="true">${esc(initials)}</span>`;
  const userMenu = `<details class="um"><summary aria-label="Menu da conta">${avatarHtml}<span class="um-name">${esc(first)}</span><svg class="um-chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary><div class="um-panel"><div class="um-who">${avatarHtml}<div><strong>${esc(user.name)}</strong><span>${esc(user.email)}</span></div></div><a class="um-item" href="/dashboard/settings/profile"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8.5" r="3.7"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>Meu perfil</a><button type="button" class="um-item um-out" data-logout><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M16 8l4 4-4 4M20 12H9"/></svg>Sair</button></div></details>`;
  const fix = (h: string) =>
    h
      .replace(/<div class="dg-language-picker">[\s\S]*?<\/div>/, () => userMenu)
      .replace(/<i data-ic="(\d+)"><\/i>/g, (_, n) => c.icons[Number(n)] ?? "")
      .replace(/g7ahe8@datoric\.mimix-ai\.xyz/g, () => esc(user.email))
      .replace(/\b(PE8EAR5V|FWAQ8EY4)\b/g, "••••••••")
      .replace(/Thallys/g, () => esc(first))
      .replace(/>TJ</g, () => `>${esc(initials)}<`)
      .replace(/https:\/\/s\.shopee\.com\.br\/\w+/g, "#")
      .replace(/<span class="dg-logo"[\s\S]*?<span>AI<\/span><\/span><\/span>/g, LOGO)
      .replace(/<button[^>]*role="switch"[^>]*>[\s\S]*?<\/button>/g, "")
      .replace(/<button[^>]*aria-label="Comunidade e redes sociais"[^>]*>[\s\S]*?<\/button>/g, "")
      .replace(/<button[^>]*dg-chat-trigger[^>]*>[\s\S]*?<\/button>/g, "")
      .replace(/<img alt="" src="\/assets\/brand\/mimix-ai-mark\.svg">/g, `<img alt="" src="/assets/brand/mouora-logo.webp" style="width:40px;height:48px;object-fit:cover;object-position:10.7% 50%">`)
      .replace(/MIMIX/g, "MOUORA")
      .replace(/mimix-ai\.xyz/g, "mouora.xyz");
  const route = ROUTES[path];
  const activeHref = route || c.rail.includes(`href="${path}"`) ? path : "/dashboard";
  let rail = c.rail.replace(' aria-current="page"', "");
  rail = rail.replace(`class="dashboard-link" href="${activeHref}"`, `aria-current="page" class="dashboard-link" href="${activeHref}"`);
  const label = route?.label ?? stubTitle ?? "Início";
  rail = rail.replace(/<a [^>]*href="\/dashboard\/tasks"[^>]*>[\s\S]*?<\/a>/, "");
  const header = c.header.replace(/(<span class="dg-breadcrumb"><span>\/<\/span>)[^<]*/, (_m, a) => a + esc(label));
  const body = route
    ? c.sections[route.section].replace(' hidden=""', "").replace(' inert=""', "")
    : `<main class="home-glass"><header class="home-glass-heading"><div><p>${esc(opts.eyebrow ?? label)}</p><h1>${esc(label)}</h1></div></header>${opts.slot ? '<div id="dg-slot"></div>' : '<p style="padding:24px 0;opacity:.7">Esta área estará disponível em breve.</p>'}</main>`;
  return fix(`<div class="dashboard-app dashboard-native" data-dashboard-design="glass" data-theme="light" data-locale="pt" data-route="${path}">${rail}${header}<div class="dashboard-native-content">${body}</div></div>`);
}
