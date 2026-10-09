import type { Metadata } from "next";
import ContactPage from "@/components/ContactPage";

export const metadata: Metadata = { title: "Contato — Mouora AI" };

export default function Page() {
  return <ContactPage lang="pt" />;
}
