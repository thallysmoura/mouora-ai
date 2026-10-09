import "./contact.css";
import LoadingLink from "./LoadingLink";

type Lang = "pt" | "en" | "es";

const EMAIL = "suporte@mouora.ai";

const T = {
  pt: {
    base: "/pt", login: "Entrar", lang: "PT", nav: ["Como funciona", "Sobre", "Contato"],
    tag: "CONTATO · MOUORA AI", h1: ["Estamos aqui", "para"], h1e: "ajudar.",
    lead: "Tire suas dúvidas, receba suporte ou entre em contato com a equipe da MOUORA.", send: "Enviar mensagem", or: "Ou escreva para:",
    cTag: "VAMOS CONVERSAR", cH: ["Sua jornada na MOUORA", "sempre com apoio."], cP: "Estamos à disposição para te ajudar em qualquer etapa, desde o cadastro até as atividades na plataforma.",
    pTag: "PARA PARTICIPANTES", pH: "Fale com a MOUORA", pP: "Dúvidas sobre cadastro, acesso, tarefas, pagamentos e uso da plataforma.", pLink: "Abrir suporte",
    info: [["Atendimento", "Segunda a sexta"], ["Canal principal", "E-mail e suporte online"], ["Ajuda no painel", "Encontre orientações na sua conta"]],
    jTag: "COMECE AGORA", jH: "Pronto para fazer parte?", jP: "Crie sua conta e explore novas oportunidades com a MOUORA.", jB: "Criar minha conta",
    rights: "Todos os direitos reservados.", foot: ["Como funciona", "Sobre", "Contato", "Privacidade"], how: "/pt/como-funciona", about: "/pt/sobre", contact: "/pt/contato", privacy: "/pt/privacy",
  },
  en: {
    base: "", login: "Log in", lang: "EN", nav: ["How it works", "About", "Contact"],
    tag: "CONTACT · MOUORA AI", h1: ["We're here", "to"], h1e: "help.",
    lead: "Ask your questions, get support or get in touch with the MOUORA team.", send: "Send message", or: "Or write to:",
    cTag: "LET'S TALK", cH: ["Your journey at MOUORA", "always supported."], cP: "We're available to help you at every step, from sign-up to activities on the platform.",
    pTag: "FOR PARTICIPANTS", pH: "Talk to MOUORA", pP: "Questions about sign-up, access, tasks, payments and using the platform.", pLink: "Open support",
    info: [["Support hours", "Monday to Friday"], ["Main channel", "E-mail and online support"], ["Help in the dashboard", "Find guidance in your account"]],
    jTag: "START NOW", jH: "Ready to join?", jP: "Create your account and explore new opportunities with MOUORA.", jB: "Create my account",
    rights: "All rights reserved.", foot: ["How it works", "About", "Contact", "Privacy"], how: "/como-funciona", about: "/sobre", contact: "/contato", privacy: "/privacy",
  },
  es: {
    base: "/es", login: "Entrar", lang: "ES", nav: ["Cómo funciona", "Acerca de", "Contacto"],
    tag: "CONTACTO · MOUORA AI", h1: ["Estamos aquí", "para"], h1e: "ayudar.",
    lead: "Resuelve tus dudas, recibe soporte o ponte en contacto con el equipo de MOUORA.", send: "Enviar mensaje", or: "O escribe a:",
    cTag: "HABLEMOS", cH: ["Tu camino en MOUORA", "siempre con apoyo."], cP: "Estamos a tu disposición para ayudarte en cada etapa, desde el registro hasta las actividades en la plataforma.",
    pTag: "PARA PARTICIPANTES", pH: "Habla con MOUORA", pP: "Dudas sobre registro, acceso, tareas, pagos y uso de la plataforma.", pLink: "Abrir soporte",
    info: [["Atención", "Lunes a viernes"], ["Canal principal", "Correo y soporte en línea"], ["Ayuda en el panel", "Encuentra orientación en tu cuenta"]],
    jTag: "EMPIEZA AHORA", jH: "¿Listo para ser parte?", jP: "Crea tu cuenta y explora nuevas oportunidades con MOUORA.", jB: "Crear mi cuenta",
    rights: "Todos los derechos reservados.", foot: ["Cómo funciona", "Acerca de", "Contacto", "Privacidad"], how: "/es/como-funciona", about: "/es/sobre", contact: "/es/contato", privacy: "/es/privacy",
  },
} as const;

const st = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const Mail = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...st} aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.4" /><path d="m4 7.5 8 6 8-6" /></svg>
);
const Arrow = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...st} strokeWidth={2} aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
);
const Tag = ({ children }: { children: string }) => (<p className="ct-tag"><i aria-hidden="true" />{children}</p>);

const ICONS = [
  <svg key="c" width="26" height="26" viewBox="0 0 24 24" {...st}><rect x="4" y="5.5" width="16" height="14.5" rx="2.4" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /></svg>,
  <Mail key="m" size={26} />,
  <svg key="h" width="26" height="26" viewBox="0 0 24 24" {...st}><circle cx="12" cy="12" r="8.5" /><path d="M9.6 9.6a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.6M12 16.6v.1" /></svg>,
];

export default function ContactPage({ lang }: { lang: Lang }) {
  const t = T[lang];
  const home = t.base || "/";
  return (
    <div className="ct">
      <header className="ct-head">
        <a className="ct-logo" href={home} aria-label="MOUORA AI"><img src="/assets/brand/mouora-logo.webp" alt="MOUORA" /></a>
        <nav className="ct-nav" aria-label="Principal">
          <a href={t.how}>{t.nav[0]}</a>
          <a href={t.about}>{t.nav[1]}</a>
          <a className="is-active" href={t.contact}>{t.nav[2]}</a>
        </nav>
        <div className="ct-tools">
          <span className="ct-lang">
            <svg width="22" height="16" viewBox="0 0 28 20" aria-hidden="true" style={{ borderRadius: 3 }}><path fill="#009b3a" d="M0 0h28v20H0z" /><path fill="#ffdf00" d="m14 2 12 8-12 8L2 10z" /><circle cx="14" cy="10" r="4.4" fill="#002776" /></svg>
            {t.lang}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </span>
          <details className="ct-menu">
            <summary aria-label="Menu"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg></summary>
            <div className="ct-menu-panel">
              <a href={t.how}>{t.nav[0]}</a>
              <a href={t.about}>{t.nav[1]}</a>
              <a href={t.contact}>{t.nav[2]}</a>
              <a className="is-login" href={`/login?lang=${lang}`}>{t.login}</a>
            </div>
          </details>
          <LoadingLink className="ct-login" href={`/login?lang=${lang}`}>
            {t.login}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
          </LoadingLink>
        </div>
      </header>

      <main>
        <section className="ct-hero">
          <div className="ct-hero-text">
            <Tag>{t.tag}</Tag>
            <h1><span>{t.h1[0]}</span><span>{t.h1[1]} <em>{t.h1e}</em></span></h1>
            <p className="ct-lead">{t.lead}</p>
            <a className="ct-send" href={`mailto:${EMAIL}`}>{t.send}<Arrow size={22} /></a>
            <p className="ct-or"><Mail size={22} />{t.or} <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
          </div>
        </section>

        <section className="ct-talk">
          <div className="ct-talk-head">
            <div>
              <Tag>{t.cTag}</Tag>
              <h2>{t.cH[0]}<br /><em>{t.cH[1]}</em></h2>
            </div>
            <span className="ct-rule" aria-hidden="true" />
            <p>{t.cP}</p>
          </div>
          <div className="ct-cards">
            <article className="ct-card">
              <Tag>{t.pTag}</Tag>
              <h3>{t.pH}</h3>
              <p>{t.pP}</p>
              <div className="ct-card-foot">
                <span><Mail size={24} />{EMAIL}</span>
                <a href={`mailto:${EMAIL}`}>{t.pLink}<Arrow size={20} /></a>
              </div>
            </article>
            <article className="ct-card ct-info">
              {t.info.map(([title, desc], i) => (
                <div key={title}>
                  <span className="ct-ico" aria-hidden="true">{ICONS[i]}</span>
                  <p><strong>{title}</strong>{desc}</p>
                </div>
              ))}
            </article>
          </div>
        </section>

        <section className="ct-join">
          <div>
            <Tag>{t.jTag}</Tag>
            <h2>{t.jH}</h2>
            <p>{t.jP}</p>
          </div>
          <LoadingLink className="ct-join-btn" href={`/register?lang=${lang}`}>{t.jB}<Arrow size={22} /></LoadingLink>
        </section>
      </main>

      <footer className="ct-foot">
        <a className="ct-logo" href={home} aria-label="MOUORA AI"><img src="/assets/brand/mouora-logo.webp" alt="MOUORA" /></a>
        <span>© 2026 MOUORA AI. {t.rights}</span>
        <nav aria-label="Rodapé">
          <a href={t.how}>{t.foot[0]}</a>
          <a href={t.about}>{t.foot[1]}</a>
          <a href={t.contact}>{t.foot[2]}</a>
          <a href={t.privacy}>{t.foot[3]}</a>
        </nav>
      </footer>
    </div>
  );
}
