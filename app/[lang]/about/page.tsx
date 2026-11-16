import { CertificatesSection } from "@/components/Certificates";
import PageHero from "@/components/PageHero";
import { AboutSection, GmMessageSection, ValuesSection, TeamSection, RoadmapSection, PeopleSection } from "@/components/Sections";
import { pageMetadata, resolve, type PageParams } from "@/lib/page";

export const generateMetadata = pageMetadata("about");

export default async function AboutPage(props: PageParams) {
  const { t, lang } = await resolve(props);
  return (
    <main>
      <PageHero
        title={t.pages.about.title}
        text={t.pages.about.text}
        image="/images/steel-2.jpg"
        homeHref={`/${lang}`}
        homeLabel={t.pages.home}
      />
      <AboutSection t={t} lang={lang} />
      <GmMessageSection t={t} lang={lang} />
      <CertificatesSection c={t.certs} />
      <ValuesSection t={t} lang={lang} />
      <TeamSection t={t} lang={lang} />
      <RoadmapSection t={t} lang={lang} />
      <PeopleSection t={t} lang={lang} />
    </main>
  );
}
