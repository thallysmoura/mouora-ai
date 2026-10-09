import "./how.css";
import LoadingLink from "./LoadingLink";

type Lang = "pt" | "en" | "es";

const T = {
  pt: {
    base: "/pt", login: "Entrar", nav: ["Como funciona", "Sobre", "Contato"],
    h1a: "Como funciona", h1b: "na", lead: "Você participa de projetos reais de dados, em primeira pessoa, realizando tarefas do seu dia a dia e recebe horas aprovadas pelo seu trabalho.",
    eyebrow: "EM APENAS 4 ETAPAS", h2: "Do seu cadastro aos seus ganhos.",
    steps: [["Cadastro", "Crie sua conta e complete seu perfil."], ["Tarefa", "Escolha um projeto e siga as instruções."], ["Revisão", "Seu envio é analisado e validado."], ["Ganhos", "Acompanhe horas aprovadas e seus ganhos."]],
    perks: [["Processo transparente", "Regras claras e acompanhamento do seu progresso."], ["Suporte quando precisar", "Nossa equipe está ao seu lado sempre que precisar."], ["Seus dados protegidos", "Seus dados são tratados com segurança e privacidade."]],
    ctaT: "Pronto para começar?", ctaP: "Crie sua conta e participe de projetos reais na MOUORA AI.", ctaB: "Criar minha conta",
    foot: ["Como funciona", "Sobre", "Contato", "Privacidade", "Termos"], rights: "Todos os direitos reservados.",
    privacy: "/pt/privacy", terms: "/pt/terms", how: "/pt/como-funciona",
  },
  en: {
    base: "", login: "Log in", nav: ["How it works", "About", "Contact"],
    h1a: "How it works", h1b: "at", lead: "You take part in real data projects, in first person, doing everyday tasks and earn approved hours for your work.",
    eyebrow: "IN JUST 4 STEPS", h2: "From sign-up to earnings.",
    steps: [["Sign up", "Create your account and complete your profile."], ["Task", "Pick a project and follow the instructions."], ["Review", "Your submission is checked and validated."], ["Earnings", "Track approved hours and your earnings."]],
    perks: [["Transparent process", "Clear rules and tracking of your progress."], ["Support when you need it", "Our team is by your side whenever you need."], ["Your data protected", "Your data is handled with security and privacy."]],
    ctaT: "Ready to start?", ctaP: "Create your account and join real projects at MOUORA AI.", ctaB: "Create my account",
    foot: ["How it works", "About", "Contact", "Privacy", "Terms"], rights: "All rights reserved.",
    privacy: "/privacy", terms: "/terms", how: "/como-funciona",
  },
  es: {
    base: "/es", login: "Entrar", nav: ["Cómo funciona", "Acerca de", "Contacto"],
    h1a: "Cómo funciona", h1b: "en", lead: "Participas en proyectos reales de datos, en primera persona, realizando tareas de tu día a día y recibes horas aprobadas por tu trabajo.",
    eyebrow: "EN SOLO 4 PASOS", h2: "De tu registro a tus ganancias.",
    steps: [["Registro", "Crea tu cuenta y completa tu perfil."], ["Tarea", "Elige un proyecto y sigue las instrucciones."], ["Revisión", "Tu envío es analizado y validado."], ["Ganancias", "Sigue tus horas aprobadas y tus ganancias."]],
    perks: [["Proceso transparente", "Reglas claras y seguimiento de tu progreso."], ["Soporte cuando lo necesites", "Nuestro equipo está a tu lado siempre que lo necesites."], ["Tus datos protegidos", "Tus datos se tratan con seguridad y privacidad."]],
    ctaT: "¿Listo para empezar?", ctaP: "Crea tu cuenta y participa en proyectos reales en MOUORA AI.", ctaB: "Crear mi cuenta",
    foot: ["Cómo funciona", "Acerca de", "Contacto", "Privacidad", "Términos"], rights: "Todos los derechos reservados.",
    privacy: "/es/privacy", terms: "/es/terms", how: "/es/como-funciona",
  },
} as const;

const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const ICONS = [
  <svg key="u" width="24" height="24" viewBox="0 0 24 24" {...s}><circle cx="12" cy="8" r="3.6" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>,
  <svg key="l" width="24" height="24" viewBox="0 0 24 24" {...s}><path d="M9 6.5h11M9 12h11M9 17.5h11" /><circle cx="4.7" cy="6.5" r=".6" /><circle cx="4.7" cy="12" r=".6" /><circle cx="4.7" cy="17.5" r=".6" /></svg>,
  <svg key="c" width="24" height="24" viewBox="0 0 24 24" {...s}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>,
  <svg key="b" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="4.5" y="12" width="3.6" height="8" rx="1" /><rect x="10.2" y="8" width="3.6" height="12" rx="1" /><rect x="15.9" y="4" width="3.6" height="16" rx="1" /></svg>,
];
const PERKS = [
  <svg key="s" width="46" height="46" viewBox="0 0 24 24" {...s} strokeWidth={1.4}><path d="M12 3 4.5 5.8v5.7c0 4.4 3 7.9 7.5 9.5 4.5-1.6 7.5-5.1 7.5-9.5V5.8Z" /></svg>,
  <svg key="h" width="46" height="46" viewBox="0 0 24 24" {...s} strokeWidth={1.4}><path d="M4.5 13v-1.5a7.5 7.5 0 0 1 15 0V13" /><rect x="3.5" y="12.5" width="3.6" height="6" rx="1.6" /><rect x="16.9" y="12.5" width="3.6" height="6" rx="1.6" /><path d="M19 18.5c0 1.6-1.6 2.5-4 2.5h-1.5" /></svg>,
  <svg key="k" width="46" height="46" viewBox="0 0 24 24" {...s} strokeWidth={1.4}><rect x="4.5" y="10" width="15" height="10.5" rx="2.5" /><path d="M8 10V7.5a4 4 0 0 1 8 0V10" /><circle cx="12" cy="15" r="1.1" fill="currentColor" /></svg>,
];

export default function HowItWorks({ lang }: { lang: Lang }) {
  const t = T[lang];
  const home = t.base || "/";
  const about = `${t.base}/sobre`;
  const contact = `${t.base}/contato`;
  return (
    <div className="hw">
      <header className="hw-head">
        <a className="hw-logo" href={home} aria-label="MOUORA AI"><img src="/assets/brand/mouora-logo.webp" alt="MOUORA" /></a>
        <nav className="hw-nav" aria-label="Principal">
          <a className="is-active" href={t.how}>{t.nav[0]}</a>
          <a href={about}>{t.nav[1]}</a>
          <a href={contact}>{t.nav[2]}</a>
        </nav>
        <LoadingLink className="hw-login" href={`/login?lang=${lang}`}>{t.login}</LoadingLink>
      </header>

      <main className="hw-wrap">
        <section className="hw-hero">
          <div className="hw-hero-text">
            <h1>{t.h1a}<br />{t.h1b} <em>MOUORA AI.</em></h1>
            <p>{t.lead}</p>
          </div>
          <img className="hw-hero-img" src="/assets/how-hero.webp" alt="" />
        </section>

        <section className="hw-steps">
          <p className="hw-eyebrow">{t.eyebrow}</p>
          <h2>{t.h2}</h2>
          <ol>
            {t.steps.map(([title, desc], i) => (
              <li key={title}>
                <span className="hw-num">{String(i + 1).padStart(2, "0")}</span>
                <strong>{title}</strong>
                <span className="hw-sep" aria-hidden="true" />
                <p>{desc}</p>
                <span className="hw-ico" aria-hidden="true">{ICONS[i]}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="hw-perks">
          {t.perks.map(([title, desc], i) => (
            <div key={title}>
              <span aria-hidden="true">{PERKS[i]}</span>
              <p><strong>{title}</strong>{desc}</p>
            </div>
          ))}
        </section>
      </main>

      <section className="hw-cta">
        <div>
          <h2>{t.ctaT}</h2>
          <p>{t.ctaP}</p>
        </div>
        <LoadingLink className="hw-cta-btn" href={`/register?lang=${lang}`}>
          {t.ctaB}
          <svg width="20" height="20" viewBox="0 0 24 24" {...s} aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
        </LoadingLink>
      </section>

      <footer className="hw-foot">
        <a className="hw-logo" href={home} aria-label="MOUORA AI"><img src="/assets/brand/mouora-logo.webp" alt="MOUORA" /></a>
        <nav aria-label="Rodapé">
          <a href={t.how}>{t.foot[0]}</a>
          <a href={about}>{t.foot[1]}</a>
          <a href={contact}>{t.foot[2]}</a>
          <a href={t.privacy}>{t.foot[3]}</a>
          <a href={t.terms}>{t.foot[4]}</a>
        </nav>
        <span>© 2026 MOUORA AI. {t.rights}</span>
      </footer>
    </div>
  );
}
