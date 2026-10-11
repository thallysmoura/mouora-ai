"use client";
import { useState } from "react";
import { IArrowRight, IBarsOutline, IChevDown, IChevRight, IClipboard, IDoc, IEye, IEyeOff, IHelp, IList, IPlus, ICard, IUser, IUserPlus } from "./Icons";

const FAQ = ["Como funcionam as gravações?", "Como recebo meus ganhos?", "Como convidar pessoas?", "Formas de pagamento", "Segurança da conta"];
const TABS = ["Tudo", "Em casa", "No trabalho"];
const BARS = [10, 16, 26, 40, 62, 88, 64];

function Person({ hue }: { hue: number }) {
  return (
    <span className="dh-person" style={{ background: `linear-gradient(145deg, hsl(${hue} 38% 78%), hsl(${hue} 30% 58%))` }} aria-hidden="true">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="rgba(255,255,255,0.92)"><circle cx="12" cy="9" r="4.2" /><path d="M4 21c0-4.4 3.6-7.4 8-7.4s8 3 8 7.4Z" /></svg>
    </span>
  );
}

export default function DashHome({ first, date }: { first: string; date: string }) {
  const [hidden, setHidden] = useState(false);
  const [tab, setTab] = useState(0);
  const money = hidden ? "US$ ••••" : "US$ 0,00";

  return (
    <div className="dh">
      <p className="dh-date">{date}</p>
      <h1 className="dh-hello">Olá, {first}.</h1>
      <p className="dh-sub">Aqui está um resumo da sua conta e das suas atividades.</p>

      <section className="dh-cards" aria-label="Resumo">
        <article className="dh-card dh-balance">
          <div className="dh-card-head">
            <span className="dh-tile glass"><ICard size={26} /></span>
            <h2>Saldo disponível</h2>
            <button type="button" className="dh-eye" aria-label={hidden ? "Mostrar saldo" : "Ocultar saldo"} aria-pressed={hidden} onClick={() => setHidden(!hidden)}>{hidden ? <IEyeOff size={26} /> : <IEye size={26} />}</button>
          </div>
          <p className="dh-money">{money}</p>
          <a className="dh-pill" href="/dashboard/earnings">Ver ganhos <IArrowRight size={16} /></a>
        </article>

        <article className="dh-card dh-stat">
          <div className="dh-card-head">
            <span className="dh-tile"><IBarsOutline size={26} /></span>
            <h2>Total de ganhos</h2>
            <a className="dh-go" href="/dashboard/earnings" aria-label="Ver total de ganhos"><IChevRight size={18} /></a>
          </div>
          <p className="dh-money dark">{money}</p>
          <p className="dh-muted">Todo o período</p>
          <div className="dh-chart" aria-hidden="true">{BARS.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
        </article>

        <article className="dh-card dh-stat">
          <div className="dh-card-head">
            <span className="dh-tile"><IUserPlus size={26} /></span>
            <h2>Pessoas na rede</h2>
            <a className="dh-go" href="/dashboard/referrals" aria-label="Ver pessoas na rede"><IChevRight size={18} /></a>
          </div>
          <p className="dh-money dark">0</p>
          <div className="dh-net">
            <p className="dh-muted">Convide pessoas e aumente sua rede.</p>
            <div className="dh-people">
              <Person hue={24} /><Person hue={210} /><Person hue={340} />
              <a className="dh-add" href="/dashboard/referrals" aria-label="Convidar pessoas"><IPlus size={20} /></a>
            </div>
          </div>
        </article>
      </section>

      <section className="dh-links" aria-label="Atalhos">
        {[
          { icon: IClipboard, t: "Ver tarefas disponíveis", s: "Acesse e comece agora.", href: "/dashboard/tasks" },
          { icon: IHelp, t: "Perguntas frequentes", s: "Tire suas dúvidas.", href: "/dashboard/help" },
          { icon: IUserPlus, t: "Convidar pessoas", s: "Aumente sua rede.", href: "/dashboard/referrals" },
        ].map(({ icon: Icon, t, s, href }) => (
          <a key={t} className="dh-card dh-link" href={href}>
            <span className="dh-tile"><Icon size={26} /></span>
            <span className="dh-link-txt"><strong>{t}</strong><small>{s}</small></span>
            <IChevRight size={20} className="dh-link-chev" />
          </a>
        ))}
      </section>

      <section className="dh-bottom">
        <article className="dh-card dh-rec">
          <div className="dh-rec-head">
            <h2>Suas gravações</h2>
            <button type="button" className="dh-sort" aria-haspopup="listbox"><IList size={16} />Mais recentes<IChevDown size={14} /></button>
          </div>
          <div className="dh-tabs" role="tablist" aria-label="Filtrar gravações">
            {TABS.map((t, i) => (
              <button key={t} type="button" role="tab" aria-selected={tab === i} className={tab === i ? "on" : ""} onClick={() => setTab(i)}>{t}</button>
            ))}
          </div>
          <hr />
          <div className="dh-empty">
            <span className="dh-empty-ico"><IClipboard size={38} /></span>
            <strong>Nenhuma gravação no momento.</strong>
            <p>Quando novas gravações estiverem disponíveis, elas aparecerão aqui.</p>
          </div>
        </article>

        <article className="dh-card dh-faq">
          <div className="dh-faq-head">
            <span className="dh-tile"><IHelp size={26} /></span>
            <h2>Perguntas frequentes</h2>
            <a className="dh-faq-go" href="/dashboard/help" aria-label="Ver todas as perguntas"><IChevRight size={22} /></a>
          </div>
          <ul className="dh-faq-list">
            {FAQ.map((q) => (
              <li key={q}><a href="/dashboard/help"><IDoc size={20} /><span>{q}</span><IChevRight size={16} /></a></li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
