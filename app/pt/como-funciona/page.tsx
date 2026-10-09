import type { Metadata } from "next";
import HowItWorks from "@/components/HowItWorks";

export const metadata: Metadata = { title: "Como funciona — Mouora AI" };

export default function Page() {
  return <HowItWorks lang="pt" />;
}
