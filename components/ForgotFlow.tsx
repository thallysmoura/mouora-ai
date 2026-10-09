"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import LoadingOverlay from "./LoadingOverlay";
import { PasswordInput } from "./LoginFields";

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as const;

type Reply = { error?: string; throttled?: boolean; wait?: number; token?: string };

async function post(url: string, body: object) {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  return { ok: r.ok, d } as { ok: boolean; d: Reply };
}

function useCooldown(seconds = 60) {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  return [left, (s?: number) => setLeft(s ?? seconds)] as const;
}

/** Seis caixas de um dígito, com suporte a colar e apagar. */
function OtpBoxes({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled?: boolean }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? "");
  useEffect(() => { refs.current[0]?.focus(); }, []);
  const setAt = (i: number, d: string) => {
    const arr = digits.slice();
    arr[i] = d;
    onChange(arr.join("").slice(0, 6));
  };
  return (
    <div className="mo-otp-boxes" onPaste={(e) => {
      const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
      if (t) { e.preventDefault(); onChange(t); refs.current[Math.min(t.length, 5)]?.focus(); }
    }}>
      {digits.map((d, i) => (
        <input key={i} ref={(el) => { refs.current[i] = el; }} inputMode="numeric" autoComplete={i === 0 ? "one-time-code" : "off"} maxLength={1} value={d} disabled={disabled} aria-label={`Dígito ${i + 1}`}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(-1);
            setAt(i, v);
            if (v && i < 5) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digits[i] && i > 0) { refs.current[i - 1]?.focus(); setAt(i - 1, ""); }
            if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
            if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
          }} />
      ))}
    </div>
  );
}

export default function ForgotFlow() {
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [modal, setModal] = useState(false);
  const [code, setCode] = useState("");
  const [token, setToken] = useState("");
  const [msg, setMsg] = useState("");
  const [modalMsg, setModalMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [left, startCooldown] = useCooldown(60);

  const sendEmail = async (e?: React.FormEvent, resend = false) => {
    e?.preventDefault();
    setBusy(true);
    setMsg("");
    setModalMsg("");
    const r = await post("/api/auth/forgot", { email });
    setBusy(false);
    if (!r.ok) return resend ? setModalMsg(r.d.error || "Não foi possível enviar o código.") : setMsg(r.d.error || "Não foi possível enviar o código.");
    startCooldown(r.d.throttled ? r.d.wait : 60);
    setCode("");
    setModal(true);
    setModalMsg(r.d.throttled ? `Um código foi enviado há pouco e continua válido por 15 minutos. Para pedir outro, aguarde ${r.d.wait}s.` : "Se este e-mail estiver cadastrado, enviamos o código. Confira também o spam e a aba Promoções.");
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setModalMsg("");
    const r = await post("/api/auth/reset-verify", { email, code });
    setBusy(false);
    if (!r.ok || !r.d.token) { setCode(""); return setModalMsg(r.d.error || "Não foi possível validar o código."); }
    setToken(r.d.token);
    setModal(false);
    setStep("password");
    setMsg("");
  };

  const reset = async (e: React.FormEvent) => {
    e.preventDefault();
    const f = e.currentTarget as HTMLFormElement;
    const pass = (f.querySelector("#reset-password") as HTMLInputElement).value;
    const conf = (f.querySelector("#reset-confirm") as HTMLInputElement).value;
    if (pass !== conf) return setMsg("As senhas não coincidem.");
    setBusy(true);
    setMsg("");
    const r = await post("/api/auth/reset", { email, token, password: pass });
    if (!r.ok) {
      setBusy(false);
      return setMsg(r.d.error || "Não foi possível redefinir a senha.");
    }
    setDone(true);
    setTimeout(() => { location.href = "/dashboard"; }, 450);
  };

  const Modal = modal && typeof document !== "undefined"
    ? createPortal(
        <div className="mo-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="otp-title" onKeyDown={(e) => e.key === "Escape" && setModal(false)}>
          <form className="mo-modal" onSubmit={verify}>
            <button type="button" className="mo-modal-x" aria-label="Fechar" onClick={() => setModal(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" {...stroke} aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
            <span className="mo-modal-ico" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" {...stroke}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7.5 8 6 8-6" /></svg>
            </span>
            <h3 id="otp-title">Digite o código</h3>
            <p>Enviamos um código de 6 dígitos para <strong>{email}</strong>.</p>
            <OtpBoxes value={code} onChange={setCode} disabled={busy} />
            <button className="mo-submit" type="submit" disabled={busy || code.length !== 6}><span>Confirmar código</span></button>
            <button className="mo-linkbtn" type="button" disabled={busy || left > 0} onClick={() => sendEmail(undefined, true)}>
              {left > 0 ? `Reenviar código em ${left}s` : "Reenviar código"}
            </button>
            {modalMsg && <p role="status" className="mo-msg">{modalMsg}</p>}
          </form>
        </div>,
        document.body,
      )
    : null;

  if (step === "email")
    return (
      <>
        <form className="mo-form-el" onSubmit={(e) => sendEmail(e)}>
          <div className="mo-field">
            <label htmlFor="forgot-email">E-mail</label>
            <div className="mo-input">
              <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7.5 8 6 8-6" /></svg>
              <input id="forgot-email" type="email" placeholder="seu@email.com" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <button className="mo-submit" type="submit" disabled={busy}>
            <span>Enviar código</span>
            <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
          </button>
          {msg && <p role="status" className="mo-msg">{msg}</p>}
        </form>
        {Modal}
      </>
    );

  return (
    <form className="mo-form-el" onSubmit={reset}>
      <p className="mo-note">Código confirmado para <strong>{email}</strong>. Agora crie sua nova senha.</p>
      <PasswordInput id="reset-password" label="Nova senha" autoComplete="new-password" placeholder="Mínimo de 8 caracteres" />
      <PasswordInput id="reset-confirm" label="Confirme a nova senha" autoComplete="new-password" placeholder="Repita a senha" />
      <button className="mo-submit" type="submit" disabled={busy}>
        <span>Salvar nova senha</span>
        <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
      </button>
      {msg && <p role="status" className="mo-msg">{msg}</p>}
      {done && <LoadingOverlay />}
    </form>
  );
}
