import type { Championship } from "@/lib/ncaa-types";
import { ChampionshipCard, ChampionshipCardSkeleton } from "@/components/ncaa/ChampionshipCard";
import { NcaaEmptyState } from "@/components/ncaa/NcaaStateViews";
import { NcaaSectionHead } from "@/components/ncaa/NcaaSectionHead";
import { getChampionships } from "@/services/ncaa.service";

interface ChampionshipSectionProps {
  championships: Championship[];
}

/** "Championship Central": black countdown tiles on a light section background. */
export function ChampionshipSection({ championships }: ChampionshipSectionProps) {
  return (
    <section className="ncaa-section ncaa-section--championships" aria-labelledby="ncaa-championship-heading">
      <NcaaSectionHead
        title="Championship Central"
        href="/ncaa/rankings"
        actionLabel="View All Championships"
        actionVariant="light"
      />
      <h3 id="ncaa-championship-heading" className="sr-only">
        Championship Central
      </h3>

      {championships.length === 0 ? (
        <NcaaEmptyState message="Championship countdowns will appear here soon." />
      ) : (
        <div className="ncaa-champ-row" role="list" aria-label="Championship countdowns">
          {championships.map((championship) => (
            <div key={championship.id} role="listitem">
              <ChampionshipCard championship={championship} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/** Skeleton placeholder for the Championship Central section. */
export function ChampionshipSectionSkeleton() {
  return (
    <section className="ncaa-section ncaa-section--championships" aria-hidden="true">
      <span className="ncaa-skeleton-block ncaa-skeleton-block--heading" />
      <div className="ncaa-champ-row">
        {Array.from({ length: 8 }).map((_, index) => (
          <ChampionshipCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}

/** Server-side data loader: fetches championships and renders the Championship Central section. */
export async function ChampionshipSectionData() {
  const championships = await getChampionships();
  return <ChampionshipSection championships={championships} />;
}
