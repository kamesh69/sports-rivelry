"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { MLBTeam } from "@/lib/mlb-team-types";
import { RosterFilters } from "@/components/team-roster/RosterFilters";
import type { PlayerFilterValue } from "@/components/team-roster/PlayerFilterDropdown";

interface TeamHeroProps {
  team: MLBTeam;
  teams: MLBTeam[];
  season: string;
  position: PlayerFilterValue;
  onSeasonChange: (season: string) => void;
  onTeamChange: (teamSlug: string) => void;
  onPositionChange: (position: PlayerFilterValue) => void;
}

/**
 * Large hero banner: team stadium background with a dark gradient overlay,
 * a big team crest on the left, and season/team/position filters on the
 * right. Automatically re-renders with the selected team's branding.
 */
export function TeamHero({
  team,
  teams,
  season,
  position,
  onSeasonChange,
  onTeamChange,
  onPositionChange,
}: TeamHeroProps) {
  const logoStyle = {
    "--team-primary": team.primaryColor,
    "--team-accent": team.accentColor,
    "--team-text": team.textColor || "#ffffff",
  } as CSSProperties;

  return (
    <section className="tr-hero" aria-label={`${team.name} hero banner`}>
      <div className="tr-hero__bg">
        <Image
          key={team.id}
          src={team.bannerImage ?? team.stadiumImage}
          alt={`${team.stadium} — home of the ${team.name}`}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="tr-hero__overlay" aria-hidden="true" />

      <div className="tr-hero__inner">
        <div className="tr-hero__top">
          <nav className="tr-hero__breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/mlb">MLB</Link>
            <span>/</span>
            <Link href="/mlb/teams">Teams</Link>
            <span>/</span>
            <span aria-current="page">{team.name}</span>
          </nav>

          <div className="tr-hero__top-right">
            <RosterFilters
              teams={teams}
              season={season}
              teamSlug={team.slug}
              position={position}
              onSeasonChange={onSeasonChange}
              onTeamChange={onTeamChange}
              onPositionChange={onPositionChange}
            />
          </div>
        </div>

        <div className="tr-hero__content">
          <h1 className="sr-only">{team.name}</h1>
          <div className="tr-hero__logo" style={logoStyle} aria-hidden="true">
            <span>{team.shortName}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
