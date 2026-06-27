import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { ScoreTeam, TeamIdentity } from "@/lib/types";

type BadgeSize = "xs" | "sm" | "md" | "lg" | "xl";

export function TeamBadge({
  team,
  size = "md",
}: {
  team: TeamIdentity | ScoreTeam;
  size?: BadgeSize;
}) {
  const sizeClass = size === "md" ? "" : ` sp-teambadge--${size}`;

  return (
    <span
      className={`sp-teambadge${sizeClass}`}
      style={
        {
          "--team-primary": team.primaryColor,
          "--team-accent": team.accentColor,
          "--team-text": team.textColor || "#ffffff",
        } as CSSProperties
      }
      aria-hidden="true"
    >
      {team.shortName}
    </span>
  );
}

export function SectionHead({
  title,
  href,
  actionLabel = "View All",
  children,
}: {
  title: string;
  href?: string;
  actionLabel?: string;
  children?: ReactNode;
}) {
  return (
    <div className="sp-section-head">
      <h2 className="sp-section-head__title">{title}</h2>
      {children}
      {href ? (
        <Link href={href} className="sp-viewall">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
