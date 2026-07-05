import { NCAA_RANKINGS } from "@/lib/ncaa-data";
import type { RankingGroup } from "@/lib/ncaa-types";

/**
 * NCAA rankings data access layer. Reads from the local mock dataset today;
 * swap the function bodies for real polling/API data later without touching
 * any component that calls `getRankings()` / `getRankingsBySport()`.
 */

export async function getRankings(): Promise<RankingGroup[]> {
  return NCAA_RANKINGS;
}

export async function getRankingsBySport(sportSlug: string): Promise<RankingGroup | undefined> {
  return NCAA_RANKINGS.find((group) => group.sportSlug === sportSlug);
}
