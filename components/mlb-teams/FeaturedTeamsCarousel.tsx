"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MLBTeam } from "@/lib/mlb-team-types";
import { TeamBadge } from "@/components/sport-page/atoms";
import { getTeamRosterPath } from "@/lib/navigation";

interface FeaturedTeamsCarouselProps {
  teams: MLBTeam[];
}

export function FeaturedTeamsCarousel({ teams }: FeaturedTeamsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);

  const VISIBLE = 4;
  const total = teams.length;

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement | undefined;
    if (card) {
      track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    }
    setActiveDot(index);
  }, []);

  const handlePrev = () => {
    const next = Math.max(0, activeDot - 1);
    scrollToIndex(next);
  };

  const handleNext = () => {
    const next = Math.min(total - 1, activeDot + 1);
    scrollToIndex(next);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function onScroll() {
      if (!track) return;
      const cardWidth = (track.children[0] as HTMLElement)?.offsetWidth ?? 0;
      if (cardWidth === 0) return;
      const idx = Math.round(track.scrollLeft / (cardWidth + 19));
      setActiveDot(Math.max(0, Math.min(total - 1, idx)));
    }

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [total]);

  const teamToIdentity = (team: MLBTeam) => ({
    name: team.name,
    shortName: team.shortName,
    primaryColor: team.primaryColor,
    accentColor: team.accentColor,
    textColor: team.textColor,
  });

  return (
    <section className="td-section" aria-label="Featured teams">
      <div className="td-section-head">
        <h2 className="td-section-title">Featured Teams</h2>
      </div>

      <div className="td-carousel-wrap">
        <div ref={trackRef} className="td-carousel" role="list" aria-label="Featured teams carousel">
          {teams.map((team) => (
            <article
              key={team.id}
              className="td-carousel__card"
              role="listitem"
              aria-label={team.name}
            >
              <div className="td-carousel__img-wrap">
                <Image
                  src={team.stadiumImage}
                  alt={`${team.stadium} — home of the ${team.name}`}
                  fill
                  sizes="(max-width: 768px) 85vw, (max-width: 1100px) 33vw, 25vw"
                  style={{ objectFit: "cover" }}
                  loading="lazy"
                />
                <div className="td-carousel__img-overlay" aria-hidden="true" />
                <div className="td-carousel__badge-wrap" aria-hidden="true">
                  <span className="td-carousel__league-badge">{team.league} League</span>
                  <span className="td-carousel__div-badge">{team.division}</span>
                </div>
              </div>

              <div className="td-carousel__body">
                <div className="td-carousel__team-row">
                  <TeamBadge team={teamToIdentity(team)} size="lg" />
                  <div>
                    <div className="td-carousel__name">{team.name}</div>
                    <div className="td-carousel__league">{team.league} League · {team.division}</div>
                  </div>
                </div>

                <div className="td-carousel__meta">
                  <div className="td-carousel__meta-item">
                    <span className="td-carousel__meta-value">{team.championships}</span>
                    <span className="td-carousel__meta-label">Championships</span>
                  </div>
                  <div className="td-carousel__meta-item">
                    <span className="td-carousel__meta-value">{team.founded}</span>
                    <span className="td-carousel__meta-label">Founded</span>
                  </div>
                  <div className="td-carousel__meta-item">
                    <span className="td-carousel__meta-value">
                      {(team.stadiumCapacity / 1000).toFixed(0)}K
                    </span>
                    <span className="td-carousel__meta-label">Capacity</span>
                  </div>
                </div>

                <div className="td-carousel__actions">
                  <Link
                    href={getTeamRosterPath(team.slug)}
                    className="td-btn-primary"
                    aria-label={`View ${team.name}`}
                  >
                    View Team
                  </Link>
                  <Link
                    href={`${getTeamRosterPath(team.slug)}#roster`}
                    className="td-btn-secondary"
                    aria-label={`Explore ${team.name} roster`}
                  >
                    Explore Roster
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="td-carousel__nav" aria-hidden="true">
          <button
            type="button"
            className="td-carousel__arrow"
            onClick={handlePrev}
            disabled={activeDot === 0}
            aria-label="Previous teams"
          >
            ‹
          </button>
          <button
            type="button"
            className="td-carousel__arrow"
            onClick={handleNext}
            disabled={activeDot >= total - VISIBLE}
            aria-label="Next teams"
          >
            ›
          </button>
        </div>
      </div>

      <div className="td-carousel__dots" role="tablist" aria-label="Carousel pagination">
        {teams.map((team, i) => (
          <button
            key={team.id}
            type="button"
            role="tab"
            className={`td-carousel__dot${i === activeDot ? " td-carousel__dot--active" : ""}`}
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to ${team.name}`}
            aria-selected={i === activeDot}
          />
        ))}
      </div>
    </section>
  );
}
