import Image from "next/image";
import Link from "next/link";
import type { MLBTeam } from "@/lib/mlb-team-types";
import { TeamBadge } from "@/components/sport-page/atoms";
import { getTeamRosterPath } from "@/lib/navigation";

interface TeamCardProps {
  team: MLBTeam;
}

export function TeamCard({ team }: TeamCardProps) {
  const teamIdentity = {
    name: team.name,
    shortName: team.shortName,
    primaryColor: team.primaryColor,
    accentColor: team.accentColor,
    textColor: team.textColor,
  };

  const leagueTag = `${team.league === "American" ? "AL" : "NL"} ${team.division}`;

  return (
    <Link
      href={getTeamRosterPath(team.slug)}
      className="td-teamcard td-teamcard--ref td-fadein"
      aria-label={`${team.name} — ${leagueTag}`}
    >
      <div className="td-teamcard__logo-wrap" aria-hidden="true">
        <TeamBadge team={teamIdentity} size="xl" />
      </div>

      <div className="td-teamcard__main">
        <h3 className="td-teamcard__name">{team.name}</h3>

        <div className="td-teamcard__body-row">
          <div className="td-teamcard__meta">
            <span className="td-teamcard__division-tag">{leagueTag}</span>
            <p className="td-teamcard__location">{team.city}</p>
            <p className="td-teamcard__founded">Year: {team.founded}</p>
          </div>

          <div className="td-teamcard__stadium-wrap" aria-hidden="true">
            <Image
              src={team.stadiumImage}
              alt=""
              fill
              sizes="140px"
              style={{ objectFit: "cover" }}
              loading="lazy"
            />
            <div className="td-teamcard__stadium-caption">
              <span className="td-teamcard__stadium-name">{team.stadium}</span>
              <span className="td-teamcard__stadium-cap">
                Capacity: {team.stadiumCapacity.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
