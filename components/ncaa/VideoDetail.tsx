import Image from "next/image";
import type { Video } from "@/lib/ncaa-types";
import { NCAA_PATH } from "@/lib/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import type { BreadcrumbItem } from "@/lib/seo";

interface VideoDetailProps {
  video: Video;
}

/** NCAA video detail/player page, reached from any video card at `/ncaa/videos/:slug`. Renders a poster + play affordance today; swap for a real embedded player once the video API is wired up. */
export function VideoDetail({ video }: VideoDetailProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: "NCAA", href: NCAA_PATH },
    { name: "Videos", href: `${NCAA_PATH}/videos` },
    { name: video.title, href: `${NCAA_PATH}/videos/${video.slug}` },
  ];

  return (
    <div className="ncaa-page">
      <div className="ncaa-shell ncaa-index">
        <Breadcrumbs items={breadcrumbs} />

        <div className="ncaa-video-player" role="group" aria-label={`Video player: ${video.title}`}>
          <Image
            src={video.thumbnail.src}
            alt={video.thumbnail.alt}
            fill
            sizes="(max-width: 1100px) 100vw, 1100px"
            style={{ objectFit: "cover" }}
            priority
          />
          <span className="ncaa-video-player__play" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor">
              <path d="M8 5v14l11-7Z" />
            </svg>
          </span>
          <span className="ncaa-video-player__duration">{video.duration}</span>
        </div>

        <h1 className="ncaa-index__title">{video.title}</h1>
      </div>
    </div>
  );
}
