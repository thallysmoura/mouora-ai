import "@/components/legal.css";
import { readFileSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Política de Privacidade — Mouora AI", description: "Política de Privacidade da MOUORA AI: dados pessoais, gravações, provedores, retenção e direitos dos titulares." };
export default function Page() {
  const html = readFileSync(join(process.cwd(), "content", "pt_privacy.html"), "utf8");
  return <div data-lang="pt-BR" dangerouslySetInnerHTML={{ __html: html }} />;
}
