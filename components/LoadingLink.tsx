"use client";
import { useState, type ReactNode } from "react";
import LoadingOverlay from "./LoadingOverlay";

export default function LoadingLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <a
        href={href}
        className={className}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
          e.preventDefault();
          setLoading(true);
          setTimeout(() => location.assign(href), 450);
        }}
      >
        {children}
      </a>
      {loading && <LoadingOverlay />}
    </>
  );
}
