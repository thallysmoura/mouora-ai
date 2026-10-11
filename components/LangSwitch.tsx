import { langSwitchHtml, type Lang } from "@/lib/langswitch";

export default function LangSwitch({ lang, slug = "", query = false }: { lang: Lang; slug?: string; query?: boolean }) {
  return <div className="lsw-host" dangerouslySetInnerHTML={{ __html: langSwitchHtml(lang, slug, query) }} />;
}
