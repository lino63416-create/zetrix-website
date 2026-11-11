import Image from "next/image";
import type { Locale } from "@/lib/content";

/** Endless moving band with the ZETRIX emblem and the company name in the page language. */
export default function BrandMarquee({ lang, variant = "gold" }: { lang: Locale; variant?: "gold" | "navy" }) {
  const name = lang === "ar" ? "زيتريكس للصناعات المعدنية" : "ZETRIX Metal Industries";
  const gold = variant === "gold";
  const items = Array.from({ length: 6 });
  const group = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((_, i) => (
        <div key={i} className={`flex items-center gap-4 px-8 ${lang === "ar" ? "flex-row-reverse" : ""}`}>
          <Image
            src="/images/logo-emblem.png"
            alt={hidden || i > 0 ? "" : "ZETRIX"}
            width={64}
            height={48}
            className="h-12 w-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
          />
          <span
            dir={lang === "ar" ? "rtl" : "ltr"}
            className={`whitespace-nowrap font-display text-2xl font-extrabold ${
              lang === "en" ? "tracking-wide" : ""
            } ${gold ? "text-navy-950" : "text-gold-gradient"}`}
          >
            {name}
          </span>
          <span className={`mx-3 h-2.5 w-2.5 rotate-45 ${gold ? "bg-navy-950" : "bg-gold-400"}`} />
        </div>
      ))}
    </div>
  );
  return (
    <div
      className={`marquee relative overflow-hidden border-y py-3 ${
        gold
          ? "border-gold-500/40 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500"
          : "border-gold-400/20 bg-navy-950"
      }`}
      dir="ltr"
    >
      <div className={`marquee-track flex w-max ${lang === "ar" ? "marquee-rtl" : ""}`}>
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
