import DashboardView from "@/components/DashboardView";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mouora AI" };

export default function Page() {
  return <DashboardView path="/dashboard/projects" />;
}
