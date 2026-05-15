import Link from "next/link";
import { SPORTS_NAV } from "@/lib/site-config";
import type { Article } from "@/lib/types";
import { Logo } from "@/components/logo";

interface SiteHeaderProps {
  breakingNews: Article[];
}

export function SiteHeader({ breakingNews }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="ticker-wrap">
        <div className="page-shell ticker-inner">
          <span className="ticker-label">Breaking</span>
          <div className="ticker-items" aria-label="Breaking stories">
            {breakingNews.map((story) => (
              <Link key={story.id} href={`/${story.sport.slug}/${story.slug}`}>
                {story.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="page-shell nav-bar">
        <Logo />
        <nav className="primary-nav" aria-label="Primary">
          {SPORTS_NAV.map((item) => (
            <Link key={item.slug} href={`/${item.slug}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <Link href="/topics/rivalries">Rivalries</Link>
          <Link href="/search">Search</Link>
        </div>
      </div>
    </header>
  );
}
