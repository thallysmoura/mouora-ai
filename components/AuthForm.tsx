"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import LoadingOverlay from "./LoadingOverlay";

export function PasswordField({ id, label, autoComplete }: { id: string; label: string; autoComplete: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="auth-password-control">
      <input id={id} type={show ? "text" : "password"} minLength={8} required autoComplete={autoComplete} />
      <button type="button" aria-label={`Mostrar senha ${label}`} aria-pressed={show} onClick={() => setShow(!show)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true">
          <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z" />
        </svg>
      </button>
    </span>
  );
}

export default function AuthForm({ className, children, submitLabel, submitClass, extra, mode, alwaysEnabled }: { alwaysEnabled?: boolean; className?: string; children: ReactNode; submitLabel: ReactNode; submitClass: string; extra?: ReactNode; mode: "login" | "register" }) {
  const ref = useRef<HTMLFormElement>(null);
  const [valid, setValid] = useState(false);
  const [msg, setMsg] = useState("");
  const check = () => {
    const f = ref.current!;
    let ok = f.checkValidity();
    if (mode === "register") {
      const p = (f.querySelector("#registration-account-password") as HTMLInputElement).value;
      const c = (f.querySelector("#registration-confirm-password") as HTMLInputElement).value;
      ok = ok && p === c;
    }
    setValid(ok);
  };
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const f = ref.current!;
    const v = (id: string) => (f.querySelector(id) as HTMLInputElement).value;
    const body = mode === "login"
      ? { email: v("#login-email"), password: v("#login-password"), remember: (f.querySelector("#login-remember") as HTMLInputElement | null)?.checked === true }
      : { name: v("#registration-full-name"), email: v("#registration-email"), password: v("#registration-account-password") };
    if (mode === "register" && v("#registration-account-password") !== v("#registration-confirm-password")) { setMsg("As senhas não coincidem."); return; }
    setBusy(true); setMsg("");
    try {
      const r = await fetch("/api/auth/" + mode, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.verify) { setPending(d.email); setBusy(false); return; }
      if (r.ok) { setRedirecting(true); setTimeout(() => { location.href = "/dashboard"; }, 450); return; }
      setMsg(d.error || "Não foi possível concluir. Tente novamente.");
    } catch { setMsg("Falha de conexão. Tente novamente."); }
    setBusy(false);
  };
  if (pending) return <VerifyCode email={pending} />;
  return (
    <form ref={ref} className={className} autoComplete="on" onChange={check} onInput={check}
      onSubmit={submit}>
      {children}
      <button className={submitClass} disabled={(!alwaysEnabled && !valid) || busy} type="submit">{submitLabel}</button>
      {msg && <p role="status" style={{ marginTop: 12, fontSize: 14 }}>{msg}</p>}
      {extra}
      {redirecting && <LoadingOverlay />}
    </form>
  );
}

function VerifyCode({ email }: { email: string }) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("Enviamos um código de 6 dígitos para o seu e-mail. Confira também o spam.");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [left, setLeft] = useState(60);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  const call = async (body: object) => {
    setBusy(true);
    try {
      const r = await fetch("/api/auth/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, ...body }) });
      const d = await r.json().catch(() => ({}));
      if (r.ok) return true;
      setMsg(d.error || "Não foi possível concluir.");
    } catch {
      setMsg("Falha de conexão.");
    } finally {
      setBusy(false);
    }
    return false;
  };
  return (
    <form className="mo-form-el" onSubmit={async (e) => { e.preventDefault(); if (await call({ code })) { setDone(true); setTimeout(() => { location.href = "/dashboard"; }, 450); } }}>
      <p className="mo-note">Código enviado para <strong>{email}</strong>.</p>
      <div className="mo-field">
        <label htmlFor="verify-code">Código de verificação</label>
        <div className="mo-input mo-otp">
          <input id="verify-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} />
        </div>
      </div>
      <button className="mo-submit" disabled={code.length !== 6 || busy} type="submit"><span>Confirmar e entrar</span></button>
      <button className="mo-linkbtn" type="button" disabled={busy || left > 0} onClick={async () => { if (await call({ resend: true })) { setMsg("Novo código enviado."); setLeft(60); } }}>
        {left > 0 ? `Reenviar código em ${left}s` : "Reenviar código"}
      </button>
      {msg && <p role="status" className="mo-msg" style={{ color: "#4d5360" }}>{msg}</p>}
      {done && <LoadingOverlay />}
    </form>
  );
}
