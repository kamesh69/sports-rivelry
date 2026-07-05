import Image from "next/image";
import Link from "next/link";
import type { Video } from "@/lib/ncaa-types";

interface VideoCardProps {
  video: Video;
  priority?: boolean;
  variant?: "compact" | "default";
}

/** Large featured video card: thumbnail left, title/summary/CTA on a dark panel right. */
export function FeaturedVideoCard({ video, priority = false }: { video: Video; priority?: boolean }) {
  return (
    <Link href={video.href} className="ncaa-video-featured" aria-label={`Play video: ${video.title}`}>
      <div className="ncaa-video-featured__media">
        <Image
          src={video.thumbnail.src}
          alt={video.thumbnail.alt}
          fill
          sizes="(max-width: 1100px) 90vw, 45vw"
          style={{ objectFit: "cover" }}
          loading={priority ? undefined : "lazy"}
          priority={priority}
        />
        <span className="ncaa-video-featured__play" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M8 5v14l11-7Z" />
          </svg>
        </span>
        <span className="ncaa-video-featured__duration">{video.duration}</span>
      </div>
      <div className="ncaa-video-featured__body">
        <h3 className="ncaa-video-featured__title">{video.title}</h3>
        {video.summary ? <p className="ncaa-video-featured__summary">{video.summary}</p> : null}
        <span className="ncaa-video-featured__cta">
          Watch Now <span aria-hidden="true">›</span>
        </span>
      </div>
    </Link>
  );
}

/** A single video highlight card: thumbnail, play icon overlay, duration badge, and title. */
export function VideoCard({ video, priority = false, variant = "default" }: VideoCardProps) {
  const cardClass = variant === "compact" ? "ncaa-video-card ncaa-video-card--compact" : "ncaa-video-card";

  return (
    <Link href={video.href} className={cardClass} aria-label={`Play video: ${video.title}`}>
      <div className="ncaa-video-card__media">
        <Image
          src={video.thumbnail.src}
          alt={video.thumbnail.alt}
          fill
          sizes="(max-width: 720px) 40vw, 15vw"
          style={{ objectFit: "cover" }}
          loading={priority ? undefined : "lazy"}
          priority={priority}
        />
        <span className="ncaa-video-card__play" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M8 5v14l11-7Z" />
          </svg>
        </span>
        <span className="ncaa-video-card__duration">{video.duration}</span>
      </div>
      <h4 className="ncaa-video-card__title">{video.title}</h4>
    </Link>
  );
}

/** Skeleton placeholder matching FeaturedVideoCard's layout. */
export function FeaturedVideoCardSkeleton() {
  return (
    <div className="ncaa-video-featured ncaa-video-featured--skeleton" aria-hidden="true">
      <span className="ncaa-skeleton-block ncaa-video-featured__media" />
      <div className="ncaa-video-featured__body">
        <span className="ncaa-skeleton-block ncaa-skeleton-block--line" />
        <span className="ncaa-skeleton-block ncaa-skeleton-block--text" />
      </div>
    </div>
  );
}

/** Skeleton placeholder matching VideoCard's layout. */
export function VideoCardSkeleton({ compact = false }: { compact?: boolean }) {
  const cardClass = compact ? "ncaa-video-card ncaa-video-card--compact ncaa-video-card--skeleton" : "ncaa-video-card ncaa-video-card--skeleton";

  return (
    <div className={cardClass} aria-hidden="true">
      <span className="ncaa-skeleton-block ncaa-video-card__media" />
      <span className="ncaa-skeleton-block ncaa-skeleton-block--line-short" />
    </div>
  );
}
