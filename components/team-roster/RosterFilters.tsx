"use client";

import type { MLBTeam } from "@/lib/mlb-team-types";
import { SeasonDropdown } from "@/components/team-roster/SeasonDropdown";
import { TeamDropdown } from "@/components/team-roster/TeamDropdown";
import { PlayerFilterDropdown, type PlayerFilterValue } from "@/components/team-roster/PlayerFilterDropdown";

interface RosterFiltersProps {
  teams: MLBTeam[];
  season: string;
  teamSlug: string;
  position: PlayerFilterValue;
  onSeasonChange: (season: string) => void;
  onTeamChange: (teamSlug: string) => void;
  onPositionChange: (position: PlayerFilterValue) => void;
}

/** The three top-of-hero dropdowns, grouped as one reusable filter bar. */
export function RosterFilters({
  teams,
  season,
  teamSlug,
  position,
  onSeasonChange,
  onTeamChange,
  onPositionChange,
}: RosterFiltersProps) {
  return (
    <div className="tr-hero__filters">
      <span className="tr-hero__filter-label">Search by Roster</span>
      <div className="tr-hero__filter-group">
        <SeasonDropdown value={season} onChange={onSeasonChange} />
        <TeamDropdown teams={teams} value={teamSlug} onChange={onTeamChange} />
        <PlayerFilterDropdown value={position} onChange={onPositionChange} />
      </div>
    </div>
  );
}
