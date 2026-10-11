import type { Metadata } from "next";
import LoadingLink from "@/components/LoadingLink";
import AuthForm from "@/components/AuthForm";
import { AuthLang } from "@/components/AuthI18n";
import LangSwitch from "@/components/LangSwitch";
import { PasswordInput, PasswordRules, TermsCheck, TextField } from "@/components/LoginFields";
import SiteFooter from "@/components/SiteFooter";
import { homePath, pickLang, tr } from "@/lib/authi18n";
import "../login/login.css";

type Props = { searchParams: Promise<{ lang?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return { title: tr(pickLang((await searchParams).lang)).regTitle, robots: { index: false } };
}

const ic = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export default async function Register({ searchParams }: Props) {
  const lang = pickLang((await searchParams).lang);
  const t = tr(lang);
  return (
    <AuthLang lang={lang}>
      <div className="mo-login mo-login--m" lang={lang}>
        <div className="mo-langpos"><LangSwitch lang={lang} slug="/register" query /></div>
        <a className="mo-brand" href={homePath(lang)} aria-label={t.brandAria}>
          <img src="/assets/brand/mouora-logo.webp" alt="MOUORA" />
        </a>
        <div className="mo-mhead">
          <h1>{t.regMh1} <em>{t.regMh2}</em></h1>
          <p className="mo-mlead">{t.regMlead}</p>
        </div>
        <main className="mo-card">
          <section className="mo-story" aria-labelledby="mo-title">
            <h1 id="mo-title">{t.regH1a} <em>{t.regH1b}</em></h1>
            <p className="mo-lead">{t.regLead}</p>
            <ul className="mo-features">
              <li><span><svg width="26" height="26" viewBox="0 0 24 24" {...ic}><circle cx="12" cy="12" r="8.5" /><path d="m8.5 12.3 2.4 2.4 4.6-5" /></svg></span>{t.regF1}</li>
              <li><span><svg width="26" height="26" viewBox="0 0 24 24" {...ic}><rect x="7" y="3" width="10" height="18" rx="2.5" /><path d="M11 18h2" /></svg></span>{t.regF2}</li>
              <li><span><svg width="26" height="26" viewBox="0 0 24 24" {...ic}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg></span>{t.regF3}</li>
            </ul>
            <LoadingLink className="mo-create" href={`/login?lang=${lang}`}>{t.haveAccount} <svg width="20" height="20" viewBox="0 0 24 24" {...ic}><path d="M5 12h14m-6-6 6 6-6 6" /></svg></LoadingLink>
          </section>
          <section className="mo-form" aria-labelledby="mo-form-title">
            <h2 id="mo-form-title">{t.createAccount}</h2>
            <p className="mo-sub">{t.regSub}</p>
            <AuthForm mode="register" turnstileKey={process.env.TURNSTILE_SITE_KEY} alwaysEnabled className="mo-form-el" submitClass="mo-submit"
              submitLabel={<><span>{t.createAccount}</span><svg width="22" height="22" viewBox="0 0 24 24" {...ic}><path d="M5 12h14m-6-6 6 6-6 6" /></svg></>}>
              <TextField id="registration-full-name" name="name" label={t.nameLabel} icon="user" placeholder={t.namePh} autoComplete="name" minLength={2} maxLength={120} />
              <TextField id="registration-email" name="email" label={t.emailLabel} icon="mail" type="email" placeholder={t.emailPh} autoComplete="email" />
              <PasswordInput id="registration-account-password" label={t.passLabel} autoComplete="new-password" placeholder={t.passPh} rules maxLength={72} />
              <PasswordInput id="registration-confirm-password" label={t.confirmLabel} autoComplete="new-password" placeholder={t.confirmPh} maxLength={72} />
              <PasswordRules />
              <TermsCheck />
            </AuthForm>
            <p className="mo-switch">{t.hasAccount} <LoadingLink href={`/login?lang=${lang}`}>{t.enter}</LoadingLink></p>
          </section>
        </main>
      </div>
      <SiteFooter lang={lang} />
    </AuthLang>
  );
}
