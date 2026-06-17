import type { CSSProperties } from "react";
import type { TeamIdentity } from "@/lib/types";

interface TeamBadgeRowProps {
  teams: TeamIdentity[];
}

export function TeamBadgeRow({ teams }: TeamBadgeRowProps) {
  if (!teams.length) {
    return null;
  }

  return (
    <div className="team-badge-row" aria-label="Team and brand markers">
      {teams.map((team) => (
        <div
          key={team.name}
          className="team-badge-row__item"
          style={
            {
              "--team-primary": team.primaryColor,
              "--team-accent": team.accentColor,
              "--team-text": team.textColor || "#ffffff",
            } as CSSProperties
          }
        >
          <span className="team-badge-row__mark">{team.shortName}</span>
          <span className="team-badge-row__name">{team.name}</span>
        </div>
      ))}
    </div>
  );
}
