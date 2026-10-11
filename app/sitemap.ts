import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// páginas públicas traduzidas (EN na raiz, PT em /pt, ES em /es)
const pages: { slug: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
  { slug: "", priority: 1, changeFrequency: "weekly" },
  { slug: "/como-funciona", priority: 0.8, changeFrequency: "monthly" },
  { slug: "/sobre", priority: 0.7, changeFrequency: "monthly" },
  { slug: "/contato", priority: 0.6, changeFrequency: "yearly" },
  { slug: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { slug: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

const locales = { en: "", "pt-BR": "/pt", es: "/es" } as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return pages.flatMap(({ slug, priority, changeFrequency }) => {
    const url = (prefix: string) => `${SITE_URL}${prefix}${slug}` || SITE_URL;
    const languages = {
      ...Object.fromEntries(Object.entries(locales).map(([l, p]) => [l, url(p)])),
      "x-default": url(""),
    };
    return Object.values(locales).map((prefix) => ({
      url: url(prefix), lastModified, changeFrequency, priority, alternates: { languages },
    }));
  });
}
