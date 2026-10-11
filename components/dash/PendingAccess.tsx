"use client";
import { useState } from "react";
import "./pending.css";

/** Tela exibida no painel enquanto um administrador não libera o acesso da conta. */
export default function PendingAccess({ name, email }: { name: string; email: string }) {
  const [busy, setBusy] = useState(false);
  const first = name.trim().split(/\s+/)[0] || "";
  const logout = async () => {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    location.href = "/login";
  };
  return (
    <div className="pa">
      <main className="pa-card" role="main">
        <img className="pa-logo" src="/assets/brand/mouora-logo.webp" alt="MOUORA" width={170} height={57} />
        <span className="pa-ico" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.7" /><path d="M12 7.2V12l3.2 2" /></svg>
        </span>
        <h1>Aguardando liberação de acesso</h1>
        <p className="pa-lead">Olá, <strong>{first}</strong>! Sua conta foi criada com sucesso e está em análise.</p>
        <p className="pa-text">Um administrador precisa liberar o seu acesso ao painel. Assim que isso acontecer, você poderá entrar normalmente com <strong>{email}</strong>.</p>
        <div className="pa-actions">
          <button type="button" className="pa-btn" onClick={() => location.reload()}>Verificar novamente</button>
          <button type="button" className="pa-btn ghost" onClick={logout} disabled={busy}>{busy ? "Saindo…" : "Sair"}</button>
        </div>
      </main>
    </div>
  );
}
