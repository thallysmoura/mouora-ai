import DashboardView from "@/components/DashboardView";
import ProfileSettings from "@/components/ProfileSettings";
import { cloudinaryReady } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";
export const metadata = { title: "Perfil — Mouora AI", robots: { index: false } };

export default function Page() {
  const photoEnabled = cloudinaryReady();
  return (
    <DashboardView path="/dashboard/settings/profile" title="Perfil" eyebrow="Configurações">
      {(u) => <ProfileSettings user={{ name: u.name, email: u.email, phone: u.phone, locale: u.locale, avatarUrl: u.avatarUrl, emailChangedAt: u.emailChangedAt }} photoEnabled={photoEnabled} />}
    </DashboardView>
  );
}
