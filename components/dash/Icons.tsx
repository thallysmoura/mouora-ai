import type { ReactNode } from "react";

type P = { size?: number; className?: string };
const S = ({ size = 22, className, children, sw = 1.7 }: P & { children: ReactNode; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{children}</svg>
);

export const IHome = (p: P) => <S {...p}><path d="M3.5 11 12 3.8 20.5 11" /><path d="M5.5 9.6V19a1.5 1.5 0 0 0 1.5 1.5h3.2v-5.2h3.6v5.2H17a1.5 1.5 0 0 0 1.5-1.5V9.6" /></S>;
export const IFolder = (p: P) => <S {...p}><path d="M3.5 7.3A2.3 2.3 0 0 1 5.8 5h3.6l2 2.4h6.8a2.3 2.3 0 0 1 2.3 2.3v7.5a2.3 2.3 0 0 1-2.3 2.3H5.8a2.3 2.3 0 0 1-2.3-2.3Z" /></S>;
export const ICheckSquare = (p: P) => <S {...p}><rect x="3.8" y="3.8" width="16.4" height="16.4" rx="3.2" /><path d="m8.2 12.2 2.6 2.7 5-5.4" /></S>;
export const ICard = (p: P) => <S {...p}><rect x="3" y="5.2" width="18" height="13.6" rx="3" /><path d="M3 9.8h18M7 14.6h3" /></S>;
export const IUserPlus = (p: P) => <S {...p}><circle cx="9.5" cy="8.3" r="3.6" /><path d="M2.8 19.6a6.7 6.7 0 0 1 13.4 0" /><path d="M18.6 8.2v5.2M16 10.8h5.2" /></S>;
export const IBulb = (p: P) => <S {...p}><path d="M9.2 17.6h5.6M10 20.2h4" /><path d="M12 3.5a5.6 5.6 0 0 0-3.3 10.1c.6.5 1 1.2 1 2v.2h4.6v-.2c0-.8.4-1.5 1-2A5.6 5.6 0 0 0 12 3.5Z" /></S>;
export const IBell = (p: P) => <S {...p}><path d="M6.2 16.8V11a5.8 5.8 0 0 1 11.6 0v5.8l1.6 1.9H4.6Z" /><path d="M10 20.8a2.2 2.2 0 0 0 4 0" /></S>;
export const IChevDown = (p: P) => <S {...p} sw={2.2}><path d="m6 9.5 6 6 6-6" /></S>;
export const IChevRight = (p: P) => <S {...p} sw={2.2}><path d="m9.5 6 6 6-6 6" /></S>;
export const IArrowRight = (p: P) => <S {...p} sw={2}><path d="M5 12h14m-6-6 6 6-6 6" /></S>;
export const IEye = (p: P) => <S {...p}><path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.9" /></S>;
export const IEyeOff = (p: P) => <S {...p}><path d="M2.5 12S6 5.8 12 5.8c1.4 0 2.7.3 3.8.8M21.5 12s-1.2 2.2-3.4 3.9M9.9 18c.7.2 1.4.2 2.1.2 6 0 9.5-6.2 9.5-6.2" /><path d="M4 20 20 4" /></S>;
export const IDoc = (p: P) => <S {...p}><path d="M7 3.6h6.6L18.4 8.4v10.9a1.5 1.5 0 0 1-1.5 1.5H7a1.5 1.5 0 0 1-1.5-1.5V5.1A1.5 1.5 0 0 1 7 3.6Z" /><path d="M13.4 3.8v4.8h4.8M8.6 12.6h6.8M8.6 16h5" /></S>;
export const IList = (p: P) => <S {...p}><path d="M4 7h16M4 12h10M4 17h6" /></S>;
export const IHelp = (p: P) => <S {...p}><circle cx="12" cy="12" r="8.7" /><path d="M9.6 9.6a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .9-1 1.6" /><path d="M12 16.9h.01" /></S>;
export const IWallet = (p: P) => <S {...p}><path d="M4 8.2A2.2 2.2 0 0 1 6.2 6H18a2 2 0 0 1 2 2v1.4" /><rect x="3.5" y="8.4" width="17" height="11" rx="2.6" /><path d="M16 14h2.2" /></S>;
export const IBars = (p: P) => <S {...p} sw={2.2}><path d="M6 20V13M12 20V5M18 20v-9" /></S>;
export const IClipboard = (p: P) => <S {...p}><rect x="5.5" y="4.6" width="13" height="16" rx="2.4" /><path d="M9.2 4.6V4a1 1 0 0 1 1-1h3.6a1 1 0 0 1 1 1v.6M9 10.2h6M9 13.6h6M9 17h3.6" /></S>;
export const ILogout = (p: P) => <S {...p}><path d="M9.5 4.5H6.8A2.3 2.3 0 0 0 4.5 6.8v10.4a2.3 2.3 0 0 0 2.3 2.3h2.7M15.5 8l4 4-4 4M19.5 12H9.5" /></S>;
export const IUser = (p: P) => <S {...p}><circle cx="12" cy="8.5" r="3.7" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></S>;
export const IMenu = (p: P) => <S {...p} sw={2}><path d="M4 7h16M4 12h16M4 17h16" /></S>;
export const IClose = (p: P) => <S {...p} sw={2}><path d="M6 6l12 12M18 6 6 18" /></S>;
export const IPlus = (p: P) => <S {...p} sw={2.4}><path d="M12 5v14M5 12h14" /></S>;
export const ICheck = (p: P) => <S {...p} sw={2.4}><path d="m5 12.5 4.5 4.5L19 7" /></S>;

export const FlagBR = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="#009b3a" /><path fill="#ffdf00" d="m16 5.2 11.2 10.8L16 26.8 4.8 16Z" /><circle cx="16" cy="16" r="5.4" fill="#002776" /><path d="M10.9 15.2c3.4-.9 7.1-.2 10 1.9" stroke="#fff" strokeWidth="1" fill="none" /></svg>
);
export const FlagUS = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true"><defs><clipPath id="fus"><circle cx="16" cy="16" r="16" /></clipPath></defs><g clipPath="url(#fus)"><rect width="32" height="32" fill="#fff" /><path fill="#d22f3c" d="M0 0h32v2.5H0zm0 5h32v2.5H0zm0 5h32v2.5H0zm0 5h32v2.5H0zm0 5h32v2.5H0zm0 5h32v2.5H0zm0 5h32V32H0z" /><rect width="15" height="17.5" fill="#2b3a8c" /></g></svg>
);
export const FlagES = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true"><defs><clipPath id="fes"><circle cx="16" cy="16" r="16" /></clipPath></defs><g clipPath="url(#fes)"><rect width="32" height="32" fill="#c8202f" /><rect y="8" width="32" height="16" fill="#f6c200" /></g></svg>
);

export const IShield = (p: P) => <S {...p}><path d="M12 3.2 4.6 6v5.6c0 4.4 3 7.9 7.4 9.2 4.4-1.3 7.4-4.8 7.4-9.2V6Z" /><path d="m8.8 12.2 2.3 2.3 4.2-4.5" /></S>;
export const IPin = (p: P) => <S {...p}><path d="M12 21s6.5-5.6 6.5-11a6.5 6.5 0 0 0-13 0c0 5.4 6.5 11 6.5 11Z" /><circle cx="12" cy="10" r="2.4" /></S>;
export const ISearch = (p: P) => <S {...p}><circle cx="11" cy="11" r="6.3" /><path d="m20 20-4.2-4.2" /></S>;
export const IDevice = (p: P) => <S {...p}><rect x="3.5" y="5" width="17" height="11" rx="2" /><path d="M8 20h8M12 16v4" /></S>;

/** Gráfico de barras vazado (3 barras com contorno: curta, alta e média), igual ao mockup. */
export const IBarsOutline = ({ size = 26, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect x="3.6" y="12.4" width="4" height="7.6" rx="1.3" /><rect x="10" y="4.2" width="4" height="15.8" rx="1.3" /><rect x="16.4" y="8" width="4" height="12" rx="1.3" />
  </svg>
);
