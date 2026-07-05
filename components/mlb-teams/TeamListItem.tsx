import Link from "next/link";
import type { MLBTeam } from "@/lib/mlb-team-types";
import { TeamBadge } from "@/components/sport-page/atoms";
import { getTeamRosterPath } from "@/lib/navigation";

interface TeamListItemProps {
  team: MLBTeam;
}

export function TeamListItem({ team }: TeamListItemProps) {
  const teamIdentity = {
    name: team.name,
    shortName: team.shortName,
    primaryColor: team.primaryColor,
    accentColor: team.accentColor,
    textColor: team.textColor,
  };

  return (
    <Link
      href={getTeamRosterPath(team.slug)}
      className="td-teamrow td-fadein"
      aria-label={`${team.name} — ${team.league} League, ${team.division} Division`}
    >
      <TeamBadge team={teamIdentity} size="xl" />

      <div className="td-teamrow__main">
        <h3 className="td-teamrow__name">{team.name}</h3>
        <div className="td-teamrow__meta">
          <span>📍 {team.city}</span>
          <span>Est. {team.founded}</span>
          {team.championships > 0 && <span>🏆 {team.championships} titles</span>}
        </div>
      </div>

      <div className="td-teamrow__tags" aria-label="League and division">
        <span className={`td-tag td-tag--${team.league === "American" ? "al" : "nl"}`}>
          {team.league === "American" ? "AL" : "NL"}
        </span>
        <span className="td-tag td-tag--div">{team.division}</span>
      </div>
    </Link>
  );
}
