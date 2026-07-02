import Link from "next/link";
import type { MLBTeam } from "@/lib/mlb-team-types";
import { TeamCard } from "@/components/mlb-teams/TeamCard";
import { TEAMS_DIRECTORY_PATH } from "@/lib/navigation";

interface MoreMlbTeamsSectionProps {
  teams: MLBTeam[];
  currentTeamId: string;
}

/**
 * "More MLB Teams" rail shown on every roster page. Reuses the exact same
 * `TeamCard` (and therefore the exact same navigation helper) as the Teams
 * Directory — no duplicated card markup or link logic.
 */
export function MoreMlbTeamsSection({ teams, currentTeamId }: MoreMlbTeamsSectionProps) {
  const related = teams.filter((team) => team.id !== currentTeamId).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="td-section tr-related" aria-label="More MLB teams">
      <div className="td-section-head">
        <h2 className="td-section-title">More MLB Teams</h2>
        <Link href={TEAMS_DIRECTORY_PATH} className="sp-viewall">
          View All
        </Link>
      </div>
      <div className="td-dir__grid" role="list" aria-label="Other MLB teams">
        {related.map((team) => (
          <div key={team.id} role="listitem">
            <TeamCard team={team} />
          </div>
        ))}
      </div>
    </section>
  );
}
