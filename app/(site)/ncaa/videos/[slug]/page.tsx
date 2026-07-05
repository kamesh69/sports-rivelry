import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVideoBySlug } from "@/services/ncaa.service";
import { buildBreadcrumbJsonLd, buildMetadata, type BreadcrumbItem } from "@/lib/seo";
import { getNcaaVideoPath, NCAA_PATH } from "@/lib/navigation";
import { JsonLd } from "@/components/json-ld";
import { VideoDetail } from "@/components/ncaa/VideoDetail";

export const revalidate = 60;

interface NcaaVideoPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NcaaVideoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);

  if (!video) {
    return buildMetadata({
      title: "Video not found | The Sports Rivalry",
      description: "The requested NCAA video could not be found.",
      canonicalPath: getNcaaVideoPath(slug),
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${video.title} | NCAA Video | The Sports Rivalry`,
    description: `Watch: ${video.title}`,
    canonicalPath: getNcaaVideoPath(video.slug),
    ogImage: video.thumbnail,
  });
}

export default async function NcaaVideoPage({ params }: NcaaVideoPageProps) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);

  if (!video) {
    notFound();
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: "NCAA", href: NCAA_PATH },
    { name: "Videos", href: `${NCAA_PATH}/videos` },
    { name: video.title, href: getNcaaVideoPath(video.slug) },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <VideoDetail video={video} />
    </>
  );
}
