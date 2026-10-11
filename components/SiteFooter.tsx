import { siteFooterHtml } from "@/lib/sitefooter";
import type { Lang } from "@/lib/langswitch";

export default function SiteFooter({ lang }: { lang: Lang }) {
  return <div className="sf-host" dangerouslySetInnerHTML={{ __html: siteFooterHtml(lang) }} />;
}
