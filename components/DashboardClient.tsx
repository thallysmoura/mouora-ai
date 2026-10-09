"use client";

export default function DashboardClient({ html }: { html: string }) {
  return (
    <div
      data-theme="light"
      onClick={async (e) => {
        if ((e.target as HTMLElement).closest(".dg-rail-logout")) {
          await fetch("/api/auth/logout", { method: "POST" });
          location.href = "/login";
        }
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
