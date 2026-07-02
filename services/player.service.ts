import type { MLBTeam } from "@/lib/mlb-team-types";
import type { Player, PositionGroup } from "@/lib/player-types";
import { POSITION_GROUP_ORDER } from "@/lib/player-types";
import { generateRosterForTeam } from "@/lib/roster-data";
import { getTeams as fetchAllTeams } from "@/lib/team-service";

/**
 * Player / roster data access layer.
 *
 * Mirrors `team.service.ts`: consumers only ever call these functions, so
 * swapping the mock generator in `lib/roster-data.ts` for a live API later
 * requires zero changes outside this file.
 */

let rosterCache: Map<string, Player[]> | null = null;

async function getRosterIndex(): Promise<Map<string, Player[]>> {
  if (rosterCache) return rosterCache;
  const teams = await fetchAllTeams();
  const index = new Map<string, Player[]>();
  for (const team of teams) {
    index.set(team.id, generateRosterForTeam(team));
  }
  rosterCache = index;
  return index;
}

/** Returns every player across every team. */
export async function getPlayers(): Promise<Player[]> {
  const index = await getRosterIndex();
  return Array.from(index.values()).flat();
}

/** Returns the roster for a single team (by team id). */
export async function getPlayersByTeam(teamId: string): Promise<Player[]> {
  const index = await getRosterIndex();
  return index.get(teamId) ?? [];
}

/** Groups a roster by position section, preserving the canonical display order. */
export function getPlayersGroupedByPosition(
  players: Player[]
): Array<{ group: PositionGroup; players: Player[] }> {
  const buckets = new Map<PositionGroup, Player[]>();

  for (const player of players) {
    const bucket = buckets.get(player.group) ?? [];
    bucket.push(player);
    buckets.set(player.group, bucket);
  }

  return POSITION_GROUP_ORDER.filter((group) => buckets.has(group)).map((group) => ({
    group,
    players: buckets.get(group)!.sort((a, b) => a.jerseyNumber - b.jerseyNumber),
  }));
}

/** Filters players by name, position, birth place, or jersey number. */
export function searchPlayers(players: Player[], query: string): Player[] {
  const q = query.trim().toLowerCase();
  if (!q) return players;

  return players.filter((player) => {
    return (
      player.name.toLowerCase().includes(q) ||
      player.position.toLowerCase().includes(q) ||
      player.birthPlace.toLowerCase().includes(q) ||
      String(player.jerseyNumber).includes(q)
    );
  });
}

/** Convenience helper: full roster for a team, already grouped by position. */
export async function getGroupedRosterForTeam(team: MLBTeam) {
  const players = await getPlayersByTeam(team.id);
  return getPlayersGroupedByPosition(players);
}
