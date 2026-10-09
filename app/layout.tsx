import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Mouora AI",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" data-mimix-theme="light" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/assets/index.css" />
        <link rel="stylesheet" href="/assets/PasswordControl-CeNMX8bW.css" />
        <link rel="stylesheet" href="/assets/LoginApp-DZ6Rx14p.css" />
        <link rel="stylesheet" href="/assets/RegistrationApp-Dl-34VsH.css" />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
