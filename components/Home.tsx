import "./home.css";
import LoadingLink from "./LoadingLink";
import HeroVideo from "./HeroVideo";

type Lang = "pt" | "en" | "es";

const T = {
  pt: {
    base: "/pt", login: "Entrar", eyebrow: "MOUORA AI", l1: "Seu tempo", l2: "vale mais.", l3: "Faça ele render.",
    lead: "Realize tarefas no seu ritmo e seja recompensado por cada hora aprovada.", cta: "Começar agora",
    f: ["Cadastro grátis", "Sem experiência", "No seu horário"], tag: "Trabalhe no seu ritmo. Conquiste mais.",
    links: [["Como funciona", "/pt/como-funciona"], ["Sobre", "/pt/sobre"], ["Contato", "/pt/contato"], ["Termos", "/pt/terms"], ["Privacidade", "/pt/privacy"]],
  },
  en: {
    base: "", login: "Log in", eyebrow: "MOUORA AI", l1: "Your time", l2: "is worth more.", l3: "Make it count.",
    lead: "Complete tasks at your own pace and get rewarded for every approved hour.", cta: "Get started",
    f: ["Free sign-up", "No experience", "Your schedule"], tag: "Work at your pace. Achieve more.",
    links: [["How it works", "/como-funciona"], ["About", "/sobre"], ["Contact", "/contato"], ["Terms", "/terms"], ["Privacy", "/privacy"]],
  },
  es: {
    base: "/es", login: "Entrar", eyebrow: "MOUORA AI", l1: "Tu tiempo", l2: "vale más.", l3: "Haz que rinda.",
    lead: "Realiza tareas a tu ritmo y recibe una recompensa por cada hora aprobada.", cta: "Empezar ahora",
    f: ["Registro gratis", "Sin experiencia", "A tu horario"], tag: "Trabaja a tu ritmo. Logra más.",
    links: [["Cómo funciona", "/es/como-funciona"], ["Acerca de", "/es/sobre"], ["Contacto", "/es/contato"], ["Términos", "/es/terms"], ["Privacidad", "/es/privacy"]],
  },
} as const;

const ic = { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export default function Home({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <div className="mh">
      <div className="mh-photo" aria-hidden="true"><HeroVideo variant="d" /></div>
      <div className="mh-arcs" aria-hidden="true" />
      <header className="mh-top">
        <a className="mh-brand" href={t.base || "/"} aria-label="MOUORA AI"><img src="/assets/brand/mouora-logo.webp" alt="MOUORA" /></a>
        <LoadingLink className="mh-login" href={`/login?lang=${lang}`}>{t.login}</LoadingLink>
      </header>
      <main className="mh-hero">
        <p className="mh-eyebrow">{t.eyebrow}</p>
        <h1><span>{t.l1}</span><span>{t.l2}</span><em>{t.l3}</em></h1>
        <p className="mh-lead">{t.lead}</p>
        <LoadingLink className="mh-cta" href={`/register?lang=${lang}`}>
          {t.cta}
          <svg width="24" height="24" viewBox="0 0 24 24" {...ic} aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
        </LoadingLink>
        <div className="mh-mphoto" aria-hidden="true"><HeroVideo variant="m" /></div>
        <ul className="mh-feats">
          <li><span><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.2 2.5 5 13.2h5.6l-1 8.3 8.4-11h-5.7z" /></svg></span>{t.f[0]}</li>
          <li><span><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="8" r="3.3" /><path d="M2.5 19a6.5 6.5 0 0 1 13 0Z" /><circle cx="17" cy="9" r="2.6" /><path d="M16.2 13.6A5.8 5.8 0 0 1 21.5 19H17a8 8 0 0 0-.8-5.4Z" /></svg></span>{t.f[1]}</li>
          <li><span><svg width="26" height="26" viewBox="0 0 24 24" {...ic} aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg></span>{t.f[2]}</li>
        </ul>
      </main>
      <footer className="mh-foot">
        <span className="mh-copy">© 2026 MOUORA AI</span>
        <span className="mh-tag">{t.tag}</span>
        <nav className="mh-links" aria-label="Links">
          {t.links.map(([label, href]) => (<a key={href} href={href}>{label}</a>))}
        </nav>
      </footer>
    </div>
  );
}
