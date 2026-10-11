import type { Metadata } from "next";
import LoadingLink from "@/components/LoadingLink";
import ForgotFlow from "@/components/ForgotFlow";
import { AuthLang } from "@/components/AuthI18n";
import LangSwitch from "@/components/LangSwitch";
import SiteFooter from "@/components/SiteFooter";
import { homePath, pickLang, tr } from "@/lib/authi18n";
import "../login/login.css";

type Props = { searchParams: Promise<{ lang?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return { title: tr(pickLang((await searchParams).lang)).forgotTitle, robots: { index: false } };
}

const ic = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export default async function ForgotPassword({ searchParams }: Props) {
  const lang = pickLang((await searchParams).lang);
  const t = tr(lang);
  return (
    <AuthLang lang={lang}>
      <div className="mo-login mo-login--m" lang={lang}>
        <div className="mo-langpos"><LangSwitch lang={lang} slug="/forgot-password" query /></div>
        <a className="mo-brand" href={homePath(lang)} aria-label={t.brandAria}>
          <img src="/assets/brand/mouora-logo.webp" alt="MOUORA" />
        </a>
        <div className="mo-mhead">
          <h1>{t.fgMh1} <em>{t.fgMh2}</em></h1>
          <p className="mo-mlead">{t.fgMlead}</p>
        </div>
        <main className="mo-card">
          <section className="mo-story" aria-labelledby="mo-title">
            <h1 id="mo-title">{t.fgH1a} <em>{t.fgH1b}</em></h1>
            <p className="mo-lead">{t.fgLead}</p>
            <ul className="mo-features">
              <li><span><svg width="26" height="26" viewBox="0 0 24 24" {...ic}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7.5 8 6 8-6" /></svg></span>{t.fgF1}</li>
              <li><span><svg width="26" height="26" viewBox="0 0 24 24" {...ic}><rect x="5" y="10.5" width="14" height="9.5" rx="2.5" /><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" /></svg></span>{t.fgF2}</li>
              <li><span><svg width="26" height="26" viewBox="0 0 24 24" {...ic}><path d="M12 3 4.5 5.8v5.7c0 4.4 3 7.9 7.5 9.5 4.5-1.6 7.5-5.1 7.5-9.5V5.8Z" /></svg></span>{t.fgF3}</li>
            </ul>
          </section>
          <section className="mo-form" aria-labelledby="mo-form-title">
            <h2 id="mo-form-title">{t.fgFormTitle}</h2>
            <p className="mo-sub">{t.fgSub}</p>
            <ForgotFlow turnstileKey={process.env.TURNSTILE_SITE_KEY} />
            <p className="mo-switch">{t.remembered} <LoadingLink href={`/login?lang=${lang}`}>{t.enter}</LoadingLink></p>
          </section>
        </main>
      </div>
      <SiteFooter lang={lang} />
    </AuthLang>
  );
}
