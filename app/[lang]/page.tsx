import {
  AboutSection,
  ClosingSection,
  CtaSection,
  HeroSection,
  ProjectsSection,
  ServicesSection,
  WhySection,
} from "@/components/Sections";
import BrandMarquee from "@/components/BrandMarquee";
import { resolve, type PageParams } from "@/lib/page";

export default async function Home(props: PageParams) {
  const { t, lang } = await resolve(props);
  return (
    <main id="top">
      <HeroSection t={t} lang={lang} />
      <BrandMarquee />
      <AboutSection t={t} lang={lang} teaser />
      <WhySection t={t} lang={lang} />
      <ServicesSection t={t} lang={lang} limit={3} />
      <ProjectsSection t={t} lang={lang} />
      <ClosingSection t={t} lang={lang} />
      <CtaSection t={t} lang={lang} />
    </main>
  );
}
