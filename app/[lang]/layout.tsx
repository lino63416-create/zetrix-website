import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { contact, dictionaries, isLocale, locales } from "@/lib/content";
import "@fontsource/alexandria/500.css";
import "@fontsource/alexandria/600.css";
import "@fontsource/alexandria/700.css";
import "@fontsource/alexandria/800.css";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/ibm-plex-sans-arabic/700.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "@fontsource/outfit/800.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BrandMarquee from "@/components/BrandMarquee";
import ScrollTop from "@/components/ScrollTop";
import Reveal from "@/components/Reveal";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Analytics } from "@vercel/analytics/next";


export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = dictionaries[lang];
  return {
    metadataBase: new URL("https://zetrix-website.vercel.app"),
    title: t.meta.title,
    description: t.meta.description,
    alternates: { languages: { en: "/en", ar: "/ar" } },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      images: ["/images/facility-front.jpg"],
      locale: lang === "ar" ? "ar_SA" : "en_US",
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const isAr = lang === "ar";
  const t = dictionaries[lang];

  return (
    <html
      lang={lang}
      dir={isAr ? "rtl" : "ltr"}
      style={
        {
          "--font-body": isAr
            ? "'IBM Plex Sans Arabic', 'Manrope', system-ui, sans-serif"
            : "'Manrope', system-ui, sans-serif",
          "--font-display": isAr
            ? "'Alexandria', 'Outfit', system-ui, sans-serif"
            : "'Outfit', system-ui, sans-serif",
        } as React.CSSProperties
      }
    >
      <body className="font-sans antialiased">
        <Header t={t.nav} homeLabel={t.pages.home} lang={lang} />
        <ScrollTop label={t.nav.toTop} />
        <Reveal />
        {children}
        <BrandMarquee lang={lang} variant="navy" />
        <Footer t={t} lang={lang} />
        <WhatsAppButton label={t.contactSection.whatsapp} text={t.contactSection.form.waIntro} />
        <Analytics />
        <script
          type="application/ld+json"
          // structured data so search engines show the factory as a business
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: isAr ? "زيتريكس للصناعات المعدنية" : "ZETRIX Metal Industries",
              alternateName: isAr ? "ZETRIX Metal Industries" : "زيتريكس للصناعات المعدنية",
              url: `https://zetrix-website.vercel.app/${lang}`,
              logo: "https://zetrix-website.vercel.app/images/logo.jpg",
              image: "https://zetrix-website.vercel.app/images/facility-front.jpg",
              email: contact.email,
              telephone: contact.phone.replace(/\s/g, ""),
              address: {
                "@type": "PostalAddress",
                addressLocality: isAr ? "المدينة المنورة" : "Madinah",
                addressCountry: "SA",
              },
              location: {
                "@type": "Place",
                geo: { "@type": "GeoCoordinates", latitude: 24.274478, longitude: 39.549014 },
              },
              description: t.meta.description,
            }),
          }}
        />
      </body>
    </html>
  );
}
