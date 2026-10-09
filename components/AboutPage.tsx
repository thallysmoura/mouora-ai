import "./about.css";
import LoadingLink from "./LoadingLink";
import PageBgVideo from "./PageBgVideo";

type Lang = "pt" | "en" | "es";

const T = {
  pt: {
    base: "/pt", login: "Entrar", nav: ["Como funciona", "Sobre", "Contato"],
    heroTag: "SOBRE A MOUORA", h1: ["A vida acontece.", "A MOUORA transforma", "experiências em dados."],
    lead: ["Conectamos pessoas a projetos reais que ajudam", "a desenvolver tecnologias mais inteligentes."],
    eTag: "NOSSA ESSÊNCIA", eH: ["O cotidiano tem", "valor real."],
    eP: "Cada atividade que você realiza, seja no seu dia a dia, pode contribuir para projetos de tecnologia, com participação flexível e remuneração conforme as regras de cada projeto.",
    pTag: "NOSSO PROPÓSITO", pH: ["Tecnologia construída", "a partir da realidade."],
    pP: "Acreditamos que experiências reais são essenciais para desenvolver uma inteligência artificial mais útil e conectada ao mundo.",
    kTag: "NOSSOS PILARES", kH: ["Pessoas reais.", "Resultados reais."],
    kP: "A MOUORA AI existe para aproximar a tecnologia da realidade das pessoas, conectando rotinas do dia a dia a oportunidades que geram impacto.",
    pillars: [["Pessoas no centro", "Valorizamos o seu tempo, sua realidade e o seu potencial."], ["Dados com propósito", "Contribuímos para uma tecnologia mais útil, diversa e representativa."], ["Transparência sempre", "Regras claras, ganhos visíveis e respeito em todas as etapas."]],
    cTag: "FAÇA PARTE", cH: ["Participe de projetos que", "conectam rotina e inovação."], cP: "Crie sua conta e descubra novas oportunidades na MOUORA.", cB: "Criar minha conta",
    how: "/pt/como-funciona", about: "/pt/sobre", contact: "/pt/contato", terms: "/pt/terms", privacy: "/pt/privacy", fT: "Termos", fP: "Privacidade",
  },
  en: {
    base: "", login: "Log in", nav: ["How it works", "About", "Contact"],
    heroTag: "ABOUT MOUORA", h1: ["Life happens.", "MOUORA turns", "experiences into data."],
    lead: ["We connect people to real projects that help", "build smarter technologies."],
    eTag: "OUR ESSENCE", eH: ["Everyday life has", "real value."],
    eP: "Every activity you do, in your daily life, can contribute to technology projects, with flexible participation and pay according to each project's rules.",
    pTag: "OUR PURPOSE", pH: ["Technology built", "from reality."],
    pP: "We believe real experiences are essential to build artificial intelligence that is more useful and connected to the world.",
    kTag: "OUR PILLARS", kH: ["Real people.", "Real results."],
    kP: "MOUORA AI exists to bring technology closer to people's reality, connecting everyday routines to opportunities that create impact.",
    pillars: [["People at the center", "We value your time, your reality and your potential."], ["Data with purpose", "We help build technology that is more useful, diverse and representative."], ["Always transparent", "Clear rules, visible earnings and respect at every step."]],
    cTag: "JOIN US", cH: ["Take part in projects that", "connect routine and innovation."], cP: "Create your account and discover new opportunities at MOUORA.", cB: "Create my account",
    how: "/como-funciona", about: "/sobre", contact: "/contato", terms: "/terms", privacy: "/privacy", fT: "Terms", fP: "Privacy",
  },
  es: {
    base: "/es", login: "Entrar", nav: ["Cómo funciona", "Acerca de", "Contacto"],
    heroTag: "SOBRE MOUORA", h1: ["La vida sucede.", "MOUORA convierte", "experiencias en datos."],
    lead: ["Conectamos personas con proyectos reales que ayudan", "a desarrollar tecnologías más inteligentes."],
    eTag: "NUESTRA ESENCIA", eH: ["Lo cotidiano tiene", "valor real."],
    eP: "Cada actividad que realizas en tu día a día puede contribuir a proyectos de tecnología, con participación flexible y remuneración según las reglas de cada proyecto.",
    pTag: "NUESTRO PROPÓSITO", pH: ["Tecnología construida", "desde la realidad."],
    pP: "Creemos que las experiencias reales son esenciales para desarrollar una inteligencia artificial más útil y conectada con el mundo.",
    kTag: "NUESTROS PILARES", kH: ["Personas reales.", "Resultados reales."],
    kP: "MOUORA AI existe para acercar la tecnología a la realidad de las personas, conectando rutinas del día a día con oportunidades que generan impacto.",
    pillars: [["Personas en el centro", "Valoramos tu tiempo, tu realidad y tu potencial."], ["Datos con propósito", "Contribuimos a una tecnología más útil, diversa y representativa."], ["Transparencia siempre", "Reglas claras, ganancias visibles y respeto en todas las etapas."]],
    cTag: "SÉ PARTE", cH: ["Participa en proyectos que", "conectan rutina e innovación."], cP: "Crea tu cuenta y descubre nuevas oportunidades en MOUORA.", cB: "Crear mi cuenta",
    how: "/es/como-funciona", about: "/es/sobre", contact: "/es/contato", terms: "/es/terms", privacy: "/es/privacy", fT: "Términos", fP: "Privacidad",
  },
} as const;

const M = {
  pt: { eP: "Cada atividade pode contribuir para projetos de tecnologia.", pH: ["Tecnologia a partir", "da realidade."], kH: ["Pessoas.", "Inovação.", "Confiança."], chips: ["Pessoas", "Inovação", "Confiança"], cH: "Participe de projetos que conectam rotina e inovação." },
  en: { eP: "Every activity can contribute to technology projects.", pH: ["Technology built", "from reality."], kH: ["People.", "Innovation.", "Trust."], chips: ["People", "Innovation", "Trust"], cH: "Take part in projects that connect routine and innovation." },
  es: { eP: "Cada actividad puede contribuir a proyectos de tecnología.", pH: ["Tecnología desde", "la realidad."], kH: ["Personas.", "Innovación.", "Confianza."], chips: ["Personas", "Innovación", "Confianza"], cH: "Participa en proyectos que conectan rutina e innovación." },
} as const;

const CHIP_ICONS = [
  <svg key="p" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.8" /><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" /></svg>,
  <svg key="i" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5.9 1.1.9 1.7V16h5.4v-.5c0-.6.3-1.2.9-1.7A6 6 0 0 0 12 3Z" /></svg>,
  <svg key="s" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 4.5 5.8v5.7c0 4.4 3 7.9 7.5 9.5 4.5-1.6 7.5-5.1 7.5-9.5V5.8Z" /></svg>,
];

const Tag = ({ children }: { children: string }) => (
  <p className="ab-tag"><i aria-hidden="true" />{children}</p>
);

export default function AboutPage({ lang }: { lang: Lang }) {
  const t = T[lang];
  const m = M[lang];
  return (
    <div className="ab">
      <PageBgVideo />
      <header className="ab-head">
        <a className="ab-logo" href={t.base || "/"} aria-label="MOUORA AI"><img src="/assets/brand/mouora-logo.webp" alt="MOUORA" /></a>
        <nav className="ab-nav" aria-label="Principal">
          <a href={t.how}>{t.nav[0]}</a>
          <a className="is-active" href={t.about}>{t.nav[1]}</a>
          <a href={t.contact}>{t.nav[2]}</a>
        </nav>
        <span className="ab-lang">{lang.toUpperCase()}<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></span>
        <details className="ab-menu">
          <summary aria-label="Menu"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg></summary>
          <div className="ab-menu-panel">
            <a href={t.how}>{t.nav[0]}</a>
            <a href={t.about}>{t.nav[1]}</a>
            <a href={t.contact}>{t.nav[2]}</a>
            <a className="is-login" href={`/login?lang=${lang}`}>{t.login}</a>
          </div>
        </details>
        <LoadingLink className="ab-login" href={`/login?lang=${lang}`}>
          {t.login}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
        </LoadingLink>
      </header>

      <main>
        <section className="ab-banner ab-hero">
          <div className="ab-hero-text">
            <Tag>{t.heroTag}</Tag>
            <h1><span>{t.h1[0]}</span><span>{t.h1[1]}</span><em>{t.h1[2]}</em></h1>
            <p className="ab-lead">{t.lead[0]} {t.lead[1]}</p>
          </div>
        </section>

        <section className="ab-split">
          <div>
            <Tag>{t.eTag}</Tag>
            <h2>{t.eH[0]}<br /><em>{t.eH[1]}</em></h2>
          </div>
          <span className="ab-rule" aria-hidden="true" />
          <p className="ab-d">{t.eP}</p>
          <p className="ab-m">{m.eP}</p>
        </section>

        <section className="ab-banner ab-purpose">
          <div className="ab-banner-text">
            <Tag>{t.pTag}</Tag>
            <h2 className="ab-d">{t.pH[0]}<br /><em>{t.pH[1]}</em></h2>
            <h2 className="ab-m">{m.pH[0]}<br /><em>{m.pH[1]}</em></h2>
            <p className="ab-d">{t.pP}</p>
          </div>
        </section>

        <section className="ab-pillars">
          <div className="ab-m ab-m-pillars">
            <Tag>{t.kTag}</Tag>
            <h2>{m.kH[0]} <em>{m.kH[1]}</em> {m.kH[2]}</h2>
            <div className="ab-chips">{m.chips.map((c, i) => (<span key={c}>{CHIP_ICONS[i]}{c}</span>))}</div>
          </div>
          <div className="ab-split ab-split--p ab-d">
            <div>
              <Tag>{t.kTag}</Tag>
              <h2>{t.kH[0]}<br /><em>{t.kH[1]}</em></h2>
            </div>
            <span className="ab-rule" aria-hidden="true" />
            <p>{t.kP}</p>
          </div>
          <div className="ab-pillar-grid ab-d">
            {t.pillars.map(([title, desc]) => (
              <div key={title}><strong>{title}</strong><p>{desc}</p></div>
            ))}
          </div>
        </section>

        <section className="ab-banner ab-join">
          <div className="ab-banner-text">
            <div className="ab-d">
              <Tag>{t.cTag}</Tag>
              <h2>{t.cH[0]}<br />{t.cH[1]}</h2>
              <p>{t.cP}</p>
            </div>
            <h2 className="ab-m">{m.cH}</h2>
          </div>
          <LoadingLink className="ab-join-btn" href={`/register?lang=${lang}`}>
            {t.cB}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
          </LoadingLink>
        </section>
      </main>

      <footer className="ab-foot">
        <span>© 2026 MOUORA AI</span>
        <a href={t.terms}>{t.fT}</a>
        <a href={t.privacy}>{t.fP}</a>
      </footer>
    </div>
  );
}
