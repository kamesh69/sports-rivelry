import type { CSSProperties } from "react";
import type { Championship } from "@/lib/ncaa-types";
import { ChampionshipLogo } from "@/components/ncaa/NcaaChampionshipLogos";

interface ChampionshipCardProps {
  championship: Championship;
}

/** Countdown card for a single NCAA championship: logo, days remaining, and subtitle. */
export function ChampionshipCard({ championship }: ChampionshipCardProps) {
  const daysStyle = championship.accentColor
    ? ({ "--ncaa-champ-accent": championship.accentColor } as CSSProperties)
    : undefined;

  return (
    <article className="ncaa-champ-card" aria-label={championship.name}>
      <div className="ncaa-champ-card__logo-wrap">
        <ChampionshipLogo variant={championship.logoVariant} />
      </div>
      <div className="ncaa-champ-card__countdown" style={daysStyle}>
        <span className="ncaa-champ-card__days">{championship.daysRemaining}</span>
        <span className="ncaa-champ-card__days-label">Days</span>
      </div>
      <p className="ncaa-champ-card__subtitle">{championship.subtitle}</p>
    </article>
  );
}

/** Skeleton placeholder matching ChampionshipCard's layout. */
export function ChampionshipCardSkeleton() {
  return (
    <div className="ncaa-champ-card ncaa-champ-card--skeleton" aria-hidden="true">
      <span className="ncaa-skeleton-block ncaa-skeleton-block--logo" />
      <span className="ncaa-skeleton-block ncaa-skeleton-block--days" />
      <span className="ncaa-skeleton-block ncaa-skeleton-block--line-short" />
    </div>
  );
}
