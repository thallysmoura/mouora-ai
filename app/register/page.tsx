import type { Metadata } from "next";
import LoadingLink from "@/components/LoadingLink";
import AuthForm from "@/components/AuthForm";
import { PasswordInput, TextField } from "@/components/LoginFields";
import "../login/login.css";

export const metadata: Metadata = { title: "Criar conta — Mouora AI" };

const ic = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export default function Register() {
  return (
    <div className="mo-login mo-login--m">
      <a className="mo-brand" href="/pt/" aria-label="MOUORA AI — Voltar ao início">
        <img src="/assets/brand/mouora-logo.webp" alt="MOUORA" />
      </a>
      <div className="mo-mhead">
        <h1>Crie sua conta, <em>comece a ganhar.</em></h1>
        <p className="mo-mlead">Cadastre-se grátis, grave tarefas com o celular e receba pelas horas aprovadas.</p>
      </div>
      <main className="mo-card">
        <section className="mo-story" aria-labelledby="mo-title">
          <h1 id="mo-title">Comece em poucos minutos e <em>seja recompensado.</em></h1>
          <p className="mo-lead">Crie sua conta, grave tarefas do seu dia a dia com o celular e receba pelas horas aprovadas.</p>
          <ul className="mo-features">
            <li><span><svg width="26" height="26" viewBox="0 0 24 24" {...ic}><circle cx="12" cy="12" r="8.5" /><path d="m8.5 12.3 2.4 2.4 4.6-5" /></svg></span>Cadastro gratuito</li>
            <li><span><svg width="26" height="26" viewBox="0 0 24 24" {...ic}><rect x="7" y="3" width="10" height="18" rx="2.5" /><path d="M11 18h2" /></svg></span>Com o seu celular</li>
            <li><span><svg width="26" height="26" viewBox="0 0 24 24" {...ic}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg></span>No seu ritmo</li>
          </ul>
          <LoadingLink className="mo-create" href="/login?lang=pt">Já tenho conta <svg width="20" height="20" viewBox="0 0 24 24" {...ic}><path d="M5 12h14m-6-6 6 6-6 6" /></svg></LoadingLink>
        </section>
        <section className="mo-form" aria-labelledby="mo-form-title">
          <h2 id="mo-form-title">Criar conta</h2>
          <p className="mo-sub">Preencha seus dados para começar.</p>
          <AuthForm mode="register" alwaysEnabled className="mo-form-el" submitClass="mo-submit"
            submitLabel={<><span>Criar conta</span><svg width="22" height="22" viewBox="0 0 24 24" {...ic}><path d="M5 12h14m-6-6 6 6-6 6" /></svg></>}>
            <TextField id="registration-full-name" name="name" label="Nome completo" icon="user" placeholder="Ex.: Ana Silva" autoComplete="name" minLength={2} maxLength={120} />
            <TextField id="registration-email" name="email" label="E-mail" icon="mail" type="email" placeholder="seu@email.com" autoComplete="email" />
            <PasswordInput id="registration-account-password" label="Crie uma senha" autoComplete="new-password" placeholder="Mínimo de 8 caracteres" />
            <PasswordInput id="registration-confirm-password" label="Confirme a senha" autoComplete="new-password" placeholder="Repita a senha" />
            <label className="mo-check">
              <input id="registration-accept-terms" type="checkbox" required />
              <span>Li e aceito os <a href="/pt/terms" target="_blank">termos de uso</a> e a <a href="/pt/privacy" target="_blank">política de privacidade</a>.</span>
            </label>
          </AuthForm>
          <p className="mo-switch">Já tem uma conta? <LoadingLink href="/login?lang=pt">Entrar</LoadingLink></p>
        </section>
      </main>
    </div>
  );
}
