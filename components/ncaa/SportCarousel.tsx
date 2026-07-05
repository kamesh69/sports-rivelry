"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import type { Sport, SportIconLink } from "@/lib/ncaa-types";
import { SportCard } from "@/components/ncaa/SportCard";
import { NcaaSportIcon } from "@/components/ncaa/NcaaSportIcons";
import { NcaaEmptyState, NcaaSkeletonRow } from "@/components/ncaa/NcaaStateViews";
import { NcaaSectionHead } from "@/components/ncaa/NcaaSectionHead";
import { getSportIconLinks, getSports } from "@/services/ncaa.service";

interface SportCarouselProps {
  sports: Sport[];
  iconLinks: SportIconLink[];
}

/** Horizontally scrollable row of sport cards plus a secondary row of icon/text links. */
export function SportCarousel({ sports, iconLinks }: SportCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".ncaa-sport-card");
    const step = card ? card.offsetWidth + 14 : 180;
    track.scrollBy({ left: step * direction, behavior: "smooth" });
  }, []);

  if (sports.length === 0 && iconLinks.length === 0) {
    return <NcaaEmptyState message="Sports coverage will appear here soon." />;
  }

  return (
    <div>
      {sports.length > 0 ? (
        <div className="ncaa-carousel-stage">
          <div ref={trackRef} className="ncaa-carousel" role="list" aria-label="Featured NCAA sports">
            {sports.map((sport, index) => (
              <div key={sport.id} role="listitem" className="ncaa-carousel__item">
                <SportCard sport={sport} priority={index < 2} />
              </div>
            ))}
          </div>

          <button
            type="button"
            className="ncaa-carousel__next"
            onClick={() => scroll(1)}
            aria-label="Scroll sports right"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      ) : null}

      {iconLinks.length > 0 ? (
        <div className="ncaa-icon-links-band">
          <ul className="ncaa-icon-links" aria-label="More NCAA sports">
            {iconLinks.map((sport) => (
              <li key={sport.id}>
                <Link href={`/ncaa#rankings-${sport.slug}`} className="ncaa-icon-link">
                  <span className="ncaa-icon-link__icon" aria-hidden="true">
                    <NcaaSportIcon id={sport.slug} />
                  </span>
                  <span className="ncaa-icon-link__label">{sport.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/** Skeleton placeholder for the sports section, shown while data streams in. */
export function SportsSectionSkeleton() {
  return (
    <section className="ncaa-section" aria-hidden="true">
      <span className="ncaa-skeleton-block ncaa-skeleton-block--heading" />
      <NcaaSkeletonRow count={6} className="ncaa-skeleton-row--sports" />
    </section>
  );
}

/** Server-side data loader: fetches sports + icon links and renders the "Explore Every Sport" section. */
export async function SportsSectionData() {
  const [sports, iconLinks] = await Promise.all([getSports(), getSportIconLinks()]);

  return (
    <section className="ncaa-section ncaa-section--sports" aria-labelledby="ncaa-sports-heading">
      <NcaaSectionHead
        title="Explore Every Sport"
        href="/ncaa#rankings-football"
        actionLabel="View All Sports"
        actionVariant="light"
      />
      <h3 id="ncaa-sports-heading" className="sr-only">
        Explore every NCAA sport
      </h3>
      <SportCarousel sports={sports} iconLinks={iconLinks} />
    </section>
  );
}
