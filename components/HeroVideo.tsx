"use client";
import { useEffect, useState } from "react";

/** Vídeo do hero. Só carrega no formato (desktop ou celular) que está visível e respeita "reduzir movimento". */
export default function HeroVideo({ variant }: { variant: "d" | "m" }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const size = window.matchMedia(variant === "m" ? "(max-width: 700px)" : "(min-width: 701px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setOn(size.matches && !calm.matches);
    update();
    size.addEventListener("change", update);
    calm.addEventListener("change", update);
    return () => {
      size.removeEventListener("change", update);
      calm.removeEventListener("change", update);
    };
  }, [variant]);
  if (!on) return null;
  return (
    <video
      className="mh-video"
      src="/media/home/hero-hq.mp4?v=2"
      poster="/assets/home-hands2.webp"
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
