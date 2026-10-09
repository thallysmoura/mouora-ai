import type { Metadata } from "next";
import HowItWorks from "@/components/HowItWorks";

export const metadata: Metadata = { title: "How it works — Mouora AI" };

export default function Page() {
  return <HowItWorks lang="en" />;
}
