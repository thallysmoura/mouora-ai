import "@/components/legal.css";
import { readFileSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Termos de Uso — Mouora AI", description: "Termos de Uso da plataforma MOUORA AI: conta, participação em projetos, trabalho aprovado, empresas e responsabilidades." };
export default function Page() {
  const html = readFileSync(join(process.cwd(), "content", "pt_terms.html"), "utf8");
  return <div data-lang="pt-BR" dangerouslySetInnerHTML={{ __html: html }} />;
}
