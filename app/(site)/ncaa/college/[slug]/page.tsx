import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollegeBySlug, getConferenceBySlug } from "@/services/ncaa.service";
import { getLatestNews } from "@/services/ncaa-news.service";
import { buildBreadcrumbJsonLd, buildMetadata, type BreadcrumbItem } from "@/lib/seo";
import { getNcaaCollegePath, NCAA_PATH } from "@/lib/navigation";
import { JsonLd } from "@/components/json-ld";
import { CollegeDetail } from "@/components/ncaa/CollegeDetail";

export const revalidate = 60;

interface NcaaCollegePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NcaaCollegePageProps): Promise<Metadata> {
  const { slug } = await params;
  const college = await getCollegeBySlug(slug);

  if (!college) {
    return buildMetadata({
      title: "College not found | The Sports Rivalry",
      description: "The requested NCAA college could not be found.",
      canonicalPath: getNcaaCollegePath(slug),
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${college.name} | NCAA | The Sports Rivalry`,
    description: `News and coverage for the ${college.name} athletics program.`,
    canonicalPath: getNcaaCollegePath(college.slug),
  });
}

export default async function NcaaCollegePage({ params }: NcaaCollegePageProps) {
  const { slug } = await params;
  const college = await getCollegeBySlug(slug);

  if (!college) {
    notFound();
  }

  const [conference, latestNews] = await Promise.all([
    college.conference ? getConferenceBySlug(college.conference) : Promise.resolve(undefined),
    getLatestNews(4),
  ]);

  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: "NCAA", href: NCAA_PATH },
    { name: "Colleges", href: `${NCAA_PATH}/colleges` },
    { name: college.name, href: getNcaaCollegePath(college.slug) },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <CollegeDetail college={college} conference={conference} relatedNews={latestNews} />
    </>
  );
}
