"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { LIMITS, passwordRules } from "@/lib/validation";
import { useLang, useT } from "./AuthI18n";
import { legalPath } from "@/lib/authi18n";

/** Erros por id de campo, fornecidos pelo AuthForm no cadastro. */
export const FieldErrors = createContext<Record<string, string>>({});
const Err = ({ id }: { id: string }) => {
  const m = useContext(FieldErrors)[id];
  return m ? <p id={`${id}-err`} className="mo-err" role="alert">{m}</p> : null;
};

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const MAIL = (<><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7.5 8 6 8-6" /></>);
const LOCK = (<><rect x="5" y="10.5" width="14" height="9.5" rx="2.5" /><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" /></>);
const USER = (<><circle cx="12" cy="8.5" r="3.7" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></>);

export function TextField({ id, label, icon, type = "text", placeholder, autoComplete, name, minLength, maxLength }: {
  id: string; label: string; icon: "mail" | "user"; type?: string; placeholder?: string; autoComplete: string; name?: string; minLength?: number; maxLength?: number;
}) {
  const bad = !!useContext(FieldErrors)[id];
  return (
    <div className="mo-field">
      <label htmlFor={id}><svg className="mo-label-ico" width="20" height="20" viewBox="0 0 24 24" {...stroke} aria-hidden="true">{icon === "mail" ? MAIL : USER}</svg>{label}</label>
      <div className={`mo-input${bad ? " is-invalid" : ""}`}>
        <input id={id} name={name} type={type} inputMode={type === "email" ? "email" : undefined} autoComplete={autoComplete} minLength={minLength} maxLength={maxLength ?? (type === "email" ? LIMITS.emailMax : undefined)} autoCapitalize={type === "email" ? "none" : "words"} spellCheck={false} required aria-invalid={bad || undefined} aria-describedby={bad ? `${id}-err` : undefined} />
      </div>
      <Err id={id} />
    </div>
  );
}

export function PasswordInput({ id = "login-password", label, autoComplete = "current-password", placeholder = "••••••••••", rules, maxLength }: {
  id?: string; label?: string; autoComplete?: string; placeholder?: string; rules?: boolean; maxLength?: number;
}) {
  const [show, setShow] = useState(false);
  const t = useT();
  const bad = !!useContext(FieldErrors)[id];
  return (
    <div className="mo-field">
      <label htmlFor={id}><svg className="mo-label-ico" width="20" height="20" viewBox="0 0 24 24" {...stroke} aria-hidden="true">{LOCK}</svg>{label ?? t.password}</label>
      <div className={`mo-input${bad ? " is-invalid" : ""}`}>
        <input id={id} type={show ? "text" : "password"} minLength={8} maxLength={maxLength} autoComplete={autoComplete} required aria-invalid={bad || undefined} aria-describedby={bad && !rules ? `${id}-err` : undefined} />
        <button type="button" className="mo-eye" aria-label={show ? t.hidePass : t.showPass} aria-pressed={show} onClick={() => setShow(!show)}>
          <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
            <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" />
            {show && <path d="M4 20 20 4" />}
          </svg>
        </button>
      </div>
      {!rules && <Err id={id} />}
    </div>
  );
}

/** Validador de senha: acompanha o campo da senha (pelo id) e fica abaixo do "confirmar senha". */
export function PasswordRules({ target = "registration-account-password", also = "registration-confirm-password" }: { target?: string; also?: string }) {
  const lang = useLang();
  const t = useT();
  const [val, setVal] = useState("");
  const [focus, setFocus] = useState(false);
  useEffect(() => {
    const el = document.getElementById(target) as HTMLInputElement | null;
    const other = document.getElementById(also);
    if (!el) return;
    const on = () => setVal(el.value);
    const f = () => setFocus(true);
    const b = () => setFocus(false);
    el.addEventListener("input", on);
    for (const x of [el, other]) { x?.addEventListener("focus", f); x?.addEventListener("blur", b); }
    return () => {
      el.removeEventListener("input", on);
      for (const x of [el, other]) { x?.removeEventListener("focus", f); x?.removeEventListener("blur", b); }
    };
  }, [target, also]);

  const list = passwordRules(val, lang);
        return (
          <div className="mo-rules-wrap" data-open={(val.length > 0 || focus) && !list.every((r) => r.ok)}>
            <div className="mo-rules-inner">
              <div className="mo-rules" aria-live="polite">
                <ul aria-label={t.passRules}>
                  {list.map((r) => (
                    <li key={r.label} className={r.ok ? "ok" : "no"}><span aria-hidden="true">{r.ok ? "✓" : "✕"}</span>{r.label}<span className="sr-only">{r.ok ? ` — ${t.met}` : ` — ${t.pending}`}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
}

export function TermsCheck() {
  const t = useT();
  const lang = useLang();
  const id = "registration-accept-terms";
  const bad = !!useContext(FieldErrors)[id];
  return (
    <div className="mo-checkwrap">
      <label className="mo-check">
        <input id={id} type="checkbox" required aria-invalid={bad || undefined} aria-describedby={bad ? `${id}-err` : undefined} />
        <span>{t.termsPre} <a href={legalPath(lang, "terms")} target="_blank" rel="noopener noreferrer">{t.terms}</a> {t.termsAnd} <a href={legalPath(lang, "privacy")} target="_blank" rel="noopener noreferrer">{t.privacy}</a>.</span>
      </label>
      <Err id={id} />
    </div>
  );
}

export function EmailField() {
  const t = useT();
  return <TextField id="login-email" label={t.emailLabel} icon="mail" type="email" autoComplete="username" />;
}
