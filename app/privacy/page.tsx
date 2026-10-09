import "@/components/legal.css";
import { readFileSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy Policy — Mouora AI", description: "MOUORA AI Privacy Policy: personal information, recordings, providers, retention and your rights." };
export default function Page() {
  const html = readFileSync(join(process.cwd(), "content", "x_privacy.html"), "utf8");
  return <div data-lang="en" dangerouslySetInnerHTML={{ __html: html }} />;
}
