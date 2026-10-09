import type { Metadata } from "next";
import AboutPage from "@/components/AboutPage";

export const metadata: Metadata = { title: "Sobre — Mouora AI" };

export default function Page() {
  return <AboutPage lang="pt" />;
}
