// Perfis de acesso. "Super admins" vêm de código/variável de ambiente e não podem ser rebaixados nem suspensos pelo painel.
export type Role = "admin" | "user";
export const ROLES: Role[] = ["admin", "user"];
export const ROLE_LABEL: Record<Role, string> = { admin: "Administrador", user: "Usuário" };

const DEFAULT_ADMINS = ["thallysmouraof@gmail.com", "izabel.archive@gmail.com"];
export const SUPER_ADMINS = (process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",") : DEFAULT_ADMINS).map((e) => e.trim().toLowerCase()).filter(Boolean);

export const isSuperAdmin = (email: string) => SUPER_ADMINS.includes(email.trim().toLowerCase());
