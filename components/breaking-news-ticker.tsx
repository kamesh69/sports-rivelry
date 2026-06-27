"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Article } from "@/lib/types";

export function BreakingNewsTicker({ breakingNews }: { breakingNews: Article[] }) {
  const pathname = usePathname();

  if (pathname !== "/" || !breakingNews.length) {
    return null;
  }

  return (
    <div className="ticker-wrap" aria-label="Breaking stories">
      <span className="ticker-label">Breaking News</span>
      <div className="ticker-marquee">
        <div className="ticker-track">
          <div className="ticker-group">
            {breakingNews.map((story) => (
              <Link key={story.id} href={`/${story.sport.slug}/${story.slug}`}>
                {story.title}
              </Link>
            ))}
          </div>
          <div className="ticker-group" aria-hidden="true">
            {breakingNews.map((story) => (
              <Link
                key={`${story.id}-duplicate`}
                href={`/${story.sport.slug}/${story.slug}`}
                tabIndex={-1}
              >
                {story.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
