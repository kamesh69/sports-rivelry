import type { Metadata } from "next";
import "@/app/globals.css";
import { getHomePageData } from "@/lib/cms";
import { buildMetadata, buildOrganizationJsonLd, buildWebsiteJsonLd } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site-config";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = buildMetadata({
  title: `${SITE_NAME} | Editorial-first sports coverage`,
  description: SITE_DESCRIPTION,
  canonicalPath: "/",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const homeData = await getHomePageData();

  return (
    <html lang="en">
      <body>
        <JsonLd data={buildOrganizationJsonLd()} />
        <JsonLd data={buildWebsiteJsonLd()} />
        <SiteHeader breakingNews={homeData.breakingNews} />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
