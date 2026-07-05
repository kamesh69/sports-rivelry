import Link from "next/link";
import type { CSSProperties } from "react";
import type { College } from "@/lib/ncaa-types";
import { getNcaaCollegePath } from "@/lib/navigation";

interface CollegeCardProps {
  college: College;
}

/** A single college logo card linking to the college's dedicated page. */
export function CollegeCard({ college }: CollegeCardProps) {
  return (
    <Link
      href={getNcaaCollegePath(college.slug)}
      className="ncaa-college-card"
      aria-label={college.name}
    >
      <span className="ncaa-college-card__shell">
        <span
          className="ncaa-college-card__logo"
          style={{ "--ncaa-college-accent": college.accent } as CSSProperties}
          aria-hidden="true"
        >
          {college.logo}
        </span>
      </span>
      <span className="ncaa-college-card__name">{college.name}</span>
    </Link>
  );
}

/** Skeleton placeholder matching CollegeCard's layout. */
export function CollegeCardSkeleton() {
  return (
    <div className="ncaa-college-card ncaa-college-card--skeleton" aria-hidden="true">
      <span className="ncaa-skeleton-block ncaa-college-card__shell" />
      <span className="ncaa-skeleton-block ncaa-skeleton-block--line-short" />
    </div>
  );
}
