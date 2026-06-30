import Image from "next/image";
import Link from "next/link";
import type { MLBTeam } from "@/lib/mlb-team-types";
import { TeamBadge } from "@/components/sport-page/atoms";

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

  return (
    <Link
      href={`/mlb/team/${team.slug}`}
      className="td-teamcard td-fadein"
      aria-label={`${team.name} — ${team.league} League, ${team.division} Division`}
    >
      <div className="td-teamcard__img-wrap">
        <Image
          src={team.stadiumImage}
          alt={`${team.stadium}`}
          fill
          sizes="(max-width: 480px) 100vw, (max-width: 900px) 50vw, (max-width: 1100px) 33vw, 25vw"
          style={{ objectFit: "cover" }}
          loading="lazy"
        />
        <div className="td-teamcard__img-overlay" aria-hidden="true" />
      </div>

      <div className="td-teamcard__body">
        <div className="td-teamcard__top">
          <div>
            <h3 className="td-teamcard__name">{team.name}</h3>
            <p className="td-teamcard__location">
              <span aria-hidden="true">📍</span>
              {team.city}
            </p>
          </div>
          <TeamBadge team={teamIdentity} size="lg" />
        </div>

        <div className="td-teamcard__info">
          <div className="td-teamcard__info-row">
            <span aria-hidden="true">🏟</span>
            <span>{team.stadium}</span>
          </div>
          <div className="td-teamcard__info-row">
            <span aria-hidden="true">👥</span>
            <span>Cap. {team.stadiumCapacity.toLocaleString()}</span>
          </div>
          <div className="td-teamcard__info-row">
            <span aria-hidden="true">📅</span>
            <span>Est. {team.founded}</span>
          </div>
        </div>

        <div className="td-teamcard__tags" aria-label="League and division">
          <span className={`td-tag td-tag--${team.league === "American" ? "al" : "nl"}`}>
            {team.league === "American" ? "AL" : "NL"}
          </span>
          <span className="td-tag td-tag--div">{team.division}</span>
          {team.championships > 0 && (
            <span className="td-tag td-tag--al" aria-label={`${team.championships} championships`}>
              🏆 {team.championships}
            </span>
          )}
        </div>

        <div className="td-teamcard__footer">
          <span className="td-teamcard__btn" aria-hidden="true">
            View Team →
          </span>
        </div>
      </div>
    </Link>
  );
}
