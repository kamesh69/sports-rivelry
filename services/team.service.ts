import type { MLBTeam } from "@/lib/mlb-team-types";
import { getManagerForTeam, getTeamBanner, getTeamLogo } from "@/lib/roster-data";
import { getTeam, getTeams as fetchAllTeams } from "@/lib/team-service";

/**
 * Team data access layer.
 *
 * This module is the single place that knows *how* team data is fetched.
 * Today it reads from the local mock dataset in `lib/team-service.ts`; when
 * a real MLB API is wired up, only the bodies of these functions need to
 * change — every consumer (pages, components) keeps calling the same
 * functions with the same shapes.
 */

/** Returns every MLB team, enriched with roster-page fields (logo, banner, manager). */
export async function getTeams(): Promise<MLBTeam[]> {
  const teams = await fetchAllTeams();
  return teams.map(enrichTeam);
}

/** Resolves a single team by its URL slug (e.g. "new-york-yankees"). */
export async function getTeamBySlug(slug: string): Promise<MLBTeam | undefined> {
  const team = await getTeam(slug);
  return team ? enrichTeam(team) : undefined;
}

function enrichTeam(team: MLBTeam): MLBTeam {
  return {
    ...team,
    logo: getTeamLogo(team),
    bannerImage: getTeamBanner(team),
    manager: getManagerForTeam(team),
  };
}
