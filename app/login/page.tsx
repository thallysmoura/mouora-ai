import type { Metadata } from "next";
import LoadingLink from "@/components/LoadingLink";
import AuthForm from "@/components/AuthForm";
import { AuthLang } from "@/components/AuthI18n";
import LangSwitch from "@/components/LangSwitch";
import { EmailField, PasswordInput } from "@/components/LoginFields";
import SiteFooter from "@/components/SiteFooter";
import { homePath, pickLang, tr } from "@/lib/authi18n";
import "./login.css";

type Props = { searchParams: Promise<{ lang?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return { title: tr(pickLang((await searchParams).lang)).loginTitle, robots: { index: false } };
}

const ic = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export default async function Login({ searchParams }: Props) {
  const lang = pickLang((await searchParams).lang);
  const t = tr(lang);
  return (
    <AuthLang lang={lang}>
      <div className="mo-login mo-login--m" lang={lang}>
        <div className="mo-langpos"><LangSwitch lang={lang} slug="/login" query /></div>
        <a className="mo-brand" href={homePath(lang)} aria-label={t.brandAria}>
          <img src="/assets/brand/mouora-logo.webp" alt="MOUORA" />
        </a>
        <div className="mo-mhead">
          <h1>{t.loginMh1} <em>{t.loginMh2}</em></h1>
          <p className="mo-mlead">{t.loginMlead}</p>
        </div>
        <main className="mo-card">
          <section className="mo-story" aria-labelledby="mo-title">
            <h1 id="mo-title">{t.loginH1a} <em>{t.loginH1b}</em></h1>
            <p className="mo-lead">{t.loginLead}</p>
            <ul className="mo-features">
              <li><span><svg width="26" height="26" viewBox="0 0 24 24" {...ic}><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2.5h7.5A2.5 2.5 0 0 1 21 10v7.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5Z" /></svg></span>{t.loginF1}</li>
              <li><span><svg width="26" height="26" viewBox="0 0 24 24" {...ic}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg></span>{t.loginF2}</li>
              <li><span><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="12" width="4" height="8" rx="1" /><rect x="10" y="8" width="4" height="12" rx="1" /><rect x="16" y="4" width="4" height="16" rx="1" /></svg></span>{t.loginF3}</li>
            </ul>
          </section>
          <section className="mo-form" aria-labelledby="mo-form-title">
            <h2 id="mo-form-title">{t.enter}</h2>
            <p className="mo-sub">{t.loginSub}</p>
            <AuthForm mode="login" turnstileKey={process.env.TURNSTILE_SITE_KEY} alwaysEnabled className="mo-form-el" submitClass="mo-submit"
              submitLabel={<><span>{t.enter}</span><svg width="22" height="22" viewBox="0 0 24 24" {...ic}><path d="M5 12h14m-6-6 6 6-6 6" /></svg></>}
              extra={<LoadingLink className="mo-forgot" href={`/forgot-password?lang=${lang}`}>{t.forgot}</LoadingLink>}>
              <EmailField />
              <PasswordInput />
              <label className="mo-remember">
                <input id="login-remember" type="checkbox" defaultChecked />
                <span>{t.remember}</span>
              </label>
            </AuthForm>
            <p className="mo-switch">{t.noAccount} <LoadingLink href={`/register?lang=${lang}`}>{t.createAccount}</LoadingLink></p>
          </section>
        </main>
      </div>
      <SiteFooter lang={lang} />
    </AuthLang>
  );
}
