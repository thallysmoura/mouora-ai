import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MOUORA AI",
    short_name: "MOUORA",
    description: "Grave momentos reais e seja recompensado por isso.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf6",
    theme_color: "#ef481f",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
