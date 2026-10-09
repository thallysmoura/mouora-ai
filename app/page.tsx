import type { Metadata } from "next";
import Home from "@/components/Home";

export const metadata: Metadata = { title: "Mouora AI" };

export default function Page() {
  return <Home lang="en" />;
}
