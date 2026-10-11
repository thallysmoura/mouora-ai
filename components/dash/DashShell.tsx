"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { FlagBR, FlagES, FlagUS, IBell, IBulb, ICard, ICheck, ICheckSquare, IChevDown, IChevRight, IClose, IFolder, IHome, ILogout, IMenu, IPin, IShield, IUser, IUserPlus } from "./Icons";
import "./dash.css";

type U = { name: string; email: string; avatarUrl: string };

const NAV = [
  { href: "/dashboard", label: "Início", icon: IHome },
  { href: "/dashboard/projects", label: "Projetos", icon: IFolder },
  { href: "/dashboard/tasks", label: "Tarefas", icon: ICheckSquare },
  { href: "/dashboard/earnings", label: "Ganhos", icon: ICard },
  { href: "/dashboard/referrals", label: "Convidar", icon: IUserPlus },
];

/** Fecha o menu aberto ao clicar fora ou apertar Esc. */
function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) close(); };
    const key = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", down); document.removeEventListener("keydown", key); };
  }, [open, close]);
  return ref;
}

const ADMIN_NAV = [
  { href: "/dashboard/access", label: "Controle de acesso", icon: IShield },
  { href: "/dashboard/logs", label: "Log de acesso", icon: IPin },
];

export default function DashShell({ user, path, isAdmin = false, children }: { user: U; path: string; isAdmin?: boolean; children: ReactNode }) {
  const [drawer, setDrawer] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [lang, setLang] = useState(false);
  const [bell, setBell] = useState(false);
  const userRef = useDismiss(userMenu, () => setUserMenu(false));
  const langRef = useDismiss(lang, () => setLang(false));
  const bellRef = useDismiss(bell, () => setBell(false));
  const first = user.name.trim().split(/\s+/)[0] || "";
  const initial = (first[0] ?? "?").toUpperCase();
  const active = (href: string) => (href === "/dashboard" ? path === "/dashboard" : path === href || path.startsWith(href + "/"));

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    location.href = "/login";
  };

  const avatar = user.avatarUrl
    ? <img className="dsh-avatar" src={user.avatarUrl} alt="" width={44} height={44} decoding="async" />
    : <span className="dsh-avatar dsh-avatar-ring" aria-hidden="true">{initial}</span>;

  return (
    <div className="dsh" data-drawer={drawer}>
      <aside className="dsh-side" aria-label="Navegação do painel">
        <div className="dsh-side-top">
          <a className="dsh-logo" href="/dashboard" aria-label="MOUORA — Início"><img src="/assets/brand/mouora-logo.webp" alt="mouora" width={190} height={63} /></a>
          <button type="button" className="dsh-x" aria-label="Fechar menu" onClick={() => setDrawer(false)}><IClose size={22} /></button>
        </div>
        <nav className="dsh-nav">
          {NAV.map(({ href, label, icon: Icon }) => (
            <a key={href} href={href} className={`dsh-link${active(href) ? " on" : ""}`} aria-current={active(href) ? "page" : undefined} onClick={() => setDrawer(false)}>
              <Icon size={26} /><span>{label}</span>
            </a>
          ))}
          {isAdmin && (
            <>
              <span className="dsh-nav-label">Administração</span>
              {ADMIN_NAV.map(({ href, label, icon: Icon }) => (
                <a key={href} href={href} className={`dsh-link${active(href) ? " on" : ""}`} aria-current={active(href) ? "page" : undefined} onClick={() => setDrawer(false)}>
                  <Icon size={26} /><span>{label}</span>
                </a>
              ))}
            </>
          )}
        </nav>
        <div className="dsh-side-bottom">
          <a href="/dashboard/help" className={`dsh-link${active("/dashboard/help") ? " on" : ""}`} onClick={() => setDrawer(false)}><IBulb size={26} /><span>Ajuda</span></a>
          <div className="dsh-usercard" ref={userRef}>
            <button type="button" className="dsh-userbtn" aria-haspopup="menu" aria-expanded={userMenu} onClick={() => setUserMenu(!userMenu)}>
              {avatar}
              <span className="dsh-uname">{first}</span>
              <IChevRight size={18} className="dsh-uchev" />
            </button>
            {userMenu && (
              <div className="dsh-pop dsh-pop-up" role="menu">
                <div className="dsh-pop-who">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
                <a role="menuitem" className="dsh-pop-item" href="/dashboard/settings/profile" onClick={() => setDrawer(false)}><IUser size={18} />Meu perfil</a>
                <button role="menuitem" type="button" className="dsh-pop-item out" onClick={logout}><ILogout size={18} />Sair</button>
              </div>
            )}
          </div>
        </div>
      </aside>
      <div className="dsh-scrim" onClick={() => setDrawer(false)} aria-hidden="true" />

      <div className="dsh-main">
        <header className="dsh-top">
          <button type="button" className="dsh-burger" aria-label="Abrir menu" onClick={() => setDrawer(true)}><IMenu size={24} /></button>
          <img className="dsh-top-logo" src="/assets/brand/mouora-logo.webp" alt="mouora" width={110} height={36} />
          <div className="dsh-tools">
            <div className="dsh-rel" ref={bellRef}>
              <button type="button" className="dsh-bell" aria-label="Notificações" aria-haspopup="true" aria-expanded={bell} onClick={() => setBell(!bell)}>
                <IBell size={26} /><span className="dsh-dot" aria-hidden="true" />
              </button>
              {bell && (
                <div className="dsh-pop dsh-pop-down" role="status">
                  <div className="dsh-pop-who"><strong>Notificações</strong><span>Você não tem novas notificações.</span></div>
                </div>
              )}
            </div>
            <span className="dsh-sep" aria-hidden="true" />
            <div className="dsh-rel" ref={langRef}>
              <button type="button" className="dsh-lang" aria-haspopup="menu" aria-expanded={lang} aria-label="Idioma: Português" onClick={() => setLang(!lang)}>
                <FlagBR size={30} /><b>PT</b><IChevDown size={16} />
              </button>
              {lang && (
                <div className="dsh-pop dsh-pop-down dsh-pop-lang" role="menu">
                  <span className="dsh-pop-label">Idioma</span>
                  <button role="menuitem" type="button" className="dsh-pop-item on" onClick={() => setLang(false)}><FlagBR size={24} />Português<ICheck size={16} className="dsh-pop-check" /></button>
                  <button role="menuitem" type="button" className="dsh-pop-item" disabled title="Em breve"><FlagUS size={24} />English<small>em breve</small></button>
                  <button role="menuitem" type="button" className="dsh-pop-item" disabled title="Em breve"><FlagES size={24} />Español<small>em breve</small></button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="dsh-content">{children}</main>
      </div>
    </div>
  );
}
