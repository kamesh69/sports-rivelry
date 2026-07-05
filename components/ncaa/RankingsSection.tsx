import type { RankingGroup } from "@/lib/ncaa-types";
import { RankingCard, RankingCardSkeleton } from "@/components/ncaa/RankingCard";
import { NcaaEmptyState } from "@/components/ncaa/NcaaStateViews";
import { NcaaSectionHead } from "@/components/ncaa/NcaaSectionHead";
import { getRankings } from "@/services/rankings.service";

interface RankingsSectionProps {
  rankings: RankingGroup[];
}

/** "Rankings Center": a responsive grid of top-5 ranking cards, one per major sport. */
export function RankingsSection({ rankings }: RankingsSectionProps) {
  return (
    <section className="ncaa-section" aria-labelledby="ncaa-rankings-heading">
      <NcaaSectionHead title="Rankings Center" href="/ncaa/rankings" actionLabel="View Full Rankings" />
      <h3 id="ncaa-rankings-heading" className="sr-only">Rankings Center</h3>

      {rankings.length === 0 ? (
        <NcaaEmptyState message="Rankings will appear here once the season begins." />
      ) : (
        <div className="ncaa-rank-grid" role="list" aria-label="NCAA sport rankings">
          {rankings.map((group) => (
            <div role="listitem" key={group.id}>
              <RankingCard group={group} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/** Skeleton placeholder for the Rankings Center section. */
export function RankingsSectionSkeleton() {
  return (
    <section className="ncaa-section" aria-hidden="true">
      <span className="ncaa-skeleton-block ncaa-skeleton-block--heading" />
      <div className="ncaa-rank-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <RankingCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}

/** Server-side data loader: fetches rankings and renders the Rankings Center section. */
export async function RankingsSectionData() {
  const rankings = await getRankings();
  return <RankingsSection rankings={rankings} />;
}
