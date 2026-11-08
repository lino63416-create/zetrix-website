import OrderBuilder from "@/components/OrderBuilder";
import PageHero from "@/components/PageHero";
import { pageMetadata, resolve, type PageParams } from "@/lib/page";

export const generateMetadata = pageMetadata("products");

export default async function ProductsPage(props: PageParams) {
  const { t, lang } = await resolve(props);
  return (
    <main>
      <PageHero
        title={t.pages.products.title}
        text={t.pages.products.text}
        image="/images/laser-1.jpg"
        homeHref={`/${lang}`}
        homeLabel={t.pages.home}
      />
      <OrderBuilder s={t.shop} lang={lang} />
    </main>
  );
}
