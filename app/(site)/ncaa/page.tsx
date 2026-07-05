import type { Metadata } from "next";
import { buildBreadcrumbJsonLd, buildMetadata, type BreadcrumbItem } from "@/lib/seo";
import { SITE_DOMAIN } from "@/lib/site-config";
import { JsonLd } from "@/components/json-ld";
import { NCAALandingPage } from "@/components/ncaa/NCAALandingPage";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "NCAA | The Sports Rivalry",
    description:
      "Champions are built here. NCAA news, rankings, championship countdowns, conference coverage, and video highlights across every college sport.",
    canonicalPath: "/ncaa",
    keywords: ["NCAA", "college sports", "college football", "college basketball", "March Madness"],
  });
}

export default function NcaaPage() {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: "NCAA", href: "/ncaa" },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "NCAA",
          url: `${SITE_DOMAIN}/ncaa`,
        }}
      />
      <NCAALandingPage />
    </>
  );
}
