import { readFileSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Canais oficiais — Mouora AI", description: "A MOUORA AI conecta pessoas e empresas a projetos de coleta de vídeos em primeira pessoa para treinamento de inteligência artificial e robótica. O domínio oficial da plataforma é mouora.xyz, onde você cria sua conta, acessa projetos e acompanha seu trabalho aprovado." };
export default function Page() {
  const html = readFileSync(join(process.cwd(), "content", "pt_links.html"), "utf8");
  return <div data-lang="pt-BR" dangerouslySetInnerHTML={{ __html: html }} />;
}
