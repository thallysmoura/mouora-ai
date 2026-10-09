"use client";
import { createPortal } from "react-dom";

export default function LoadingOverlay() {
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="mo-loading-overlay" role="status" aria-live="polite" aria-label="Carregando">
      <svg width="56" height="56" viewBox="0 0 50 50" aria-hidden="true">
        <circle cx="25" cy="25" r="20" fill="none" stroke="#ef481f" strokeOpacity="0.2" strokeWidth="5" />
        <path d="M25 5a20 20 0 0 1 20 20" fill="none" stroke="#ef481f" strokeWidth="5" strokeLinecap="round" />
      </svg>
    </div>,
    document.body,
  );
}
