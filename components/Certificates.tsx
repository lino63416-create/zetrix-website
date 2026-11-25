"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Dictionary, Locale } from "@/lib/content";
import { CheckIcon, CloseIcon } from "./Icons";

type C = Dictionary["certs"];

function Lightbox({ src, title, close, label }: { src: string; title: string; close: () => void; label: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [close]);
  return (
    <div role="dialog" aria-modal aria-label={title} onClick={close} className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/90 p-4 backdrop-blur-sm">
      <button type="button" onClick={close} aria-label={label} className="absolute end-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
        <CloseIcon className="h-6 w-6" />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={title} onClick={(e) => e.stopPropagation()} className="max-h-[90vh] max-w-full rounded-lg bg-white shadow-2xl" />
    </div>
  );
}

/** Full certificates section (About page). */
export function CertificatesSection({ c }: { c: C }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="certificates" className="relative overflow-hidden navy-bg scroll-mt-20 py-24">
      <div className="grid-lines absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold-400">{c.eyebrow}</p>
          <h2 className="text-gold-gradient mt-4 text-3xl font-extrabold sm:text-4xl">{c.title}</h2>
          <p className="mt-5 text-lg text-white/75">{c.text}</p>
        </div>
        <ul className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-3">
          {c.items.map((it, i) => (
            <li key={it.id} className="flex flex-col items-center">
              {/* hanging wire */}
              <span className="cert-wire" aria-hidden />
              <button type="button" onClick={() => setOpen(i)} className="cert-frame group" aria-label={`${c.view}: ${it.title}`}>
                <span className="cert-mat">
                  <span className="relative block aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={`/certificates/${it.id}-thumb.jpg`}
                      alt={it.title}
                      fill
                      sizes="(min-width:768px) 30vw, 90vw"
                      className="object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </span>
                </span>
                <span className="cert-shine" aria-hidden />
                <span className="cert-seal" aria-hidden>
                  <CheckIcon className="h-5 w-5" />
                </span>
                <span className="cert-view">{c.view}</span>
              </button>
              <div className="mt-6 text-center">
                <span className="inline-block rounded-full border border-gold-400/40 bg-gold-400/10 px-3 py-0.5 text-xs font-semibold text-gold-300">
                  {c.verified}
                </span>
                <h3 className="mt-3 text-xl font-bold text-white">{it.title}</h3>
                <p className="mt-1 text-sm text-gold-300">{it.issuer}</p>
                <p className="mt-2 text-sm text-white/60" dir="auto">{it.detail}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-14 rounded-2xl glass-card p-6 sm:p-8">
          <h3 className="text-xl font-bold text-white">{c.activitiesTitle}</h3>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {c.activities.map((a) => (
              <li key={a} className="flex items-start gap-3 text-white/80">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-400 text-navy-950">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {open !== null && (
        <Lightbox src={`/certificates/${c.items[open].id}.jpg`} title={c.items[open].title} close={() => setOpen(null)} label={c.close} />
      )}
    </section>
  );
}

/** Compact trust strip for the home page. */
export function CertificatesStrip({ c, lang }: { c: C; lang: Locale }) {
  return (
    <section className="border-b border-steel-100 bg-white py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
        <p className="text-center text-lg font-bold text-navy-900 lg:text-start">{c.stripTitle}</p>
        <ul className="flex flex-wrap justify-center gap-3">
          {c.items.map((it) => (
            <li key={it.id} className="flex items-center gap-2 rounded-full border border-steel-100 bg-steel-50 px-4 py-2 text-sm font-semibold text-navy-900">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-gold-400 text-navy-950">
                <CheckIcon className="h-3 w-3" />
              </span>
              {it.title}
            </li>
          ))}
        </ul>
        <Link href={`/${lang}/about#certificates`} className="shrink-0 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700">
          {c.viewAll}
        </Link>
      </div>
    </section>
  );
}
