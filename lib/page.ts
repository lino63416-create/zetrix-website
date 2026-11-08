import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dictionaries, isLocale, type Dictionary, type Locale } from "./content";

export type PageKey = "about" | "facility" | "services" | "policies" | "projects" | "contact" | "products";
export type PageParams = { params: Promise<{ lang: string }> };

export async function resolve({ params }: PageParams): Promise<{ t: Dictionary; lang: Locale }> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return { t: dictionaries[lang], lang };
}

export function pageMetadata(key: PageKey) {
  return async ({ params }: PageParams): Promise<Metadata> => {
    const { lang } = await params;
    if (!isLocale(lang)) return {};
    const t = dictionaries[lang];
    const page = t.pages[key];
    return {
      title: `${page.title} | ${t.hero.eyebrow}`,
      description: page.text,
      alternates: { languages: { en: `/en/${key}`, ar: `/ar/${key}` } },
    };
  };
}
