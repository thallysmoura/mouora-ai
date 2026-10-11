// Regras de cadastro compartilhadas entre o formulário (cliente) e a API (servidor).
// O servidor sempre revalida: a validação do navegador pode ser contornada.
import { tr, type Lang } from "./authi18n";

export const LIMITS = { nameMin: 2, nameMax: 120, emailMax: 254, passMin: 8, passMaxBytes: 72 };

export type RegisterErrors = Partial<Record<"name" | "email" | "password" | "confirm" | "terms", string>>;

const HIDDEN = /[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/u; // controle, zero-width, separadores de linha
const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}'’.\- ]*$/u;
const EMAIL_RE = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;
const COMMON = new Set(["12345678", "123456789", "1234567890", "password", "password1", "senha123", "senha1234", "qwerty123", "abc12345", "11111111", "iloveyou1", "mudar123", "admin123"]);

export const normalizeName = (v: unknown) => (typeof v === "string" ? v.normalize("NFC").replace(/\s+/g, " ").trim() : "");
export const normalizeEmail = (v: unknown) => (typeof v === "string" ? v.trim().toLowerCase() : "");

export function validateName(v: unknown, lang: Lang = "pt"): string | null {
  const t = tr(lang);
  if (typeof v !== "string") return t.vNameEmpty;
  const n = normalizeName(v);
  if (!n) return t.vNameEmpty;
  if (HIDDEN.test(v.replace(/\s/g, " "))) return t.vNameHidden;
  if (n.length < LIMITS.nameMin) return t.vNameShort;
  if (n.length > LIMITS.nameMax) return t.vNameLong;
  if (!NAME_RE.test(n) || (n.match(/\p{L}/gu)?.length ?? 0) < 2) return t.vNameChars;
  return null;
}

export function validateEmail(v: unknown, lang: Lang = "pt"): string | null {
  const t = tr(lang);
  if (typeof v !== "string" || !v.trim()) return t.vEmailEmpty;
  const e = normalizeEmail(v);
  if (e.length > LIMITS.emailMax) return t.vEmailLong;
  const [local = ""] = e.split("@");
  const tld = e.split(".").pop() ?? "";
  if (!EMAIL_RE.test(e) || local.length > 64 || local.startsWith(".") || local.endsWith(".") || local.includes("..") || !/^([a-z]{2,}|xn--[a-z0-9-]+)$/.test(tld))
    return t.vEmailBad;
  return null;
}

/** Regras exibidas ao vivo no formulário (vermelho = pendente, verde = ok). */
export const passwordRules = (p: string, lang: Lang = "pt") => {
  const t = tr(lang);
  return [
    { ok: p.length >= LIMITS.passMin, label: t.r1 },
    { ok: /\p{Lu}/u.test(p), label: t.r2 },
    { ok: /\p{Ll}/u.test(p), label: t.r3 },
    { ok: /\d/.test(p), label: t.r4 },
    { ok: /[^\p{L}\p{N}\s]/u.test(p), label: t.r5 },
  ];
};

export function validatePassword(v: unknown, email = "", lang: Lang = "pt"): string | null {
  const t = tr(lang);
  if (typeof v !== "string" || !v) return t.vPassEmpty;
  if (new TextEncoder().encode(v).length > LIMITS.passMaxBytes) return t.vPassLong;
  if (/[\p{Cc}\p{Cf}]/u.test(v)) return t.vPassBad;
  if (v !== v.trim()) return t.vPassSpace;
  const missing = passwordRules(v, lang).find((r) => !r.ok);
  if (missing) return `${t.vPassNeeds} ${missing.label.charAt(0).toLowerCase()}${missing.label.slice(1)}.`;
  if (new Set(v).size < 5) return t.vPassRepeat;
  const lower = v.toLowerCase();
  const local = email.split("@")[0];
  if (COMMON.has(lower) || (local.length >= 4 && lower.includes(local))) return t.vPassEasy;
  return null;
}

export function validateRegister(i: { name: unknown; email: unknown; password: unknown; confirm: unknown; terms: unknown }, lang: Lang = "pt") {
  const t = tr(lang);
  const errors: RegisterErrors = {};
  const name = validateName(i.name, lang); if (name) errors.name = name;
  const email = validateEmail(i.email, lang); if (email) errors.email = email;
  const pass = validatePassword(i.password, normalizeEmail(i.email), lang); if (pass) errors.password = pass;
  if (typeof i.confirm !== "string" || !i.confirm) errors.confirm = t.vConfirmEmpty;
  else if (i.confirm !== i.password) errors.confirm = t.vConfirmDiff;
  if (i.terms !== true) errors.terms = t.vTerms;
  return { errors, ok: Object.keys(errors).length === 0 };
}

/** Telefone opcional: aceita +, dígitos, espaços, parênteses e hífen; 8 a 15 dígitos. Devolve o valor normalizado ou null se inválido. */
export function normalizePhone(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  if (!t) return "";
  if (!/^\+?[0-9 ()\-]{8,24}$/.test(t)) return null;
  const digits = t.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return null;
  return (t.startsWith("+") ? "+" : "") + digits;
}
