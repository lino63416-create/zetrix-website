import Image from "next/image";

/** Endless moving band with the ZETRIX logo and name (pure CSS, pauses on hover). */
export default function BrandMarquee({ variant = "gold" }: { variant?: "gold" | "navy" }) {
  const items = Array.from({ length: 6 });
  const gold = variant === "gold";
  const group = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-8">
          <Image
            src="/images/logo.jpg"
            alt={hidden || i > 0 ? "" : "ZETRIX"}
            width={40}
            height={46}
            className={`h-10 w-auto rounded-md ${gold ? "ring-2 ring-navy-950/20" : "ring-1 ring-gold-400/40"}`}
          />
          <span className={`font-display text-2xl font-extrabold tracking-[0.2em] ${gold ? "text-navy-950" : "text-gold-gradient"}`}>
            ZETRIX
          </span>
          <span className={`font-display text-xl font-bold ${gold ? "text-navy-900" : "text-white"}`} dir="rtl">
            زيتركس للصناعات المعدنية
          </span>
          <span className={`text-sm font-semibold uppercase tracking-[0.25em] ${gold ? "text-navy-900/70" : "text-white/60"}`}>
            Metal Industries
          </span>
          <span className={`ms-4 h-2.5 w-2.5 rotate-45 ${gold ? "bg-navy-950" : "bg-gold-400"}`} />
        </div>
      ))}
    </div>
  );
  return (
    <div
      className={`marquee relative overflow-hidden border-y py-4 ${
        gold
          ? "border-gold-500/40 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500"
          : "border-gold-400/20 bg-navy-950"
      }`}
      dir="ltr"
    >
      <div className="marquee-track flex w-max">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
