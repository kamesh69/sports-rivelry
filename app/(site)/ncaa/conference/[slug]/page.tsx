import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollegesByConference, getConferenceBySlug } from "@/services/ncaa.service";
import { getLatestNews } from "@/services/ncaa-news.service";
import { buildBreadcrumbJsonLd, buildMetadata, type BreadcrumbItem } from "@/lib/seo";
import { getNcaaConferencePath, NCAA_PATH } from "@/lib/navigation";
import { JsonLd } from "@/components/json-ld";
import { ConferenceDetail } from "@/components/ncaa/ConferenceDetail";

export const revalidate = 60;

interface NcaaConferencePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NcaaConferencePageProps): Promise<Metadata> {
  const { slug } = await params;
  const conference = await getConferenceBySlug(slug);

  if (!conference) {
    return buildMetadata({
      title: "Conference not found | The Sports Rivalry",
      description: "The requested NCAA conference could not be found.",
      canonicalPath: getNcaaConferencePath(slug),
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${conference.name} | NCAA | The Sports Rivalry`,
    description: `News and member schools for the ${conference.name}.`,
    canonicalPath: getNcaaConferencePath(conference.slug),
  });
}

export default async function NcaaConferencePage({ params }: NcaaConferencePageProps) {
  const { slug } = await params;
  const conference = await getConferenceBySlug(slug);

  if (!conference) {
    notFound();
  }

  const [colleges, latestNews] = await Promise.all([
    getCollegesByConference(conference.slug),
    getLatestNews(4),
  ]);

  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: "NCAA", href: NCAA_PATH },
    { name: "Conferences", href: `${NCAA_PATH}/conferences` },
    { name: conference.name, href: getNcaaConferencePath(conference.slug) },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <ConferenceDetail conference={conference} colleges={colleges} relatedNews={latestNews} />
    </>
  );
}
