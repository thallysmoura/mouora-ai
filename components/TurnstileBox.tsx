"use client";
import { useEffect, useState } from "react";
import Script from "next/script";

/** Widget do Cloudflare Turnstile. O token vai num campo oculto "cf-turnstile-response" dentro do formulário. */
export default function TurnstileBox({ siteKey }: { siteKey?: string }) {
  // em localhost o widget (válido só para mouora.com) não carrega; o servidor também dispensa a verificação nesse caso
  const [local, setLocal] = useState(false);
  useEffect(() => { setLocal(/^(localhost|127\.0\.0\.1)$/.test(location.hostname)); }, []);
  if (!siteKey || local) return null;
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      <div className="cf-turnstile mo-turnstile" data-sitekey={siteKey} data-theme="light" data-size="flexible" data-appearance="interaction-only" />
    </>
  );
}

export const resetTurnstile = () => {
  try { (window as unknown as { turnstile?: { reset: () => void } }).turnstile?.reset(); } catch { /* sem widget */ }
};
export const readTurnstile = (form: HTMLElement | null) => (form?.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement | null)?.value ?? "";
