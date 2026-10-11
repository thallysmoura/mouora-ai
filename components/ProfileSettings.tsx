"use client";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { normalizePhone, passwordRules, validateEmail, validateName, validatePassword } from "@/lib/validation";
import "./settings.css";

type U = { name: string; email: string; phone: string; locale: string; avatarUrl: string; emailChangedAt: string };
type Errs = Record<string, string>;
type Notice = { ok: boolean; text: string } | null;

async function send(url: string, method: string, body: object) {
  try {
    const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await r.json().catch(() => ({}));
    return { ok: r.ok, status: r.status, d } as { ok: boolean; status: number; d: { error?: string; fields?: Errs; email?: string } };
  } catch {
    return { ok: false, status: 0, d: { error: "Falha de conexão. Tente novamente." } };
  }
}

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div className="ps-field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? <p className="ps-err" id={`${id}-err`} role="alert">{error}</p> : hint ? <p className="ps-hint">{hint}</p> : null}
    </div>
  );
}

const Toast = ({ n }: { n: Notice }) => (n ? <p className={`ps-note ${n.ok ? "ok" : "bad"}`} role="status">{n.text}</p> : null);

function PassInput({ id, value, onChange, autoComplete, invalid, placeholder, onFocus, onBlur }: { id: string; value: string; onChange: (v: string) => void; autoComplete: string; invalid?: boolean; placeholder?: string; onFocus?: () => void; onBlur?: () => void }) {
  const [show, setShow] = useState(false);
  return (
    <div className={`ps-input${invalid ? " bad" : ""}`}>
      <input id={id} type={show ? "text" : "password"} value={value} maxLength={72} autoComplete={autoComplete} placeholder={placeholder} aria-invalid={invalid || undefined} aria-describedby={invalid ? `${id}-err` : undefined} onFocus={onFocus} onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)} />
      <button type="button" className="ps-eye" aria-label={show ? "Ocultar senha" : "Mostrar senha"} aria-pressed={show} onClick={() => setShow(!show)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" />{show && <path d="M4 20 20 4" />}</svg>
      </button>
    </div>
  );
}

function Rules({ value, focus }: { value: string; focus: boolean }) {
  const list = passwordRules(value);
  const open = (value.length > 0 || focus) && !list.every((r) => r.ok);
  return (
    <div className="ps-rules-wrap" data-open={open}>
      <div className="ps-rules-inner">
        <ul className="ps-rules" aria-label="Requisitos da senha" aria-live="polite">
          {list.map((r) => (<li key={r.label} className={r.ok ? "ok" : "no"}><span aria-hidden="true">{r.ok ? "✓" : "✕"}</span>{r.label}</li>))}
        </ul>
      </div>
    </div>
  );
}

/** Máscara de telefone: (00) 00000-0000 (celular) ou (00) 0000-0000 (fixo); com "+" aceita número internacional. */
function formatPhone(v: string) {
  const t = v.trim();
  if (t.startsWith("+")) return "+" + t.replace(/\D/g, "").slice(0, 15);
  const d = t.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const MAX_ORIGINAL = 5 * 1024 * 1024; // antes de comprimir
const MAX_SENT = 512 * 1024;          // depois de comprimir (um avatar 256×256 WebP pesa ~10–30 KB; o servidor também confere)

/** Valida e reduz a foto no navegador: recorte quadrado 256×256 em WebP → upload pequeno, rápido e barato no Cloudinary. */
async function prepareImage(file: File): Promise<Blob> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Use uma imagem JPG, PNG ou WebP.");
  if (file.size === 0) throw new Error("O arquivo está vazio.");
  if (file.size > MAX_ORIGINAL) throw new Error(`A imagem é grande demais (${(file.size / 1048576).toFixed(1)} MB). O limite é 5 MB.`);
  let bmp: ImageBitmap;
  try { bmp = await createImageBitmap(file); } catch { throw new Error("Não foi possível ler a imagem. O arquivo pode estar corrompido."); }
  try {
    if (bmp.width < 128 || bmp.height < 128) throw new Error("A imagem é muito pequena. Use pelo menos 128×128 pixels.");
    const side = Math.min(bmp.width, bmp.height);
    const size = Math.min(256, side);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Seu navegador não conseguiu processar a imagem.");
    ctx.drawImage(bmp, (bmp.width - side) / 2, (bmp.height - side) / 2, side, side, 0, 0, size, size);
    const out = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/webp", 0.8));
    const blob = out && out.type === "image/webp" ? out : await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", 0.82));
    if (!blob) throw new Error("Não foi possível preparar a imagem.");
    if (blob.size > MAX_SENT) throw new Error("A imagem continua grande demais. Escolha outra.");
    return blob;
  } finally { bmp.close(); }
}

export default function ProfileSettings({ user, photoEnabled }: { user: U; photoEnabled: boolean }) {
  const router = useRouter();
  const initials = user.name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";

  // ── Foto ──
  const [avatar, setAvatar] = useState(user.avatarUrl);
  const [aNote, setANote] = useState<Notice>(null);
  const [aBusy, setABusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const flash = (n: Notice) => { setANote(n); if (n?.ok) setTimeout(() => setANote((c) => (c === n ? null : c)), 4000); };
  const uploadPhoto = async (file: File | undefined) => {
    if (!file) return;
    setANote(null);
    let blob: Blob;
    try { blob = await prepareImage(file); } catch (e) { flash({ ok: false, text: (e as Error).message }); if (fileRef.current) fileRef.current.value = ""; return; }
    setABusy(true);
    const fd = new FormData();
    fd.set("file", blob, "avatar.webp");
    try {
      const r = await fetch("/api/account/avatar", { method: "POST", body: fd });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) flash({ ok: false, text: d.error || "Não foi possível enviar a foto." });
      else { setAvatar(d.url); flash({ ok: true, text: "Foto atualizada com sucesso." }); router.refresh(); }
    } catch { flash({ ok: false, text: "Falha de conexão. Tente novamente." }); }
    setABusy(false);
    if (fileRef.current) fileRef.current.value = "";
  };
  const removePhoto = async () => {
    setABusy(true); setANote(null);
    const r = await send("/api/account/avatar", "DELETE", {});
    setABusy(false);
    if (r.ok) { setAvatar(""); flash({ ok: true, text: "Foto removida." }); router.refresh(); } else flash({ ok: false, text: r.d.error || "Não foi possível remover a foto." });
  };

  // ── Dados pessoais ──
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(formatPhone(user.phone));
  const [locale, setLocale] = useState(user.locale);
  const [pErr, setPErr] = useState<Errs>({});
  const [pNote, setPNote] = useState<Notice>(null);
  const [pBusy, setPBusy] = useState(false);
  const [saved, setSaved] = useState({ name: user.name, phone: formatPhone(user.phone), locale: user.locale });
  const dirty = name.trim() !== saved.name || phone.trim() !== saved.phone || locale !== saved.locale;

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Errs = {};
    const ne = validateName(name); if (ne) errs.name = ne;
    if (normalizePhone(phone) === null) errs.phone = "Telefone inválido. Use DDD + número, ex.: (92) 91234-5678.";
    setPErr(errs); setPNote(null);
    if (Object.keys(errs).length) return;
    setPBusy(true);
    const r = await send("/api/account/profile", "PATCH", { name, phone, locale });
    setPBusy(false);
    if (!r.ok) { setPErr(r.d.fields ?? {}); setPNote({ ok: false, text: r.d.error || "Não foi possível salvar." }); return; }
    setSaved({ name: name.trim().replace(/\s+/g, " "), phone: phone.trim(), locale });
    setPNote({ ok: true, text: "Alterações salvas." });
    router.refresh();
  };

  // ── E-mail ──
  const [step, setStep] = useState<"idle" | "form" | "code">("idle");
  const [newEmail, setNewEmail] = useState("");
  const [curPass, setCurPass] = useState("");
  const [code, setCode] = useState("");
  const [eErr, setEErr] = useState<Errs>({});
  const [eNote, setENote] = useState<Notice>(null);
  const [eBusy, setEBusy] = useState(false);
  const [email, setEmail] = useState(user.email);
  // trava de segurança: 1 troca de e-mail por semana
  const [changedAt, setChangedAt] = useState(user.emailChangedAt);
  const unlockAt = changedAt ? new Date(new Date(changedAt).getTime() + 7 * 86400000) : null;
  const locked = !!unlockAt && unlockAt.getTime() > Date.now();

  const requestEmail = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Errs = {};
    const ee = validateEmail(newEmail); if (ee) errs.email = ee;
    if (!curPass) errs.password = "Informe sua senha atual.";
    setEErr(errs); setENote(null);
    if (Object.keys(errs).length) return;
    setEBusy(true);
    const r = await send("/api/account/email", "POST", { action: "request", email: newEmail, password: curPass });
    setEBusy(false);
    if (!r.ok) { setEErr(r.d.fields ?? {}); setENote({ ok: false, text: r.d.error || "Não foi possível enviar o código." }); if ((r.d as { locked?: boolean }).locked) setChangedAt(new Date().toISOString()); return; }
    setStep("code"); setCode(""); setENote({ ok: true, text: `Enviamos um código de 6 dígitos para ${r.d.email}. Confira também o spam.` });
  };
  const confirmEmail = async (e: FormEvent) => {
    e.preventDefault();
    setEErr({}); setENote(null);
    if (!/^\d{6}$/.test(code)) { setEErr({ code: "Informe o código de 6 dígitos." }); return; }
    setEBusy(true);
    const r = await send("/api/account/email", "POST", { action: "confirm", code });
    setEBusy(false);
    if (!r.ok) { setEErr(r.d.fields ?? {}); setENote({ ok: false, text: r.d.error || "Não foi possível confirmar." }); return; }
    setEmail(r.d.email ?? newEmail); setChangedAt(new Date().toISOString()); setStep("idle"); setNewEmail(""); setCurPass(""); setCode("");
    setENote({ ok: true, text: "E-mail atualizado com sucesso." });
    router.refresh();
  };

  // ── Senha ──
  const [cur, setCur] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [sErr, setSErr] = useState<Errs>({});
  const [sNote, setSNote] = useState<Notice>(null);
  const [sBusy, setSBusy] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [pwFocus, setPwFocus] = useState(false);
  const rulesOk = passwordRules(pw).every((r) => r.ok);
  const closePw = () => { setPwOpen(false); setCur(""); setPw(""); setPw2(""); setSErr({}); setPwFocus(false); };

  const changePassword = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Errs = {};
    if (!cur) errs.current = "Informe a senha atual.";
    const pe = validatePassword(pw, email); if (pe) errs.password = pe; else if (pw === cur) errs.password = "A nova senha deve ser diferente da atual.";
    if (!pw2) errs.confirm = "Confirme a nova senha."; else if (pw2 !== pw) errs.confirm = "As senhas não coincidem.";
    setSErr(errs); setSNote(null);
    if (Object.keys(errs).length) return;
    setSBusy(true);
    const r = await send("/api/account/password", "POST", { current: cur, password: pw, confirm: pw2 });
    setSBusy(false);
    if (!r.ok) { setSErr(r.d.fields ?? {}); setSNote({ ok: false, text: r.d.error || "Não foi possível alterar a senha." }); return; }
    closePw();
    setSNote({ ok: true, text: "Senha alterada com sucesso." });
  };

  return (
    <div className="ps">
      <section className="ps-card ps-head">
        <input ref={fileRef} id="ps-photo" type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => uploadPhoto(e.target.files?.[0])} />
        <button type="button" className="ps-avatar-btn" disabled={!photoEnabled || aBusy} onClick={() => fileRef.current?.click()} aria-label="Alterar foto de perfil" title={photoEnabled ? "Alterar foto de perfil" : "Envio de foto indisponível"}>
          {avatar ? <img className="ps-avatar" src={avatar} alt="" width={72} height={72} decoding="async" /> : <span className="ps-avatar" aria-hidden="true">{initials}</span>}
          {photoEnabled && !aBusy && (
            <span className="ps-cam" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="1.8" /><path d="m21 16-5-5-9 9" /></svg>
            </span>
          )}
          {aBusy && <span className="ps-spin" role="status" aria-label="Enviando foto" />}
        </button>
        <div className="ps-who">
          <h2>{saved.name}</h2>
          <p>{email}</p>
          {photoEnabled && avatar && (
            <div className="ps-photo-actions">
              <button type="button" className="ps-link danger" disabled={aBusy} onClick={removePhoto}>Remover foto</button>
            </div>
          )}
          <div aria-live="polite">{aBusy ? <p className="ps-note">Enviando foto…</p> : <Toast n={aNote} />}</div>
        </div>
      </section>

      <form className="ps-card" onSubmit={saveProfile} noValidate>
        <h3>Dados pessoais</h3>
        <p className="ps-sub">Essas informações identificam você na plataforma.</p>
        <Field id="ps-name" label="Nome completo" error={pErr.name}>
          <div className={`ps-input${pErr.name ? " bad" : ""}`}><input id="ps-name" value={name} maxLength={120} autoComplete="name" onChange={(e) => setName(e.target.value)} aria-invalid={!!pErr.name || undefined} aria-describedby={pErr.name ? "ps-name-err" : undefined} /></div>
        </Field>
        <div className="ps-row">
          <Field id="ps-phone" label="Telefone (opcional)" error={pErr.phone} hint="Com DDD. Para número internacional, comece com +.">
            <div className={`ps-input${pErr.phone ? " bad" : ""}`}><input id="ps-phone" type="tel" inputMode="tel" value={phone} maxLength={18} autoComplete="tel" placeholder="(00) 00000-0000" onChange={(e) => setPhone(formatPhone(e.target.value))} aria-invalid={!!pErr.phone || undefined} aria-describedby={pErr.phone ? "ps-phone-err" : undefined} /></div>
          </Field>
          <Field id="ps-locale" label="Idioma preferido" error={pErr.locale}>
            <div className="ps-input"><select id="ps-locale" value={locale} onChange={(e) => setLocale(e.target.value)}><option value="pt">Português</option><option value="en">English</option><option value="es">Español</option></select></div>
          </Field>
        </div>
        <div className="ps-actions">
          {(dirty || pBusy) && (
            <button className="ps-btn ps-btn-ico ps-save" type="submit" disabled={pBusy}>
              {pBusy
                ? <span className="ps-btn-spin" aria-hidden="true" />
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" /><path d="M17 21v-8H7v8M7 3v5h8" /></svg>}
              {pBusy ? "Salvando…" : "Salvar alterações"}
            </button>
          )}
          <Toast n={pNote} />
        </div>
      </form>

      <section className="ps-card">
        <h3>E-mail</h3>
        <p className="ps-sub">Seu e-mail atual é <strong>{email}</strong>. Para trocar, confirmamos sua senha e enviamos um código ao novo endereço.</p>
        {step === "idle" && !locked && (
          <div className="ps-actions">
            <button className="ps-btn ghost" type="button" onClick={() => { setStep("form"); setENote(null); }}>Alterar e-mail</button>
            <Toast n={eNote} />
          </div>
        )}
        {step === "idle" && locked && <Toast n={eNote} />}
        {step === "form" && (
          <form onSubmit={requestEmail} noValidate>
            <div className="ps-row">
              <Field id="ps-newemail" label="Novo e-mail" error={eErr.email}>
                <div className={`ps-input${eErr.email ? " bad" : ""}`}><input id="ps-newemail" type="email" inputMode="email" autoCapitalize="none" spellCheck={false} maxLength={254} autoComplete="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} aria-invalid={!!eErr.email || undefined} aria-describedby={eErr.email ? "ps-newemail-err" : undefined} /></div>
              </Field>
              <Field id="ps-emailpass" label="Senha atual" error={eErr.password}>
                <PassInput id="ps-emailpass" value={curPass} onChange={setCurPass} autoComplete="current-password" invalid={!!eErr.password} />
              </Field>
            </div>
            <div className="ps-actions">
              <button className="ps-btn" type="submit" disabled={eBusy}>{eBusy ? "Enviando…" : "Enviar código"}</button>
              <button className="ps-btn ghost" type="button" onClick={() => { setStep("idle"); setEErr({}); setENote(null); }}>Cancelar</button>
              <Toast n={eNote} />
            </div>
          </form>
        )}
        {step === "code" && (
          <form onSubmit={confirmEmail} noValidate>
            <Field id="ps-code" label="Código de verificação" error={eErr.code}>
              <div className={`ps-input ps-code${eErr.code ? " bad" : ""}`}><input id="ps-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} aria-invalid={!!eErr.code || undefined} aria-describedby={eErr.code ? "ps-code-err" : undefined} /></div>
            </Field>
            <div className="ps-actions">
              <button className="ps-btn" type="submit" disabled={eBusy || code.length !== 6}>{eBusy ? "Confirmando…" : "Confirmar e-mail"}</button>
              <button className="ps-btn ghost" type="button" onClick={() => { setStep("form"); setEErr({}); setENote(null); }}>Voltar</button>
              <Toast n={eNote} />
            </div>
          </form>
        )}
      </section>

      <section className="ps-card">
        <h3>Senha</h3>
        <p className="ps-sub">Use uma senha forte e exclusiva. Depois de alterar, as outras sessões abertas serão encerradas.</p>
        {!pwOpen ? (
          <div className="ps-actions">
            <button className="ps-btn" type="button" onClick={() => { setPwOpen(true); setSNote(null); }}>Alterar senha</button>
            <Toast n={sNote} />
          </div>
        ) : (
          <form onSubmit={changePassword} noValidate>
            <Field id="ps-cur" label="Senha atual" error={sErr.current}>
              <PassInput id="ps-cur" value={cur} onChange={setCur} autoComplete="current-password" invalid={!!sErr.current} />
            </Field>
            <div className="ps-row">
              <Field id="ps-new" label="Nova senha" error={rulesOk ? sErr.password : undefined}>
                <PassInput id="ps-new" value={pw} onChange={setPw} autoComplete="new-password" invalid={!!sErr.password} onFocus={() => setPwFocus(true)} onBlur={() => setPwFocus(false)} />
              </Field>
              <Field id="ps-new2" label="Confirme a nova senha" error={pw2 && pw2 !== pw ? "As senhas não coincidem." : sErr.confirm}>
                <PassInput id="ps-new2" value={pw2} onChange={setPw2} autoComplete="new-password" invalid={!!sErr.confirm || (!!pw2 && pw2 !== pw)} onFocus={() => setPwFocus(true)} onBlur={() => setPwFocus(false)} />
              </Field>
            </div>
            <Rules value={pw} focus={pwFocus} />
            <div className="ps-actions">
              <button className="ps-btn ps-btn-ico ps-save" type="submit" disabled={sBusy}>
                {sBusy ? <span className="ps-btn-spin" aria-hidden="true" /> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7" /></svg>}
                {sBusy ? "Alterando…" : "Salvar nova senha"}
              </button>
              <button className="ps-btn ghost" type="button" disabled={sBusy} onClick={closePw}>Cancelar</button>
              <Toast n={sNote} />
            </div>
          </form>
        )}
      </section>

    </div>
  );
}
