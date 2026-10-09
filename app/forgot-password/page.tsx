import type { Metadata } from "next";
import LoadingLink from "@/components/LoadingLink";
import ForgotFlow from "@/components/ForgotFlow";
import "../login/login.css";

export const metadata: Metadata = { title: "Redefinir senha — Mouora AI" };

const ic = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export default function ForgotPassword() {
  return (
    <div className="mo-login mo-login--m">
      <a className="mo-brand" href="/pt/" aria-label="MOUORA AI — Voltar ao início">
        <img src="/assets/brand/mouora-logo.webp" alt="MOUORA" />
      </a>
      <div className="mo-mhead">
        <h1>Recupere seu <em>acesso.</em></h1>
        <p className="mo-mlead">Enviaremos um código de 6 dígitos para o seu e-mail.</p>
      </div>
      <main className="mo-card">
        <section className="mo-story" aria-labelledby="mo-title">
          <h1 id="mo-title">Recupere seu acesso com <em>segurança.</em></h1>
          <p className="mo-lead">Enviaremos um código de 6 dígitos para o seu e-mail. Ele vale por 15 minutos.</p>
          <ul className="mo-features">
            <li><span><svg width="26" height="26" viewBox="0 0 24 24" {...ic}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7.5 8 6 8-6" /></svg></span>Código enviado ao seu e-mail</li>
            <li><span><svg width="26" height="26" viewBox="0 0 24 24" {...ic}><rect x="5" y="10.5" width="14" height="9.5" rx="2.5" /><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" /></svg></span>Crie uma nova senha</li>
            <li><span><svg width="26" height="26" viewBox="0 0 24 24" {...ic}><path d="M12 3 4.5 5.8v5.7c0 4.4 3 7.9 7.5 9.5 4.5-1.6 7.5-5.1 7.5-9.5V5.8Z" /></svg></span>Acesso protegido</li>
          </ul>
        </section>
        <section className="mo-form" aria-labelledby="mo-form-title">
          <h2 id="mo-form-title">Esqueceu a senha?</h2>
          <p className="mo-sub">Informe o e-mail da sua conta para receber o código.</p>
          <ForgotFlow />
          <p className="mo-switch">Lembrou a senha? <LoadingLink href="/login?lang=pt">Entrar</LoadingLink></p>
        </section>
      </main>
    </div>
  );
}
