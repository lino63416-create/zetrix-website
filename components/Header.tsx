"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Dictionary, Locale } from "@/lib/content";
import { CloseIcon, MenuIcon } from "./Icons";

export default function Header({
  t,
  homeLabel,
  lang,
}: {
  t: Dictionary["nav"];
  homeLabel: string;
  lang: Locale;
}) {
  const pathname = usePathname() || `/${lang}`;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu whenever the page changes
  useEffect(() => setOpen(false), [pathname]);

  const base = `/${lang}`;
  const links = [
    { href: base, label: homeLabel },
    { href: `${base}/about`, label: t.about },
    { href: `${base}/facility`, label: t.facility },
    { href: `${base}/services`, label: t.services },
    { href: `${base}/products`, label: t.products },
    { href: `${base}/policies`, label: t.policies },
    { href: `${base}/projects`, label: t.projects },
    { href: `${base}/contact`, label: t.contact },
  ];
  const isActive = (href: string) => (href === base ? pathname === base : pathname.startsWith(href));

  const other = lang === "en" ? "ar" : "en";
  const otherPath = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${other}`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-gold-400/20 bg-navy-950/85 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href={base} className="flex items-center gap-3">
          <Image
            src="/images/logo-emblem.png"
            alt="ZETRIX"
            width={62}
            height={49}
            className="h-12 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
            priority
          />
          <span className="text-gold-gradient font-display text-xl font-extrabold tracking-[0.18em]">ZETRIX</span>
        </Link>

        <ul className="hidden items-center gap-1 xl:flex">
          {links.map((l) => {
            const active = isActive(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    active ? "bg-gold-400/15 text-gold-300" : "text-white/80 hover:text-gold-400"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href={otherPath}
            className="rounded-full border border-white/25 px-3 py-1.5 text-sm text-white transition-colors hover:border-gold-400 hover:text-gold-400"
          >
            {t.switchLang}
          </Link>
          <Link
            href={`${base}/contact`}
            className="hidden rounded-full bg-gradient-to-r from-gold-300 to-gold-500 px-5 py-2 text-sm font-semibold text-navy-950 transition-transform hover:-translate-y-0.5 sm:inline-block"
          >
            {t.cta}
          </Link>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-white xl:hidden"
          >
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <ul className="border-t border-white/10 px-4 pb-6 pt-2 xl:hidden">
          {links.map((l) => {
            const active = isActive(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 py-3 text-base ${
                    active ? "font-semibold text-gold-300" : "text-white/85 hover:text-gold-400"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-gold-400" : "bg-white/20"}`} />
                  {l.label}
                </Link>
              </li>
            );
          })}
          <li className="pt-3">
            <Link
              href={`${base}/contact`}
              onClick={() => setOpen(false)}
              className="block rounded-full bg-gold-400 px-5 py-3 text-center font-semibold text-navy-950"
            >
              {t.cta}
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
