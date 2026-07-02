/**
 * Single source of truth for team-related navigation.
 *
 * Every team card across the app (Teams Directory grid/list, featured
 * carousel, related-teams rail on the roster page) must link to the same
 * place — this helper is imported everywhere instead of each component
 * re-building the URL string.
 */
export function getTeamRosterPath(teamSlug: string): string {
  return `/mlb/teams/${teamSlug}`;
}

export const TEAMS_DIRECTORY_PATH = "/mlb/teams";
