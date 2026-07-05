"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MLBTeam } from "@/lib/mlb-team-types";
import type { Player, PositionGroup } from "@/lib/player-types";
import { getPlayersGroupedByPosition } from "@/services/player.service";
import { getTeamRosterPath, TEAMS_DIRECTORY_PATH } from "@/lib/navigation";
import { TeamHero } from "@/components/team-roster/TeamHero";
import { RosterSection } from "@/components/team-roster/RosterSection";
import { ManagerSection } from "@/components/team-roster/ManagerSection";
import { BrandStrip } from "@/components/brand-strip";
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
    if (position === "All Players") {
      return allPlayers;
    }
    return allPlayers.filter((player) => player.group === position);
  }, [allPlayers, position]);

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
          <h1 className="tr-header__title">{team.name} Roster</h1>
          <div className="tr-header__actions">
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

      <BrandStrip />
    </div>
  );
}
