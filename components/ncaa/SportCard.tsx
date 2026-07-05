import Image from "next/image";
import Link from "next/link";
import type { Sport } from "@/lib/ncaa-types";

interface SportCardProps {
  sport: Sport;
  priority?: boolean;
}

function formatStoryCount(count: number): string {
  return count.toLocaleString("en-US");
}

/** A single sport card matching the reference: image, name, story count, LIVE + Rankings row. */
export function SportCard({ sport, priority = false }: SportCardProps) {
  const rankingsHref = sport.rankingsHref ?? `/ncaa/rankings#rankings-${sport.slug}`;

  return (
    <article className="ncaa-sport-card" aria-label={sport.name}>
      <div className="ncaa-sport-card__media">
        <Image
          src={sport.image}
          alt={sport.name}
          fill
          sizes="(max-width: 720px) 70vw, (max-width: 1100px) 30vw, 180px"
          style={{ objectFit: "cover" }}
          loading={priority ? undefined : "lazy"}
          priority={priority}
        />
      </div>
      <div className="ncaa-sport-card__body">
        <h3 className="ncaa-sport-card__name">{sport.name}</h3>
        <p className="ncaa-sport-card__meta">{formatStoryCount(sport.storyCount)} Stories</p>
        <div className="ncaa-sport-card__actions">
          {sport.isLive ? (
            <span className="ncaa-sport-card__live">
              <span className="ncaa-sport-card__live-dot" aria-hidden="true" />
              Live
            </span>
          ) : (
            <span className="ncaa-sport-card__live ncaa-sport-card__live--placeholder" aria-hidden="true" />
          )}
          <Link href={rankingsHref} className="ncaa-sport-card__rankings">
            Rankings
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Skeleton placeholder matching SportCard's layout. */
export function SportCardSkeleton() {
  return (
    <div className="ncaa-sport-card ncaa-sport-card--skeleton" aria-hidden="true">
      <span className="ncaa-skeleton-block ncaa-sport-card__media" />
      <div className="ncaa-sport-card__body">
        <span className="ncaa-skeleton-block ncaa-skeleton-block--line" />
        <span className="ncaa-skeleton-block ncaa-skeleton-block--line-short" />
      </div>
    </div>
  );
}
