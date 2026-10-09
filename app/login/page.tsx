import type { Metadata } from "next";
import LoadingLink from "@/components/LoadingLink";
import AuthForm from "@/components/AuthForm";
import { EmailField, PasswordInput } from "@/components/LoginFields";
import "./login.css";

export const metadata: Metadata = { title: "Entrar — Mouora AI" };

const ic = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export default function Login() {
  return (
    <div className="mo-login mo-login--m">
      <a className="mo-brand" href="/pt/" aria-label="MOUORA AI — Voltar ao início">
        <img src="/assets/brand/mouora-logo.webp" alt="MOUORA" />
      </a>
      <div className="mo-mhead">
        <h1>Seu trabalho, <em>seus resultados.</em></h1>
        <p className="mo-mlead">Organize seus projetos e acompanhe seus ganhos em um só lugar.</p>
      </div>
      <main className="mo-card">
        <section className="mo-story" aria-labelledby="mo-title">
          <h1 id="mo-title">Centralize seus projetos e transforme <em>horas em resultados.</em></h1>
          <p className="mo-lead">Organize entregas, registre atividades e acompanhe seus ganhos em um só lugar.</p>
          <ul className="mo-features">
            <li><span><svg width="26" height="26" viewBox="0 0 24 24" {...ic}><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2.5h7.5A2.5 2.5 0 0 1 21 10v7.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5Z" /></svg></span>Projetos organizados</li>
            <li><span><svg width="26" height="26" viewBox="0 0 24 24" {...ic}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg></span>Horas registradas</li>
            <li><span><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="12" width="4" height="8" rx="1" /><rect x="10" y="8" width="4" height="12" rx="1" /><rect x="16" y="4" width="4" height="16" rx="1" /></svg></span>Ganhos visíveis</li>
          </ul>
        </section>
        <section className="mo-form" aria-labelledby="mo-form-title">
          <h2 id="mo-form-title">Entrar</h2>
          <p className="mo-sub">Acesse sua conta para continuar.</p>
          <AuthForm mode="login" alwaysEnabled className="mo-form-el" submitClass="mo-submit"
            submitLabel={<><span>Entrar</span><svg width="22" height="22" viewBox="0 0 24 24" {...ic}><path d="M5 12h14m-6-6 6 6-6 6" /></svg></>}
            extra={<LoadingLink className="mo-forgot" href="/forgot-password">Esqueceu a senha?</LoadingLink>}>
            <EmailField />
            <PasswordInput />
            <label className="mo-remember">
              <input id="login-remember" type="checkbox" defaultChecked />
              <span>Lembrar de mim neste dispositivo</span>
            </label>
          </AuthForm>
          <p className="mo-switch">Ainda não tem conta? <LoadingLink href="/register?lang=pt">Criar conta</LoadingLink></p>
        </section>
      </main>
    </div>
  );
}
