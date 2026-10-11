import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { currentUser } from "@/lib/auth";
import DashShell from "./dash/DashShell";
import DashHome from "./dash/DashHome";
import { IClipboard } from "./dash/Icons";
import PendingAccess from "./dash/PendingAccess";

type User = NonNullable<Awaited<ReturnType<typeof currentUser>>>;

const TITLES: Record<string, string> = {
  "/dashboard/projects": "Projetos",
  "/dashboard/tasks": "Tarefas",
  "/dashboard/earnings": "Ganhos",
  "/dashboard/referrals": "Convidar",
  "/dashboard/activity": "Atividade",
  "/dashboard/help": "Ajuda",
  "/dashboard/company": "Minha empresa",
  "/dashboard/inbox": "Caixa de entrada",
  "/dashboard/phone-loans": "Comodato de telefone",
};

const today = () => {
  const s = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", timeZone: "America/Manaus" });
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/** Painel autenticado: barra lateral + topo (layout nativo). Sem `children`, renderiza o Início ou um "em breve". */
export default async function DashboardView({ path, title, eyebrow, adminOnly, children }: { path: string; title?: string; eyebrow?: string; adminOnly?: boolean; children?: (user: User) => ReactNode | Promise<ReactNode> }) {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.status === "pending") return <PendingAccess name={user.name} email={user.email} />; // aguardando liberação por um administrador
  if (adminOnly && !user.isAdmin) redirect("/dashboard"); // áreas administrativas: nem a página abre para quem não é admin
  const first = user.name.trim().split(/\s+/)[0] || "";
  const label = title ?? TITLES[path] ?? "Em breve";

  const content = children ? await children(user) : null;
  let body: ReactNode;
  if (children) {
    body = (
      <>
        <div className="dp-head">{eyebrow && <p>{eyebrow}</p>}<h1>{label}</h1></div>
        {content}
      </>
    );
  } else if (path === "/dashboard") {
    body = <DashHome first={first} date={today()} />;
  } else {
    body = (
      <>
        <div className="dp-head"><h1>{label}</h1></div>
        <section className="dh-card dp-soon">
          <span className="dh-empty-ico"><IClipboard size={38} /></span>
          <strong>Esta área estará disponível em breve.</strong>
          <p>Estamos preparando esta seção para você.</p>
        </section>
      </>
    );
  }

  return (
    <DashShell user={{ name: user.name, email: user.email, avatarUrl: user.avatarUrl }} path={path} isAdmin={user.isAdmin}>
      {body}
    </DashShell>
  );
}
