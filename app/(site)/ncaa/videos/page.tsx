import type { Metadata } from "next";
import { getVideos } from "@/services/ncaa.service";
import { buildBreadcrumbJsonLd, buildMetadata, type BreadcrumbItem } from "@/lib/seo";
import { NCAA_PATH } from "@/lib/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { VideoCard } from "@/components/ncaa/VideoCard";
import { NcaaEmptyState } from "@/components/ncaa/NcaaStateViews";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "NCAA Video Highlights | The Sports Rivalry",
    description: "Every NCAA video highlight The Sports Rivalry has to offer, in one place.",
    canonicalPath: `${NCAA_PATH}/videos`,
  });
}

export default async function NcaaVideosIndexPage() {
  const videos = await getVideos();
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: "NCAA", href: NCAA_PATH },
    { name: "Videos", href: `${NCAA_PATH}/videos` },
  ];

  return (
    <div className="ncaa-page">
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <div className="ncaa-shell ncaa-index">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="ncaa-index__title">NCAA Video Highlights</h1>

        {videos.length === 0 ? (
          <NcaaEmptyState message="Video highlights will appear here soon." />
        ) : (
          <div className="ncaa-video-grid ncaa-video-grid--index">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
