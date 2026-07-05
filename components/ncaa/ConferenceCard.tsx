import Link from "next/link";
import type { Conference } from "@/lib/ncaa-types";
import { ConferenceLogo } from "@/components/ncaa/NcaaConferenceLogos";
import { getNcaaConferencePath } from "@/lib/navigation";

interface ConferenceCardProps {
  conference: Conference;
}

/** A single conference logo card linking to the conference's dedicated page. */
export function ConferenceCard({ conference }: ConferenceCardProps) {
  return (
    <Link
      href={getNcaaConferencePath(conference.slug)}
      className="ncaa-conf-card"
      aria-label={conference.name}
    >
      <span className="ncaa-conf-card__logo-wrap" aria-hidden="true">
        <ConferenceLogo slug={conference.slug} />
      </span>
      <span className="ncaa-conf-card__name">{conference.shortName}</span>
    </Link>
  );
}

/** Skeleton placeholder matching ConferenceCard's layout. */
export function ConferenceCardSkeleton() {
  return (
    <div className="ncaa-conf-card ncaa-conf-card--skeleton" aria-hidden="true">
      <span className="ncaa-skeleton-block ncaa-conf-card__logo-wrap" />
      <span className="ncaa-skeleton-block ncaa-skeleton-block--line-short" />
    </div>
  );
}
