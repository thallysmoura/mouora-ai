"use client";
import { createContext, useContext, type ReactNode } from "react";
import { tr, type AuthDict, type Lang } from "@/lib/authi18n";

const Ctx = createContext<Lang>("pt");

/** Fornece o idioma às telas de autenticação (formulários são componentes de cliente). */
export function AuthLang({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <Ctx.Provider value={lang}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
export const useT = (): AuthDict => tr(useContext(Ctx));
