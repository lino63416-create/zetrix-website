"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { contact, type Dictionary, type Locale } from "@/lib/content";
import { categories, products, units, VAT_RATE, type CategoryId, type Product } from "@/lib/products";
import { CheckIcon, WhatsAppIcon } from "./Icons";

type Line = { id: string; qty: number; note: string };
type Status = "idle" | "sending" | "sent" | "error" | "invalid";

const STORAGE_KEY = "zetrix-order";
const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

export default function OrderBuilder({ s, lang }: { s: Dictionary["shop"]; lang: Locale }) {
  const [cat, setCat] = useState<CategoryId | "all">("all");
  const [lines, setLines] = useState<Line[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [who, setWho] = useState({ name: "", phone: "", email: "", city: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  // remember the order in this browser so it survives page changes
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as Line[];
      if (Array.isArray(saved)) setLines(saved.filter((l) => products.some((p) => p.id === l.id)));
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, loaded]);

  const byId = (id: string) => products.find((p) => p.id === id) as Product;
  const unit = (p: Product) => units[p.unit][lang];
  const name = (p: Product) => p.name[lang];

  const add = (p: Product) =>
    setLines((ls) =>
      ls.some((l) => l.id === p.id) ? ls : [...ls, { id: p.id, qty: p.minQty ?? 1, note: "" }],
    );
  const update = (id: string, patch: Partial<Line>) =>
    setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const remove = (id: string) => setLines((ls) => ls.filter((l) => l.id !== id));

  const totals = useMemo(() => {
    let subtotal = 0;
    let unpriced = 0;
    for (const l of lines) {
      const p = byId(l.id);
      if (p.price == null) unpriced++;
      else subtotal += p.price * l.qty;
    }
    const vat = subtotal * VAT_RATE;
    return { subtotal, vat, total: subtotal + vat, unpriced };
  }, [lines]);

  const shown = cat === "all" ? products : products.filter((p) => p.category === cat);
  const valid = lines.length > 0 && who.name.trim() && who.phone.trim();

  const lineText = (l: Line, i: number) => {
    const p = byId(l.id);
    const price =
      p.price == null
        ? s.priceOnRequest
        : `${fmt.format(p.price)} ${s.sar} × ${fmt.format(l.qty)} = ${fmt.format(p.price * l.qty)} ${s.sar}`;
    return `${i + 1}. ${name(p)} — ${fmt.format(l.qty)} ${unit(p)} — ${price}${l.note ? ` (${l.note})` : ""}`;
  };

  const summary = () =>
    [
      s.waIntro,
      "",
      ...lines.map(lineText),
      "",
      totals.subtotal > 0 ? `${s.total}: ${fmt.format(totals.total)} ${s.sar} (${s.vat})` : "",
      totals.unpriced > 0 ? s.quoteNote : "",
      "",
      `${s.name}: ${who.name}`,
      `${s.phone}: ${who.phone}`,
      who.email && `${s.email}: ${who.email}`,
      who.city && `${s.city}: ${who.city}`,
      who.message && `${s.message}: ${who.message}`,
    ]
      .filter((x): x is string => typeof x === "string")
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const honey = (e.currentTarget.elements.namedItem("_honey") as HTMLInputElement | null)?.value;
    if (honey) return;
    if (!valid) return setStatus("invalid");
    setStatus("sending");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${contact.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `طلب منتجات جديد / New product order — ${who.name}`,
          _template: "box",
          _replyto: who.email || undefined,
          [s.name]: who.name,
          [s.phone]: who.phone,
          [s.email]: who.email || "-",
          [s.city]: who.city || "-",
          [s.cartTitle]: lines.map(lineText).join("\n"),
          [s.total]: totals.subtotal > 0 ? `${fmt.format(totals.total)} ${s.sar}` : s.priceOnRequest,
          [s.message]: who.message || "-",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: string | boolean };
      if (res.ok && String(data.success) === "true") {
        setStatus("sent");
        setLines([]);
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const whatsapp = () => {
    if (!valid) return setStatus("invalid");
    window.open(`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(summary())}`, "_blank", "noopener");
  };

  const input =
    "w-full rounded-xl border border-steel-100 bg-steel-50 px-3.5 py-2.5 text-navy-900 placeholder:text-steel-400 outline-none transition focus:border-gold-400 focus:bg-white focus:ring-4 focus:ring-gold-400/15";
  const count = lines.length;

  return (
    <section className="dot-bg py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* category filter */}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {[{ id: "all" as const, ar: s.all, en: s.all }, ...categories].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCat(c.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                cat === c.id
                  ? "border-navy-900 bg-navy-900 text-gold-300"
                  : "border-steel-100 bg-white text-navy-900 hover:border-gold-400"
              }`}
            >
              {c[lang]}
            </button>
          ))}
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_400px]">
          {/* catalogue */}
          <ul className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
            {shown.map((p) => {
              const inCart = lines.some((l) => l.id === p.id);
              return (
                <li key={p.id} className="card-lift flex flex-col overflow-hidden rounded-2xl border border-steel-100 bg-white shadow-sm">
                  <div className="relative aspect-[4/3]">
                    <Image src={p.image} alt={name(p)} fill sizes="(min-width:1280px) 280px, (min-width:640px) 45vw, 90vw" className="object-cover" />
                    <span className="absolute start-3 top-3 rounded-full bg-navy-950/80 px-3 py-1 text-xs font-semibold text-gold-300 backdrop-blur">
                      {categories.find((c) => c.id === p.category)?.[lang]}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-bold text-navy-900">{name(p)}</h3>
                    <p className="mt-1.5 flex-1 text-sm leading-relaxed text-steel-600">{p.desc[lang]}</p>
                    <div className="mt-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        {p.price == null ? (
                          <p className="font-bold text-gold-500">{s.priceOnRequest}</p>
                        ) : (
                          <p className="text-xl font-extrabold text-navy-900">
                            {fmt.format(p.price)} <span className="text-sm font-semibold">{s.sar}</span>
                          </p>
                        )}
                        <p className="whitespace-nowrap text-xs text-steel-400">
                          {s.per} {unit(p)}
                          {p.minQty ? ` · ${s.minQty} ${fmt.format(p.minQty)}` : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => add(p)}
                        disabled={inCart}
                        className={`mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                          inCart
                            ? "bg-steel-100 text-navy-900"
                            : "bg-gradient-to-r from-gold-300 to-gold-500 text-navy-950 hover:-translate-y-0.5"
                        }`}
                      >
                        {inCart && <CheckIcon className="h-4 w-4" />}
                        {inCart ? s.added : s.add}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* order summary */}
          <aside id="order-summary" className="scroll-mt-28 lg:sticky lg:top-24">
            {status === "sent" ? (
              <div className="flex flex-col items-center rounded-3xl border border-steel-100 bg-white p-8 text-center shadow-sm">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-gold-400 text-navy-950">
                  <CheckIcon className="h-7 w-7" />
                </span>
                <p className="mt-5 font-bold text-navy-900">{s.success}</p>
              </div>
            ) : (
              <form
                onSubmit={send}
                noValidate
                className="rounded-3xl border border-steel-100 bg-white p-5 shadow-[0_30px_60px_-30px_rgba(21,42,80,0.35)] sm:p-6"
              >
                <h2 className="flex items-center justify-between text-xl font-extrabold text-navy-900">
                  {s.cartTitle}
                  <span className="rounded-full bg-navy-900 px-3 py-0.5 text-sm text-gold-300">{count}</span>
                </h2>

                {count === 0 ? (
                  <p className="mt-4 rounded-xl bg-steel-50 p-4 text-sm text-steel-600">{s.empty}</p>
                ) : (
                  <ul className="mt-4 max-h-[42vh] space-y-3 overflow-y-auto pe-1">
                    {lines.map((l) => {
                      const p = byId(l.id);
                      return (
                        <li key={l.id} className="rounded-2xl border border-steel-100 p-3">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-navy-900">{name(p)}</p>
                            <button type="button" onClick={() => remove(l.id)} className="text-xs font-semibold text-red-600 hover:underline">
                              {s.remove}
                            </button>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex items-center rounded-full border border-steel-100">
                              <button
                                type="button"
                                aria-label="-"
                                onClick={() => update(l.id, { qty: Math.max(p.minQty ?? 1, l.qty - 1) })}
                                className="grid h-8 w-8 place-items-center text-lg text-navy-900"
                              >
                                −
                              </button>
                              <input
                                type="number"
                                inputMode="decimal"
                                min={p.minQty ?? 1}
                                aria-label={s.qty}
                                value={l.qty}
                                onChange={(e) => update(l.id, { qty: Math.max(0, Number(e.target.value) || 0) })}
                                onBlur={() => l.qty < (p.minQty ?? 1) && update(l.id, { qty: p.minQty ?? 1 })}
                                className="w-16 bg-transparent text-center font-semibold text-navy-900 outline-none"
                              />
                              <button
                                type="button"
                                aria-label="+"
                                onClick={() => update(l.id, { qty: l.qty + 1 })}
                                className="grid h-8 w-8 place-items-center text-lg text-navy-900"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-sm text-steel-600">{unit(p)}</span>
                            <span className="ms-auto text-sm font-bold text-navy-900">
                              {p.price == null ? <span className="font-semibold text-gold-500">{s.priceOnRequest}</span> : `${fmt.format(p.price * l.qty)} ${s.sar}`}
                            </span>
                          </div>
                          <input
                            className={`${input} mt-2 py-2 text-sm`}
                            placeholder={s.notes}
                            value={l.note}
                            onChange={(e) => update(l.id, { note: e.target.value })}
                          />
                        </li>
                      );
                    })}
                  </ul>
                )}

                {count > 0 && (
                  <div className="mt-4 space-y-1.5 border-t border-steel-100 pt-4 text-sm">
                    {totals.subtotal > 0 && (
                      <>
                        <Row label={s.subtotal} value={`${fmt.format(totals.subtotal)} ${s.sar}`} />
                        <Row label={s.vat} value={`${fmt.format(totals.vat)} ${s.sar}`} />
                        <Row label={s.total} value={`${fmt.format(totals.total)} ${s.sar}`} strong />
                      </>
                    )}
                    {totals.unpriced > 0 && <p className="rounded-xl bg-gold-400/10 p-3 text-xs leading-relaxed text-navy-900">{s.quoteNote}</p>}
                    <p className="text-xs leading-relaxed text-steel-400">{s.estimateNote}</p>
                  </div>
                )}

                <h3 className="mt-6 font-bold text-navy-900">{s.details}</h3>
                <div className="mt-3 grid gap-3">
                  <input className={input} placeholder={`${s.name} *`} value={who.name} onChange={(e) => setWho({ ...who, name: e.target.value })} autoComplete="name" />
                  <input
                    className={`${input} text-start rtl:text-end`}
                    dir="ltr"
                    type="tel"
                    inputMode="tel"
                    placeholder={`${s.phone} *`}
                    value={who.phone}
                    onChange={(e) => setWho({ ...who, phone: e.target.value })}
                    autoComplete="tel"
                  />
                  <input
                    className={`${input} text-start rtl:text-end`}
                    dir="ltr"
                    type="email"
                    placeholder={s.email}
                    value={who.email}
                    onChange={(e) => setWho({ ...who, email: e.target.value })}
                    autoComplete="email"
                  />
                  <input className={input} placeholder={s.city} value={who.city} onChange={(e) => setWho({ ...who, city: e.target.value })} />
                  <textarea className={`${input} resize-y`} rows={2} placeholder={s.message} value={who.message} onChange={(e) => setWho({ ...who, message: e.target.value })} />
                </div>
                <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

                {(status === "invalid" || status === "error") && (
                  <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {status === "invalid" ? s.required : s.error}
                  </p>
                )}

                <div className="mt-5 grid gap-3">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="rounded-full bg-gradient-to-r from-gold-300 to-gold-500 px-6 py-3.5 font-semibold text-navy-950 shadow-[0_10px_30px_-8px_rgba(226,185,86,0.7)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    {status === "sending" ? s.sending : s.send}
                  </button>
                  <button
                    type="button"
                    onClick={whatsapp}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-semibold text-white transition-transform hover:-translate-y-0.5"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    {s.viaWhatsapp}
                  </button>
                </div>
              </form>
            )}
          </aside>
        </div>
      </div>

      {/* mobile shortcut to the order summary */}
      {count > 0 && status !== "sent" && (
        <a
          href="#order-summary"
          className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-white shadow-xl lg:hidden"
        >
          {s.viewCart} · {count} {s.items}
        </a>
      )}
    </section>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? "text-base font-extrabold text-navy-900" : "text-steel-600"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
