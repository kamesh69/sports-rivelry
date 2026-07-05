import Link from "next/link";
import type { RankingGroup } from "@/lib/ncaa-types";

interface RankingCardProps {
  group: RankingGroup;
}

function TrendIndicator({
  trend,
  amount,
}: {
  trend?: "up" | "down" | "flat";
  amount?: number;
}) {
  if (trend === "up" && amount) {
    return (
      <span className="ncaa-rank-card__trend ncaa-rank-card__trend--up" aria-label={`Up ${amount}`}>
        ▲ {amount}
      </span>
    );
  }

  if (trend === "down" && amount) {
    return (
      <span className="ncaa-rank-card__trend ncaa-rank-card__trend--down" aria-label={`Down ${amount}`}>
        ▼ {amount}
      </span>
    );
  }

  return (
    <span className="ncaa-rank-card__trend ncaa-rank-card__trend--flat" aria-hidden="true">
      —
    </span>
  );
}

/** Top-5 ranking card for a single sport with poll label, trends, and a view-all link. */
export function RankingCard({ group }: RankingCardProps) {
  return (
    <article className="ncaa-rank-card" id={`rankings-${group.sportSlug}`} aria-label={`${group.sportName} rankings`}>
      <h3 className="ncaa-rank-card__title">
        {group.sportName}
        {group.pollLabel ? <span className="ncaa-rank-card__poll"> ({group.pollLabel})</span> : null}
      </h3>
      <ol className="ncaa-rank-card__list">
        {group.entries.map((entry) => (
          <li key={entry.rank} className="ncaa-rank-card__row">
            <span className="ncaa-rank-card__rank">{entry.rank}</span>
            <span className="ncaa-rank-card__team">{entry.team}</span>
            <TrendIndicator trend={entry.trend ?? "flat"} amount={entry.trendAmount} />
          </li>
        ))}
      </ol>
      <Link href={`/ncaa/rankings#rankings-${group.sportSlug}`} className="ncaa-rank-card__link">
        View Full Poll <span aria-hidden="true">›</span>
      </Link>
    </article>
  );
}

/** Skeleton placeholder matching RankingCard's layout. */
export function RankingCardSkeleton() {
  return (
    <div className="ncaa-rank-card ncaa-rank-card--skeleton" aria-hidden="true">
      <span className="ncaa-skeleton-block ncaa-skeleton-block--line-short" />
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className="ncaa-skeleton-block ncaa-skeleton-block--row" />
      ))}
    </div>
  );
}
