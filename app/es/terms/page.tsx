import "@/components/legal.css";
import { readFileSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Términos de Uso — Mouora AI", description: "Términos de Uso de MOUORA AI: cuentas, participación en proyectos, trabajo aprobado, empresas y responsabilidades." };
export default function Page() {
  const html = readFileSync(join(process.cwd(), "content", "x_es_terms.html"), "utf8");
  return <div data-lang="es" dangerouslySetInnerHTML={{ __html: html }} />;
}
