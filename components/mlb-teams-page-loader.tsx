import { getMlbTeamsPageSettings } from "@/lib/cms";
import {
  getCategories,
  getQuickFacts,
  getTeams,
  getTimeline,
  FEATURED_TEAM_IDS,
} from "@/lib/team-service";
import { MlbTeamsPage } from "@/components/mlb-teams-page";

export async function MlbTeamsPageLoader() {
  const [teams, categories, timeline, facts, pageSettings] = await Promise.all([
    getTeams(),
    getCategories(),
    getTimeline(),
    getQuickFacts(),
    getMlbTeamsPageSettings(),
  ]);

  const featuredIds =
    pageSettings?.featuredTeamIds?.length ? pageSettings.featuredTeamIds : FEATURED_TEAM_IDS;
  const featured = teams.filter((team) => featuredIds.includes(team.id));

  return (
    <MlbTeamsPage
      initialTeams={teams}
      initialFeatured={featured}
      initialCategories={categories}
      initialTimeline={pageSettings?.timeline?.length ? pageSettings.timeline : timeline}
      initialFacts={pageSettings?.quickFacts?.length ? pageSettings.quickFacts : facts}
    />
  );
}
