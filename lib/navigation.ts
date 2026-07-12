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
 * MLB News archive navigation. Mirrors `getTeamRosterPath` /
 * `TEAMS_DIRECTORY_PATH` above — every "View All" link should build its URL
 * from these helpers instead of hardcoding path strings.
 */
export const MLB_NEWS_PATH = "/mlb/news";

export function getNewsArticlePath(slug: string): string {
  return `/mlb/${slug}`;
}

/**
 * NCAA module navigation. Mirrors the MLB helpers above — every card and
 * "View All" link in the NCAA module builds its URL from these helpers
 * instead of hardcoding path strings.
 */
export const NCAA_PATH = "/ncaa";

export function getNcaaNewsPath(slug: string): string {
  return `${NCAA_PATH}/news/${slug}`;
}

export function getNcaaCollegePath(slug: string): string {
  return `${NCAA_PATH}/college/${slug}`;
}

export function getNcaaConferencePath(slug: string): string {
  return `${NCAA_PATH}/conference/${slug}`;
}

export function getNcaaVideoPath(slug: string): string {
  return `${NCAA_PATH}/videos/${slug}`;
}
