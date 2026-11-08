import type { MetadataRoute } from "next";

const SITE = "https://zetrix-website.vercel.app";
const PAGES = ["", "/about", "/facility", "/services", "/products", "/policies", "/projects", "/contact", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((p) =>
    (["ar", "en"] as const).map((lang) => ({
      url: `${SITE}/${lang}${p}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : p === "/products" || p === "/contact" ? 0.9 : 0.7,
      alternates: { languages: { ar: `${SITE}/ar${p}`, en: `${SITE}/en${p}` } },
    })),
  );
}
