import { getHomePageData } from "@/lib/cms";
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const homeData = await getHomePageData();

  return (
    <>
      <JsonLd data={buildOrganizationJsonLd()} />
      <JsonLd data={buildWebsiteJsonLd()} />
      <SiteHeader breakingNews={homeData.breakingNews} />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
