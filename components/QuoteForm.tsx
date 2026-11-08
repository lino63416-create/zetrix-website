"use client";

import { useEffect, useRef, useState } from "react";
import { contact, type Dictionary } from "@/lib/content";
import { CheckIcon, WhatsAppIcon } from "./Icons";

type Form = Dictionary["contactSection"]["form"];
type Status = "idle" | "sending" | "sent" | "error" | "invalid";

/**
 * Quote request form. Requests are emailed to the company address through FormSubmit
 * (no server or API key needed). The same details can also be sent as a WhatsApp message.
 * With an attached drawing the form posts natively (multipart) and FormSubmit redirects back
 * to this page with ?sent=1. Note: the very first submission makes FormSubmit send an activation email to the
 * company inbox; requests are delivered after that link is clicked once.
 */
export default function QuoteForm({ f, services }: { f: Form; services: string[] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [v, setV] = useState({ name: "", company: "", phone: "", email: "", service: "", message: "" });
  const [file, setFile] = useState<File | null>(null);
  const [tooLarge, setTooLarge] = useState(false);
  const [next, setNext] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const MAX = 5 * 1024 * 1024;

  // returning from a submission that carried an attachment
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("sent") === "1") {
      setStatus("sent");
      url.searchParams.delete("sent");
      window.history.replaceState(null, "", url.pathname + url.hash);
    }
    setNext(`${url.origin}${url.pathname}?sent=1#contact`);
  }, []);

  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setV((old) => ({ ...old, [k]: e.target.value }));

  const valid = v.name.trim() && v.phone.trim() && v.message.trim();

  const summary = [
    f.waIntro,
    `${f.name}: ${v.name}`,
    v.company && `${f.company.replace(/\s*\(.*\)/, "")}: ${v.company}`,
    `${f.phone}: ${v.phone}`,
    v.email && `${f.email}: ${v.email}`,
    v.service && `${f.service}: ${v.service}`,
    `${f.message}: ${v.message}`,
  ]
    .filter(Boolean)
    .join("\n");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const honey = (e.currentTarget.elements.namedItem("_honey") as HTMLInputElement | null)?.value;
    if (honey) return; // bot
    if (!valid) {
      setStatus("invalid");
      return;
    }
    if (file) {
      if (file.size > MAX) return setTooLarge(true);
      setStatus("sending");
      e.currentTarget.submit(); // native multipart post so the drawing is attached to the email
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${contact.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `طلب عرض سعر جديد / New quote request — ${v.name}`,
          _template: "table",
          _replyto: v.email || undefined,
          [f.name]: v.name,
          [f.company]: v.company || "-",
          [f.phone]: v.phone,
          [f.email]: v.email || "-",
          [f.service]: v.service || "-",
          [f.message]: v.message,
          page: window.location.href,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: string | boolean };
      if (res.ok && String(data.success) === "true") {
        setStatus("sent");
        setV({ name: "", company: "", phone: "", email: "", service: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const openWhatsApp = () => {
    if (!valid) {
      setStatus("invalid");
      return;
    }
    window.open(`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(summary)}`, "_blank", "noopener");
  };

  const input =
    "w-full rounded-xl border border-steel-100 bg-steel-50 px-4 py-3 text-navy-900 placeholder:text-steel-400 outline-none transition focus:border-gold-400 focus:bg-white focus:ring-4 focus:ring-gold-400/15";
  const label = "mb-1.5 block text-sm font-semibold text-navy-900";

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-steel-100 bg-white p-10 text-center shadow-sm">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-gold-400 text-navy-950">
          <CheckIcon className="h-8 w-8" />
        </span>
        <p className="mt-6 text-lg font-bold text-navy-900">{f.success}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      action={`https://formsubmit.co/${contact.email}`}
      method="POST"
      encType="multipart/form-data"
      noValidate
      className="rounded-3xl border border-steel-100 bg-white p-6 shadow-[0_30px_60px_-30px_rgba(21,42,80,0.35)] sm:p-9"
    >
      <h3 className="text-2xl font-extrabold text-navy-900">{f.title}</h3>
      <p className="mt-2 text-steel-600">{f.text}</p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="q-name" className={label}>
            {f.name} <span className="text-gold-500">*</span>
          </label>
          <input id="q-name" name={f.name} className={input} value={v.name} onChange={set("name")} autoComplete="name" required />
        </div>
        <div>
          <label htmlFor="q-company" className={label}>
            {f.company}
          </label>
          <input id="q-company" name={f.company} className={input} value={v.company} onChange={set("company")} autoComplete="organization" />
        </div>
        <div>
          <label htmlFor="q-phone" className={label}>
            {f.phone} <span className="text-gold-500">*</span>
          </label>
          <input
            id="q-phone"
            name={f.phone}
            type="tel"
            dir="ltr"
            inputMode="tel"
            placeholder="05xxxxxxxx"
            className={`${input} text-start rtl:text-end`}
            value={v.phone}
            onChange={set("phone")}
            autoComplete="tel"
            required
          />
        </div>
        <div>
          <label htmlFor="q-email" className={label}>
            {f.email}
          </label>
          <input
            id="q-email"
            name="email"
            type="email"
            dir="ltr"
            className={`${input} text-start rtl:text-end`}
            value={v.email}
            onChange={set("email")}
            autoComplete="email"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="q-service" className={label}>
            {f.service}
          </label>
          <select id="q-service" name={f.service} className={input} value={v.service} onChange={set("service")}>
            <option value="">{f.servicePlaceholder}</option>
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
            <option value={f.other}>{f.other}</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="q-message" className={label}>
            {f.message} <span className="text-gold-500">*</span>
          </label>
          <textarea
            id="q-message"
            name={f.message}
            rows={5}
            className={`${input} resize-y`}
            placeholder={f.messagePlaceholder}
            value={v.message}
            onChange={set("message")}
            required
          />
        </div>
      </div>

      <div className="mt-5">
        <span className={label}>{f.attach}</span>
        <label
          htmlFor="q-file"
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-steel-400/50 bg-steel-50 px-4 py-3 transition hover:border-gold-400"
        >
          <span className="shrink-0 rounded-full bg-navy-900 px-4 py-1.5 text-sm font-semibold text-gold-300">{f.chooseFile}</span>
          <span className="truncate text-sm text-steel-600" dir="auto">
            {file ? `${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)` : f.noFile}
          </span>
          {file && (
            <button
              type="button"
              aria-label="×"
              onClick={(ev) => {
                ev.preventDefault();
                setFile(null);
                setTooLarge(false);
                if (fileRef.current) fileRef.current.value = "";
              }}
              className="ms-auto text-lg leading-none text-steel-400 hover:text-red-600"
            >
              ×
            </button>
          )}
        </label>
        <input
          ref={fileRef}
          id="q-file"
          name="attachment"
          type="file"
          accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png,.zip,.rar,.xlsx,.xls,.docx"
          className="sr-only"
          onChange={(e) => {
            const fl = e.target.files?.[0] ?? null;
            setFile(fl);
            setTooLarge(!!fl && fl.size > MAX);
          }}
        />
        <p className={`mt-1.5 text-xs ${tooLarge ? "font-semibold text-red-600" : "text-steel-400"}`}>
          {tooLarge ? f.tooLarge : f.attachHint}
        </p>
      </div>

      {/* FormSubmit settings for the native (attachment) post */}
      <input type="hidden" name="_subject" value={`طلب عرض سعر جديد / New quote request — ${v.name}`} />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_next" value={next} />

      {/* honeypot: hidden from people, bots fill it */}
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      {(status === "invalid" || status === "error") && (
        <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {status === "invalid" ? f.required : f.error}
        </p>
      )}

      <div className="mt-7 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-300 to-gold-500 px-7 py-3.5 font-semibold text-navy-950 shadow-[0_10px_30px_-8px_rgba(226,185,86,0.7)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {status === "sending" ? f.sending : f.submit}
        </button>
        <button
          type="button"
          onClick={openWhatsApp}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          <WhatsAppIcon className="h-5 w-5" />
          {f.viaWhatsapp}
        </button>
      </div>
    </form>
  );
}
