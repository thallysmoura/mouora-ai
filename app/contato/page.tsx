import type { Metadata } from "next";
import ContactPage from "@/components/ContactPage";

export const metadata: Metadata = { title: "Contact — Mouora AI" };

export default function Page() {
  return <ContactPage lang="en" />;
}
