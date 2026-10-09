import DashboardView from "@/components/DashboardView";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mouora AI" };

const TITLES: Record<string, string> = { tasks: "Tarefas", company: "Minha empresa", "phone-loans": "Comodato de telefone", settings: "Configurações", inbox: "Caixa de entrada", help: "Ajuda" };

export default async function Page({ params }: { params: Promise<{ rest: string[] }> }) {
  const { rest } = await params;
  return <DashboardView path={"/dashboard/" + rest.join("/")} title={TITLES[rest[0]] ?? "Em breve"} />;
}
