"use client";
import { useState } from "react";

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const MAIL = (<><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7.5 8 6 8-6" /></>);
const LOCK = (<><rect x="5" y="10.5" width="14" height="9.5" rx="2.5" /><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" /></>);
const USER = (<><circle cx="12" cy="8.5" r="3.7" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></>);

export function TextField({ id, label, icon, type = "text", placeholder, autoComplete, name, minLength, maxLength }: {
  id: string; label: string; icon: "mail" | "user"; type?: string; placeholder: string; autoComplete: string; name?: string; minLength?: number; maxLength?: number;
}) {
  return (
    <div className="mo-field">
      <label htmlFor={id}>{label}</label>
      <div className="mo-input">
        <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden="true">{icon === "mail" ? MAIL : USER}</svg>
        <input id={id} name={name} type={type} placeholder={placeholder} autoComplete={autoComplete} minLength={minLength} maxLength={maxLength} autoCapitalize="none" spellCheck={false} required />
      </div>
    </div>
  );
}

export function PasswordInput({ id = "login-password", label = "Senha", autoComplete = "current-password", placeholder = "••••••••••" }: {
  id?: string; label?: string; autoComplete?: string; placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="mo-field">
      <label htmlFor={id}>{label}</label>
      <div className="mo-input">
        <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden="true">{LOCK}</svg>
        <input id={id} type={show ? "text" : "password"} placeholder={placeholder} minLength={8} autoComplete={autoComplete} required />
        <button type="button" className="mo-eye" aria-label={show ? "Ocultar senha" : "Mostrar senha"} aria-pressed={show} onClick={() => setShow(!show)}>
          <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
            <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" />
            {show && <path d="M4 20 20 4" />}
          </svg>
        </button>
      </div>
    </div>
  );
}

export function EmailField() {
  return <TextField id="login-email" label="E-mail" icon="mail" type="email" placeholder="seu@email.com" autoComplete="username" />;
}
