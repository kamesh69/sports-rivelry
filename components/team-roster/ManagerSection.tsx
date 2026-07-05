import type { CSSProperties } from "react";
import type { MLBTeam } from "@/lib/mlb-team-types";

interface ManagerSectionProps {
  team: MLBTeam;
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ManagerSection({ team }: ManagerSectionProps) {
  const manager = team.manager ?? "Manager TBD";
  const avatarStyle = {
    "--team-primary": team.primaryColor,
    "--team-accent": team.accentColor,
    "--team-text": team.textColor || "#ffffff",
  } as CSSProperties;

  return (
    <section className="tr-manager" aria-label="Team manager">
      <span className="tr-manager__avatar" style={avatarStyle} aria-hidden="true">
        {initialsOf(manager)}
      </span>
      <p className="tr-manager__line">
        <span className="tr-manager__label">Manager</span>
        <span className="tr-manager__name">{manager}</span>
      </p>
    </section>
  );
}
