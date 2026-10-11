"use client";
import { useLayoutEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export default function DashboardClient({ html, children }: { html: string; children?: ReactNode }) {
  // área "dg-slot" dentro do HTML do painel, onde entra o conteúdo interativo (ex.: configurações)
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  useLayoutEffect(() => { setSlot(document.getElementById("dg-slot")); }, [html]);
  return (
    <>
      <div
        data-theme="light"
        onClick={async (e) => {
          if ((e.target as HTMLElement).closest(".dg-rail-logout, [data-logout]")) {
            await fetch("/api/auth/logout", { method: "POST" });
            location.href = "/login";
          }
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {slot && children ? createPortal(children, slot) : null}
    </>
  );
}
