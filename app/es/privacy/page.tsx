import "@/components/legal.css";
import { readFileSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Política de Privacidad — Mouora AI", description: "Política de Privacidad de MOUORA AI: datos personales, grabaciones, proveedores, conservación y derechos." };
export default function Page() {
  const html = readFileSync(join(process.cwd(), "content", "x_es_privacy.html"), "utf8");
  return <div data-lang="es" dangerouslySetInnerHTML={{ __html: html }} />;
}
