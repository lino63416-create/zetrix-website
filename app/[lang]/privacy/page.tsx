import PageHero from "@/components/PageHero";
import { contact } from "@/lib/content";
import { pageMetadata, resolve, type PageParams } from "@/lib/page";
import { privacy } from "@/lib/privacy";

export const generateMetadata = pageMetadata("privacy");

export default async function PrivacyPage(props: PageParams) {
  const { t, lang } = await resolve(props);
  const doc = privacy[lang];
  return (
    <main>
      <PageHero
        title={t.pages.privacy.title}
        text={t.pages.privacy.text}
        image="/images/facility-office.jpg"
        homeHref={`/${lang}`}
        homeLabel={t.pages.home}
      />
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-gold-500">{doc.updated}</p>
          {doc.sections.map((sec) => (
            <div key={sec.h} className="mt-10">
              <h2 className="text-2xl font-extrabold text-navy-900">{sec.h}</h2>
              <div className="mt-4 space-y-4 text-lg leading-loose text-steel-600">
                {sec.p.map((para) => (
                  <p key={para.slice(0, 30)}>
                    {para.includes("EMAIL") ? (
                      <>
                        {para.split("EMAIL")[0]}
                        <a href={`mailto:${contact.email}`} className="font-semibold text-navy-900 underline decoration-gold-400">
                          {contact.email}
                        </a>
                        {para.split("EMAIL")[1]}
                      </>
                    ) : (
                      para
                    )}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
