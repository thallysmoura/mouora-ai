import "@/components/legal.css";
import { readFileSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Terms of Use — Mouora AI", description: "MOUORA AI platform Terms of Use: accounts, project participation, approved work, companies and responsibilities." };
export default function Page() {
  const html = readFileSync(join(process.cwd(), "content", "x_terms.html"), "utf8");
  return <div data-lang="en" dangerouslySetInnerHTML={{ __html: html }} />;
}
