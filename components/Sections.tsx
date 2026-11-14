import Image from "next/image";
import Link from "next/link";
import PolicyTabs from "@/components/PolicyTabs";
import FacilityGallery from "@/components/FacilityGallery";
import QuoteForm from "@/components/QuoteForm";
import VideoTour from "@/components/VideoTour";
import {
  ArrowIcon,
  BadgeIcon,
  CheckIcon,
  ClockIcon,
  GearIcon,
  GlobeIcon,
  HandshakeIcon,
  HeadsetIcon,
  HeartIcon,
  HomeIcon,
  LeafIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  QuoteIcon,
  RecycleIcon,
  ShieldIcon,
  SparkIcon,
  StarIcon,
  TargetIcon,
  TruckIcon,
  UsersIcon,
  WhatsAppIcon,
  WrenchIcon,
} from "@/components/Icons";
import { contact, type Dictionary, type Locale } from "@/lib/content";

const valueIcons = [ShieldIcon, StarIcon, HandshakeIcon, TargetIcon, SparkIcon];
const whyIcons = [GearIcon, UsersIcon, ClockIcon, BadgeIcon];
const supportIcons = [TruckIcon, WrenchIcon, ShieldIcon, HeadsetIcon];
const heroSlides = ["/images/weld-2.jpg", "/images/laser-2.jpg", "/images/steel-1.jpg"];
// fixed values (not random) so server and browser render the same markup
const sparks = Array.from({ length: 26 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  size: 2 + (i % 3),
  dur: 7 + ((i * 7) % 9),
  delay: -((i * 1.7) % 14),
}));
const promiseIcons = [CheckIcon, ClockIcon, HandshakeIcon];
const sustainIcons = [RecycleIcon, LeafIcon, HomeIcon, HeartIcon];

export function Heading({
  eyebrow,
  title,
  dark = false,
  center = false,
}: {
  eyebrow: string;
  title: string;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p
        className={`inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-gold-500 ${
          center ? "justify-center" : ""
        }`}
      >
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold-400 rtl:bg-gradient-to-l" />
        {eyebrow}
        {center && <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold-400 rtl:bg-gradient-to-r" />}
      </p>
      <h2
        className={`mt-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-[2.75rem] ${
          dark ? "text-white" : "text-navy-900"
        }`}
      >
        {title}
      </h2>
      <span className={`mt-6 block h-1 w-20 rounded-full bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500 ${center ? "mx-auto" : ""}`} />
    </div>
  );
}

type P = { t: Dictionary; lang?: Locale };

export function HeroSection({ t, lang }: P) {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-navy-950">
      {/* Animated background: slow cross-fading slideshow with a gentle zoom */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {heroSlides.map((src, i) => (
          <div key={src} className="hero-slide absolute inset-0" style={{ animationDelay: `${i * 6 - 1.1}s` }}>
            <Image src={src} alt="" fill priority={i === 0} sizes="100vw" className="object-cover" />
          </div>
        ))}
      </div>
      <div className="hero-overlay absolute inset-0 -z-10" />
      <div className="grid-lines absolute inset-0 -z-10" />
      <div className="hero-glow absolute -z-10" />
      {/* Rising welding sparks */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        {sparks.map((sp, i) => (
          <span
            key={i}
            className="spark"
            style={{
              left: `${sp.left}%`,
              width: sp.size,
              height: sp.size,
              animationDuration: `${sp.dur}s`,
              animationDelay: `${sp.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pb-20 pt-32 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:px-8">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-sm font-semibold text-gold-300">
            <span className="h-2 w-2 rounded-full bg-gold-400" />
            {t.hero.eyebrow}
          </p>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.15] text-white sm:text-6xl lg:text-7xl">
            <span className="text-gold-gradient">{t.hero.title}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">{t.hero.text}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href={`/${lang}/services`}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-300 to-gold-500 px-7 py-3.5 font-semibold text-navy-950 shadow-[0_10px_30px_-8px_rgba(226,185,86,0.7)] transition-transform hover:-translate-y-0.5"
            >
              {t.hero.primary}
              <ArrowIcon className="h-5 w-5 rtl:rotate-180" />
            </Link>
            <Link
              href={`/${lang}/contact`}
              className="rounded-full border border-white/30 px-7 py-3.5 font-semibold text-white transition-colors hover:border-gold-400 hover:text-gold-400"
            >
              {t.hero.secondary}
            </Link>
          </div>
          <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-3">
            {t.hero.tags.map((tag) => (
              <li key={tag} className="flex items-center gap-2 text-sm text-white/70">
                <CheckIcon className="h-4 w-4 text-gold-400" />
                {tag}
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden justify-center lg:flex">
          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-gold-400/20 blur-3xl" />
            <Image
              src="/images/zetrix-logo.png"
              alt="ZETRIX Metal Industries logo"
              width={420}
              height={460}
              className="relative drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutSection({ t, lang, teaser = false }: P & { teaser?: boolean }) {
  return (
    <section id="about" className="bg-white py-24">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <Heading eyebrow={t.about.eyebrow} title={t.about.title} />
          <p className="mt-8 text-lg leading-relaxed text-steel-600">{t.about.text}</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {[t.about.vision, t.about.mission].map((b, i) => (
              <div key={b.title} className="rounded-2xl border border-steel-100 bg-white p-6 shadow-sm card-lift">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-900 text-gold-400">
                    {i === 0 ? <TargetIcon className="h-5 w-5" /> : <SparkIcon className="h-5 w-5" />}
                  </span>
                  <h3 className="text-lg font-bold">{b.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-steel-600">{b.text}</p>
              </div>
            ))}
          </div>
          {teaser && (
            <Link
            href={`/${lang}/about`}
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-navy-900/15 bg-navy-900 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-navy-700"
          >
            {t.pages.learnMore}
            <ArrowIcon className="h-5 w-5 rtl:rotate-180" />
          </Link>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 self-center">
          <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-2xl">
            <Image src="/images/steel-1.jpg" alt="" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src="/images/laser-1.jpg" alt="" fill sizes="(min-width:1024px) 20vw, 50vw" className="object-cover" />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src="/images/alu-2.jpg" alt="" fill sizes="(min-width:1024px) 20vw, 50vw" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function FacilitySection({ t }: P) {
  return (
    <section id="facility" className="dot-bg py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Heading eyebrow={t.facility.eyebrow} title={t.facility.title} />
          <p className="max-w-xl text-lg leading-relaxed text-steel-600">{t.facility.text}</p>
        </div>
        <div className="mt-12">
          <FacilityGallery
            items={t.facility.items}
            labels={{ close: t.facility.close, prev: t.facility.prev, next: t.facility.next }}
          />
        </div>
      </div>
    </section>
  );
}

export function GmMessageSection({ t }: P) {
  return (
    <section id="gm-message" className="relative overflow-hidden navy-bg py-24">
      <div className="grid-lines absolute inset-0" />
      <div className="absolute -top-32 end-0 h-96 w-96 rounded-full bg-gold-400/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-start gap-14 px-4 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
        <div className="flex flex-col items-center text-center lg:sticky lg:top-28">
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-gold-400/25 blur-2xl" />
            <div className="relative h-56 w-56 overflow-hidden rounded-full bg-white ring-4 ring-gold-400 ring-offset-4 ring-offset-navy-950 sm:h-64 sm:w-64">
              <Image
                src="/images/gm-ahmed-alghamdi.png"
                alt={t.gm.name}
                fill
                sizes="256px"
                className="object-cover"
              />
            </div>
          </div>
          <p className="text-gold-gradient mt-8 text-2xl font-extrabold">{t.gm.name}</p>
          <p className="mt-1 text-sm font-semibold uppercase tracking-[0.15em] text-white/60">{t.gm.role}</p>
        </div>

        <div>
          <Heading eyebrow={t.gm.eyebrow} title={t.gm.title} dark />
          <div className="relative mt-10 rounded-3xl border border-gold-400/30 glass-card p-7 sm:p-10">
            <QuoteIcon className="absolute -top-5 start-7 h-10 w-10 text-gold-400 rtl:-scale-x-100" />
            <div className="space-y-5 text-base leading-loose text-white/80 sm:text-lg">
              {t.gm.paragraphs.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
          </div>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {t.gm.promises.map((item, i) => {
              const Icon = promiseIcons[i];
              return (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-xl glass-card card-lift px-4 py-4 font-semibold text-white"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-400 text-navy-950">
                    <Icon className="h-5 w-5" />
                  </span>
                  {item}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function ValuesSection({ t }: P) {
  return (
    <section className="dot-bg py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Heading eyebrow={t.values.eyebrow} title={t.values.title} center />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {t.values.items.map((v, i) => {
            const Icon = valueIcons[i];
            return (
              <div
                key={v.title}
                className="group rounded-2xl border border-steel-100 bg-white p-6 shadow-sm card-lift"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy-900 text-gold-400 transition-colors group-hover:bg-gold-400 group-hover:text-navy-950">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-steel-600">{v.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function WhySection({ t }: P) {
  return (
    <section className="relative overflow-hidden navy-bg py-24">
      <div className="grid-lines absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Heading eyebrow={t.why.eyebrow} title={t.why.title} dark />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.why.items.map((w, i) => {
            const Icon = whyIcons[i];
            return (
              <div key={w.title} className="rounded-2xl glass-card card-lift p-7">
                <div className="flex items-center justify-between">
                  <Icon className="h-9 w-9 text-gold-400" />
                  <span className="text-4xl font-extrabold text-white/10">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">{w.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{w.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ServicesSection({ t, lang, limit }: P & { limit?: number }) {
  return (
    <section id="services" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Heading eyebrow={t.services.eyebrow} title={t.services.title} />
        <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {(limit ? t.services.items.slice(0, limit) : t.services.items).map((s) => (
            <article
              key={s.id}
              id={s.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-steel-100 bg-white shadow-sm card-lift"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/10 to-transparent" />
                <h3 className="absolute bottom-4 start-5 end-5 text-xl font-bold text-white">{s.title}</h3>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="font-semibold text-navy-800">{s.short}</p>
                <p className="mt-3 text-sm leading-relaxed text-steel-600">{s.text}</p>
              </div>
            </article>
          ))}
        </div>
        {limit && (
          <div className="mt-12 text-center">
            <Link
            href={`/${lang}/services`}
            className="inline-flex items-center gap-2 rounded-full border border-navy-900/15 bg-navy-900 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-navy-700"
          >
            {t.pages.viewAllServices}
            <ArrowIcon className="h-5 w-5 rtl:rotate-180" />
          </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export function ProcessSection({ t }: P) {
  return (
    <section id="process" className="dot-bg py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Heading eyebrow={t.process.eyebrow} title={t.process.title} center />
        <ol className="relative mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
          <span className="absolute inset-x-[8%] top-8 hidden h-0.5 bg-gradient-to-r from-gold-400/20 via-gold-400 to-gold-400/20 lg:block" />
          {t.process.steps.map((step, i) => (
            <li key={step} className="relative flex flex-col items-center text-center">
              <span className="relative grid h-16 w-16 place-items-center rounded-full border-4 border-steel-50 bg-navy-900 text-xl font-extrabold text-gold-400 shadow-lg">
                0{i + 1}
              </span>
              <p className="mt-4 font-bold text-navy-900">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function CapabilitiesSection({ t }: P) {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <Heading eyebrow={t.capabilities.eyebrow} title={t.capabilities.title} />
          <p className="mt-8 text-lg text-steel-600">{t.capabilities.text}</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {t.capabilities.items.map((c) => (
              <li key={c} className="flex items-center gap-3 rounded-xl border border-steel-100 bg-steel-50 px-4 py-3.5 font-medium">
                <GearIcon className="h-5 w-5 shrink-0 text-gold-500" />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-navy-900 p-8 text-white sm:p-10">
          <div className="relative -mx-8 -mt-8 mb-8 aspect-[16/8] overflow-hidden rounded-t-2xl sm:-mx-10 sm:-mt-10">
            <Image src="/images/laser-3.jpg" alt="" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
          </div>
          <h3 className="text-2xl font-bold text-gold-gradient">{t.capabilities.materialsTitle}</h3>
          <ul className="mt-6 space-y-4">
            {t.capabilities.materials.map((m) => (
              <li key={m} className="flex gap-3 text-white/80">
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function PoliciesSection({ t }: P) {
  return (
    <section id="policies" className="relative overflow-hidden navy-bg py-24">
      <div className="grid-lines absolute inset-0" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Heading eyebrow={t.policies.eyebrow} title={t.policies.title} dark />
        <div className="mt-12">
          <PolicyTabs tabs={t.policies.tabs} />
        </div>
      </div>
    </section>
  );
}

export function TeamSection({ t }: P) {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Heading eyebrow={t.team.eyebrow} title={t.team.title} />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.team.groups.map((g) => (
            <div key={g.title} className="rounded-2xl border border-steel-100 border-t-4 border-t-gold-400 bg-white p-6 shadow-sm card-lift">
              <UsersIcon className="h-8 w-8 text-navy-700" />
              <h3 className="mt-4 text-lg font-bold">{g.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-steel-600">{g.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 rounded-2xl border border-steel-100 p-8">
          <p className="text-center text-sm font-bold uppercase tracking-[0.15em] text-steel-400">
            {t.team.departmentsTitle}
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-3">
            {t.team.departments.map((d) => (
              <li key={d} className="rounded-full bg-navy-900 px-5 py-2 text-sm font-semibold text-white">
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function ProjectsSection({ t }: P) {
  return (
    <section id="projects" className="dot-bg py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Heading eyebrow={t.projects.eyebrow} title={t.projects.title} />
        <div className="mt-14 grid gap-7 md:grid-cols-3">
          {t.projects.items.map((p) => (
            <figure key={p.title} className="group relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="(min-width:768px) 33vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="text-xl font-bold text-white">{p.title}</h3>
                <p className="mt-2 text-sm text-white/75">{p.text}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PartnershipSection({ t }: P) {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        <div>
          <Heading eyebrow={t.partnership.eyebrow} title={t.partnership.title} />
          <p className="mt-8 text-lg leading-relaxed text-steel-600">{t.partnership.text}</p>
          <ul className="mt-8 space-y-4">
            {t.partnership.points.map((p) => (
              <li key={p} className="flex gap-3 font-medium">
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="self-center rounded-2xl bg-navy-900 p-8 sm:p-10">
          <h3 className="text-2xl font-bold text-white">{t.partnership.clientsTitle}</h3>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {t.partnership.clients.map((c) => (
              <li key={c} className="rounded-xl border border-gold-400/30 bg-white/[0.04] px-4 py-5 text-center font-semibold text-gold-300">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function RoadmapSection({ t }: P) {
  return (
    <section className="dot-bg py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Heading eyebrow={t.roadmap.eyebrow} title={t.roadmap.title} center />
        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.roadmap.steps.map((s, i) => (
            <li key={s.title} className="relative overflow-hidden rounded-2xl border border-steel-100 bg-white p-7 shadow-sm card-lift">
              <span className="text-sm font-bold text-gold-500">0{i + 1}</span>
              <h3 className="mt-2 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-steel-600">{s.text}</p>
              <span className="absolute inset-x-7 bottom-0 h-1 rounded-t bg-gradient-to-r from-navy-700 to-gold-400" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function SupportSection({ t }: P) {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Heading eyebrow={t.support.eyebrow} title={t.support.title} />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.support.items.map((s, i) => {
            const Icon = supportIcons[i];
            return (
              <div key={s.title} className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold-400/15 text-gold-500">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-steel-600">{s.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function PeopleSection({ t }: P) {
  return (
    <section className="relative overflow-hidden navy-bg py-24">
      <div className="grid-lines absolute inset-0" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <Heading eyebrow={t.people.eyebrow} title={t.people.title} dark />
          <ul className="mt-10 space-y-5">
            {t.people.training.map((item) => (
              <li key={item} className="flex gap-3 text-white/80">
                <BadgeIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {t.people.sustainability.map((s, i) => {
            const Icon = sustainIcons[i];
            return (
              <div key={s.title} className="rounded-2xl glass-card card-lift p-6">
                <Icon className="h-8 w-8 text-gold-400" />
                <h3 className="mt-4 font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{s.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ClosingSection({ t }: P) {
  return (
    <section className="relative isolate overflow-hidden py-28">
      <Image src="/images/laser-2.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-navy-950/85" />
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p className="text-xl leading-relaxed text-white/85 sm:text-2xl">{t.closing.text}</p>
        <p className="text-gold-gradient mt-8 text-3xl font-extrabold sm:text-4xl">
          ZETRIX. {t.closing.tagline}
        </p>
      </div>
    </section>
  );
}

export function ContactSection({ t, lang = "ar" }: P) {
  const items = [
    { icon: PhoneIcon, label: t.contactSection.phone, value: contact.phone, href: contact.phoneHref, ltr: true },
    { icon: MailIcon, label: t.contactSection.email, value: contact.email, href: `mailto:${contact.email}`, ltr: true },
    { icon: PinIcon, label: t.contactSection.address, value: t.contactSection.addressValue },
    { icon: GlobeIcon, label: t.contactSection.website, value: contact.website, href: `https://${contact.website}`, ltr: true, wide: true },
  ];
  return (
    <section id="contact" className="dot-bg py-24">
      <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:px-8">
        <div>
          <Heading eyebrow={t.contactSection.eyebrow} title={t.contactSection.title} />
          <p className="mt-8 text-lg text-steel-600">{t.contactSection.text}</p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {items.map(({ icon: Icon, label, value, href, ltr, wide }) => (
              <li key={label} className={`flex items-start gap-4 rounded-2xl ${wide ? "sm:col-span-2" : ""} border border-steel-100 bg-white p-5 shadow-sm card-lift`}>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-900 text-gold-400">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-steel-400">{label}</p>
                  {href ? (
                    <a href={href} dir={ltr ? "ltr" : undefined} className="mt-0.5 block break-words font-bold text-navy-900 hover:text-gold-500">
                      {value}
                    </a>
                  ) : (
                    <p className="mt-0.5 font-bold text-navy-900">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <a
            href={`https://wa.me/${contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            <WhatsAppIcon className="h-5 w-5" />
            {t.contactSection.whatsapp}
          </a>
        </div>
        <QuoteForm f={t.contactSection.form} services={t.services.items.map((x) => x.title)} />
      </div>
      <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <h3 className="flex items-center gap-3 text-2xl font-extrabold text-navy-900">
            <PinIcon className="h-6 w-6 text-gold-500" />
            {t.contactSection.mapTitle}
          </h3>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${contact.mapQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
          >
            {t.contactSection.directions}
            <ArrowIcon className="h-4 w-4 rtl:rotate-180" />
          </a>
        </div>
        <div className="overflow-hidden rounded-3xl border border-steel-100 bg-white shadow-sm">
          <iframe
            title={t.contactSection.mapTitle}
            src={`https://www.google.com/maps?q=${encodeURIComponent(contact.mapQuery)}&hl=${lang}&z=15&output=embed`}
            className="h-[380px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

export function CtaSection({ t, lang }: P) {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="navy-bg relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12">
          <div className="grid-lines absolute inset-0" />
          <div className="hero-glow absolute" />
          <div className="relative">
            <h2 className="text-gold-gradient text-3xl font-extrabold sm:text-4xl">{t.pages.ctaTitle}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">{t.pages.ctaText}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href={`/${lang}/contact`}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-300 to-gold-500 px-7 py-3.5 font-semibold text-navy-950 shadow-[0_10px_30px_-8px_rgba(226,185,86,0.7)] transition-transform hover:-translate-y-0.5"
              >
                {t.nav.cta}
                <ArrowIcon className="h-5 w-5 rtl:rotate-180" />
              </Link>
              <Link
                href={`/${lang}/facility`}
                className="rounded-full border border-white/30 px-7 py-3.5 font-semibold text-white transition-colors hover:border-gold-400 hover:text-gold-400"
              >
                {t.pages.seeFacility}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TourSection({ t }: P) {
  return (
    <section className="relative overflow-hidden navy-bg py-24">
      <div className="grid-lines absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Heading eyebrow={t.facility.tour.eyebrow} title={t.facility.tour.title} dark center />
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-white/75">{t.facility.tour.text}</p>
        <div className="mt-12">
          <VideoTour src="/videos/zetrix-tour.mp4" poster="/videos/zetrix-tour-poster.jpg" label={t.facility.tour.play} />
        </div>
      </div>
    </section>
  );
}
