import { readFileSync } from "fs";
import { join } from "path";

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

export function renderDashboard(path: string, user: { name: string; email: string }, stubTitle?: string) {
  const c = cap();
  const first = user.name.trim().split(/\s+/)[0];
  const initials = user.name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
  const esc = (s: string) => s.replace(/[<>&"]/g, "");
  const fix = (h: string) =>
    h
      .replace(/<i data-ic="(\d+)"><\/i>/g, (_, n) => c.icons[Number(n)] ?? "")
      .replace(/g7ahe8@datoric\.mimix-ai\.xyz/g, esc(user.email))
      .replace(/\b(PE8EAR5V|FWAQ8EY4)\b/g, "••••••••")
      .replace(/Thallys/g, esc(first))
      .replace(/>TJ</g, `>${esc(initials)}<`)
      .replace(/https:\/\/s\.shopee\.com\.br\/\w+/g, "#")
      .replace(/<span class="dg-logo"[\s\S]*?<span>AI<\/span><\/span><\/span>/g, LOGO)
      .replace(/<button[^>]*role="switch"[^>]*>[\s\S]*?<\/button>/g, "")
      .replace(/<button[^>]*aria-label="Comunidade e redes sociais"[^>]*>[\s\S]*?<\/button>/g, "")
      .replace(/<button[^>]*dg-chat-trigger[^>]*>[\s\S]*?<\/button>/g, "")
      .replace(/<img alt="" src="\/assets\/brand\/mimix-ai-mark\.svg">/g, `<img alt="" src="/assets/brand/mouora-logo.webp" style="width:40px;height:48px;object-fit:cover;object-position:10.7% 50%">`)
      .replace(/MIMIX/g, "MOUORA")
      .replace(/mimix-ai\.xyz/g, "mouora.xyz");
  const route = ROUTES[path];
  const activeHref = route ? path : "/dashboard";
  let rail = c.rail.replace(' aria-current="page"', "");
  rail = rail.replace(`class="dashboard-link" href="${activeHref}"`, `aria-current="page" class="dashboard-link" href="${activeHref}"`);
  const label = route?.label ?? stubTitle ?? "Início";
  rail = rail.replace(/<a [^>]*href="\/dashboard\/tasks"[^>]*>[\s\S]*?<\/a>/, "");
  const header = c.header.replace(/(<span class="dg-breadcrumb"><span>\/<\/span>)[^<]*/, `$1${label}`);
  const body = route
    ? c.sections[route.section].replace(' hidden=""', "").replace(' inert=""', "")
    : `<main class="home-glass"><header class="home-glass-heading"><div><p>${esc(label)}</p><h1>${esc(label)}</h1></div></header><p style="padding:24px 0;opacity:.7">Esta área estará disponível em breve.</p></main>`;
  return fix(`<div class="dashboard-app dashboard-native" data-dashboard-design="glass" data-theme="light" data-locale="pt" data-route="${path}">${rail}${header}<div class="dashboard-native-content">${body}</div></div>`);
}
