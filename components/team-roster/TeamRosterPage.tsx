"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MLBTeam } from "@/lib/mlb-team-types";
import type { Player, PositionGroup } from "@/lib/player-types";
import { getPlayersGroupedByPosition, searchPlayers } from "@/services/player.service";
import { getTeamRosterPath, TEAMS_DIRECTORY_PATH } from "@/lib/navigation";
import { TeamHero } from "@/components/team-roster/TeamHero";
import { RosterSection } from "@/components/team-roster/RosterSection";
import { ManagerSection } from "@/components/team-roster/ManagerSection";
import { MoreMlbTeamsSection } from "@/components/team-roster/MoreMlbTeamsSection";
import { EmptyState } from "@/components/team-roster/EmptyState";
import { ErrorState } from "@/components/team-roster/ErrorState";
import { TableSkeleton } from "@/components/team-roster/RosterSkeleton";
import type { PlayerFilterValue } from "@/components/team-roster/PlayerFilterDropdown";

interface TeamRosterPageProps {
  team: MLBTeam;
  allTeams: MLBTeam[];
  initialGroupedRoster: Array<{ group: PositionGroup; players: Player[] }>;
}

/**
 * Top-level client orchestrator for the Team Roster page. Server-fetched
 * data (`team`, `allTeams`, `initialGroupedRoster`) comes in as props; this
 * component only owns UI/filter state, keeping business logic in
 * `services/*.ts`.
 */
export function TeamRosterPage({ team, allTeams, initialGroupedRoster }: TeamRosterPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [season, setSeason] = useState("2026");
  const [position, setPosition] = useState<PlayerFilterValue>("All Players");
  const [search, setSearch] = useState("");
  const [error] = useState<string | null>(null);

  /* Changing the team dropdown pushes a new URL — Next.js re-renders this
     route via a client-side transition, so the roster swaps in without a
     full page reload. */
  const handleTeamChange = useCallback(
    (slug: string) => {
      if (slug === team.slug) return;
      startTransition(() => {
        router.push(getTeamRosterPath(slug));
      });
    },
    [router, team.slug]
  );

  const allPlayers = useMemo(
    () => initialGroupedRoster.flatMap((group) => group.players),
    [initialGroupedRoster]
  );

  const filteredPlayers = useMemo(() => {
    let players = allPlayers;
    if (search.trim()) {
      players = searchPlayers(players, search);
    }
    if (position !== "All Players") {
      players = players.filter((player) => player.group === position);
    }
    return players;
  }, [allPlayers, search, position]);

  const groupedRoster = useMemo(
    () => getPlayersGroupedByPosition(filteredPlayers),
    [filteredPlayers]
  );

  if (error) {
    return (
      <div className="tr-page">
        <ErrorState message={error} onRetry={() => router.refresh()} />
      </div>
    );
  }

  return (
    <div className="sport-theme tr-page">
      <TeamHero
        team={team}
        teams={allTeams}
        season={season}
        position={position}
        onSeasonChange={setSeason}
        onTeamChange={handleTeamChange}
        onPositionChange={setPosition}
      />

      <div className="tr-shell">
        <div className="tr-header">
          <div>
            <h1 className="tr-header__title">{team.name} Roster</h1>
            <p className="tr-header__subtitle">
              {allPlayers.length} active roster spots · {season} season
            </p>
          </div>
          <div className="tr-header__actions">
            <label className="tr-search">
              <span className="visually-hidden">Search player</span>
              <svg
                className="tr-search__icon"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="search"
                className="tr-search__input"
                placeholder="Search player..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search player by name, position, birth place or jersey number"
              />
            </label>
            <Link href={TEAMS_DIRECTORY_PATH} className="tr-more-btn">
              More MLB Teams
            </Link>
          </div>
        </div>

        <div id="roster" className="tr-roster" aria-live="polite" aria-busy={isPending}>
          {isPending ? (
            <>
              <TableSkeleton rows={6} />
              <TableSkeleton rows={2} />
            </>
          ) : groupedRoster.length === 0 ? (
            <EmptyState />
          ) : (
            groupedRoster.map((group) => (
              <RosterSection key={group.group} group={group.group} players={group.players} />
            ))
          )}
        </div>

        <ManagerSection team={team} />
      </div>

      <MoreMlbTeamsSection teams={allTeams} currentTeamId={team.id} />
    </div>
  );
}
