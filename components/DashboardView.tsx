import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { renderDashboard } from "@/lib/dash";
import DashboardClient from "./DashboardClient";

export default async function DashboardView({ path, title }: { path: string; title?: string }) {
  const user = await currentUser();
  if (!user) redirect("/login");
  return (
    <>
      <link rel="stylesheet" href="/assets/ProjectCollectionStatus-B4366OmV.css" precedence="default" />
      <link rel="stylesheet" href="/assets/DashboardBackdrop-BfF_92HW.css" precedence="default" />
      <link rel="stylesheet" href="/assets/DashboardApp-BqWR_xBJ.css" precedence="default" />
      <DashboardClient html={renderDashboard(path, user, title)} />
    </>
  );
}
