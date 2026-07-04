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

/**
 * MLB News module navigation. Mirrors `getTeamRosterPath` /
 * `TEAMS_DIRECTORY_PATH` above — every "View All" link and every news card
 * must build its URL from these helpers instead of hardcoding path strings.
 */
export const MLB_NEWS_PATH = "/mlb/news";

export function getNewsArticlePath(slug: string): string {
  return `${MLB_NEWS_PATH}/${slug}`;
}
