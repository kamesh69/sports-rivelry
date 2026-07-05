import type { Conference } from "@/lib/ncaa-types";
import { ConferenceCard, ConferenceCardSkeleton } from "@/components/ncaa/ConferenceCard";
import { NcaaEmptyState } from "@/components/ncaa/NcaaStateViews";
import { NcaaSectionHead } from "@/components/ncaa/NcaaSectionHead";
import { getConferences } from "@/services/ncaa.service";

interface ConferenceSectionProps {
  conferences: Conference[];
}

/** "Conference Coverage": a responsive grid of conference logos (scrolls horizontally on small screens). */
export function ConferenceSection({ conferences }: ConferenceSectionProps) {
  return (
    <section className="ncaa-section ncaa-section--conferences" aria-labelledby="ncaa-conference-heading">
      <NcaaSectionHead
        title="Conference Coverage"
        href="/ncaa/conferences"
        actionLabel="View All Conferences"
        actionVariant="light"
      />
      <h3 id="ncaa-conference-heading" className="sr-only">Conference Coverage</h3>

      {conferences.length === 0 ? (
        <NcaaEmptyState message="Conference coverage will appear here soon." />
      ) : (
        <div className="ncaa-conf-row" role="list" aria-label="NCAA conferences">
          {conferences.map((conference) => (
            <div role="listitem" key={conference.id}>
              <ConferenceCard conference={conference} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/** Skeleton placeholder for the Conference Coverage section. */
export function ConferenceSectionSkeleton() {
  return (
    <section className="ncaa-section" aria-hidden="true">
      <span className="ncaa-skeleton-block ncaa-skeleton-block--heading" />
      <div className="ncaa-conf-row">
        {Array.from({ length: 10 }).map((_, index) => (
          <ConferenceCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}

/** Server-side data loader: fetches conferences and renders the Conference Coverage section. */
export async function ConferenceSectionData() {
  const conferences = await getConferences();
  return <ConferenceSection conferences={conferences} />;
}
