import Image from "next/image";
import Link from "next/link";
import { contact, type Dictionary, type Locale } from "@/lib/content";
import { MailIcon, PhoneIcon, PinIcon } from "./Icons";

export default function Footer({ t, lang }: { t: Dictionary; lang: Locale }) {
  const base = `/${lang}`;
  const links = [
    { href: base, label: t.pages.home },
    { href: `${base}/about`, label: t.nav.about },
    { href: `${base}/facility`, label: t.nav.facility },
    { href: `${base}/services`, label: t.nav.services },
    { href: `${base}/products`, label: t.nav.products },
    { href: `${base}/policies`, label: t.nav.policies },
    { href: `${base}/projects`, label: t.nav.projects },
    { href: `${base}/contact`, label: t.nav.contact },
  ];
  return (
    <footer className="relative overflow-hidden bg-navy-950 pt-16 text-white/70">
      <div className="grid-lines absolute inset-0" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/images/logo-emblem.png" alt="" width={70} height={55} className="h-14 w-auto" />
            <span className="text-gold-gradient font-display text-2xl font-extrabold tracking-[0.18em]">ZETRIX</span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed">{t.footer.about}</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{t.footer.links}</h3>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-gold-400">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{t.footer.contact}</h3>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <PhoneIcon className="h-5 w-5 shrink-0 text-gold-400" />
              <a href={contact.phoneHref} dir="ltr" className="hover:text-gold-400">
                {contact.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MailIcon className="h-5 w-5 shrink-0 text-gold-400" />
              <a href={`mailto:${contact.email}`} className="hover:text-gold-400">
                {contact.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <PinIcon className="h-5 w-5 shrink-0 text-gold-400" />
              {t.contactSection.addressValue}
            </li>
          </ul>
        </div>
      </div>
      <div className="relative mt-14 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-white/50 sm:flex-row sm:px-6 lg:px-8">
          <span>
            © {new Date().getFullYear()} ZETRIX. {t.footer.rights}
          </span>
          <span className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            {contact.crNumber && (
              <span>
                {t.footer.cr}: <span dir="ltr">{contact.crNumber}</span>
              </span>
            )}
            {contact.vatNumber && (
              <span>
                {t.footer.vat}: <span dir="ltr">{contact.vatNumber}</span>
              </span>
            )}
            <Link href={`${base}/privacy`} className="transition-colors hover:text-gold-400">
              {t.footer.privacy}
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
