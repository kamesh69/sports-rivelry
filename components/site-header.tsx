import Link from "next/link";
import { SOCIAL_LINKS, SPORTS_NAV } from "@/lib/site-config";
import type { Article } from "@/lib/types";
import { Logo } from "@/components/logo";
import { SocialIcon } from "@/components/social-icon";

interface SiteHeaderProps {
  breakingNews: Article[];
}

export function SiteHeader({ breakingNews }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="page-shell nav-bar">
        <Logo />
        <nav className="primary-nav" aria-label="Primary">
          <details className="nav-dropdown">
            <summary className="nav-dropdown__trigger">Sports</summary>
            <div className="nav-dropdown__menu" role="menu">
              {SPORTS_NAV.map((item) => (
                <Link key={item.slug} href={item.href || `/${item.slug}`} role="menuitem">
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
          <Link href="/topics/rivalries" className="nav-link">
            Rivalries
          </Link>
        </nav>
        <div className="nav-actions nav-socials" aria-label="Social media">
          {SOCIAL_LINKS.map((item) => (
            <a
              key={item.platform}
              href={item.url}
              className="nav-socials__link"
              aria-label={item.label}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SocialIcon platform={item.platform} />
            </a>
          ))}
        </div>
      </div>
      <div className="ticker-wrap" aria-label="Breaking stories">
        <div className="page-shell ticker-inner">
          <span className="ticker-label">Breaking</span>
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
      </div>
    </header>
  );
}
