"use client";
import { useEffect, useState } from "react";

/** Vídeo de fundo (ondas laranja, loop lento). Escolhe a versão pelo tamanho da tela e respeita "reduzir movimento". */
export default function PageBgVideo() {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 900px)");
    const update = () => setSrc(calm.matches ? null : small.matches ? "/media/bg/bg-540-slow.mp4?v=2" : "/media/bg/bg-1080-slow.mp4?v=2");
    update();
    calm.addEventListener("change", update);
    small.addEventListener("change", update);
    return () => {
      calm.removeEventListener("change", update);
      small.removeEventListener("change", update);
    };
  }, []);
  if (!src) return null;
  return (
    <video
      key={src}
      className="page-bg-video"
      src={src}
      poster="/assets/login-bg.png"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      onCanPlay={(e) => { e.currentTarget.play().catch(() => {}); }}
    />
  );
}
