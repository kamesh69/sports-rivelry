import type { Video } from "@/lib/ncaa-types";
import { FeaturedVideoCard, FeaturedVideoCardSkeleton, VideoCard, VideoCardSkeleton } from "@/components/ncaa/VideoCard";
import { NcaaEmptyState } from "@/components/ncaa/NcaaStateViews";
import { NcaaSectionHead } from "@/components/ncaa/NcaaSectionHead";
import { getVideos } from "@/services/ncaa.service";

interface VideoHighlightsProps {
  videos: Video[];
}

/** "Video Highlights": featured video left, compact video cards right. */
export function VideoHighlights({ videos }: VideoHighlightsProps) {
  const [featured, ...rest] = videos;
  const secondary = rest.slice(0, 4);

  return (
    <section className="ncaa-section ncaa-section--videos" aria-labelledby="ncaa-video-heading">
      <NcaaSectionHead
        title="Video Highlights"
        href="/ncaa/videos"
        actionLabel="View All Videos"
        actionVariant="light"
      />
      <h3 id="ncaa-video-heading" className="sr-only">Video Highlights</h3>

      {videos.length === 0 ? (
        <NcaaEmptyState message="Video highlights will appear here soon." />
      ) : (
        <div className="ncaa-video-layout">
          {featured ? (
            <div className="ncaa-video-layout__featured">
              <FeaturedVideoCard video={featured} priority />
            </div>
          ) : null}

          {secondary.length > 0 ? (
            <div className="ncaa-video-layout__side" role="list" aria-label="More video highlights">
              {secondary.map((video) => (
                <div role="listitem" key={video.id}>
                  <VideoCard video={video} variant="compact" />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}

/** Skeleton placeholder for the Video Highlights section. */
export function VideoHighlightsSkeleton() {
  return (
    <section className="ncaa-section ncaa-section--videos" aria-hidden="true">
      <span className="ncaa-skeleton-block ncaa-skeleton-block--heading" />
      <div className="ncaa-video-layout">
        <FeaturedVideoCardSkeleton />
        <div className="ncaa-video-layout__side">
          {Array.from({ length: 4 }).map((_, index) => (
            <VideoCardSkeleton key={index} compact />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Server-side data loader: fetches videos and renders the Video Highlights section. */
export async function VideoHighlightsData() {
  const videos = await getVideos();
  return <VideoHighlights videos={videos} />;
}
