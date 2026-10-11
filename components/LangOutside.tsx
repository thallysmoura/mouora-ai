"use client";
import { useEffect } from "react";

// fecha o seletor de idioma ao clicar fora ou pressionar Esc
export default function LangOutside() {
  useEffect(() => {
    const close = (e: Event) => {
      document.querySelectorAll<HTMLDetailsElement>("details.lsw[open], details.um[open]").forEach((d) => {
        if (!(e.target instanceof Node) || !d.contains(e.target)) d.open = false;
      });
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close(e);
    document.addEventListener("click", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("click", close); document.removeEventListener("keydown", esc); };
  }, []);
  return null;
}
