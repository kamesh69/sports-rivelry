import Link from "next/link";
import type { ReactNode } from "react";

interface NcaaSectionHeadProps {
  title: string;
  href?: string;
  actionLabel?: string;
  description?: string;
  /** "light" = black uppercase link (Explore Every Sport); "dark" = white/red on dark bands. */
  actionVariant?: "light" | "dark";
  children?: ReactNode;
}

/** Shared section header for the NCAA module: accent-bar title + optional "View all" action. */
export function NcaaSectionHead({
  title,
  href,
  actionLabel = "View All",
  description,
  actionVariant = "light",
  children,
}: NcaaSectionHeadProps) {
  const actionClass =
    actionVariant === "dark" ? "ncaa-section-action ncaa-section-action--dark" : "ncaa-section-action";

  return (
    <div className="ncaa-section-head">
      <div className="ncaa-section-head__copy">
        <h2 className="ncaa-section-title">{title}</h2>
        {description ? <p className="ncaa-section-desc">{description}</p> : null}
      </div>
      {children}
      {href ? (
        <Link href={href} className={actionClass}>
          {actionLabel}
          <span aria-hidden="true"> ›</span>
        </Link>
      ) : null}
    </div>
  );
}
