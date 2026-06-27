import Link from "next/link";
import { SOCIAL_LINKS, SPORTS_NAV } from "@/lib/site-config";
import type { Article } from "@/lib/types";
import { BreakingNewsTicker } from "@/components/breaking-news-ticker";
import { Logo } from "@/components/logo";
import { SocialIcon } from "@/components/social-icon";

interface SiteHeaderProps {
  breakingNews: Article[];
}

export function SiteHeader({ breakingNews }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="nav-bar">
        <Logo />
        <nav className="nav-sports" aria-label="Sports">
          {SPORTS_NAV.map((item) => (
            <Link
              key={item.slug}
              href={item.href || `/${item.slug}`}
              className="nav-sports__link"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/topics/rivalries" className="nav-link nav-rivalries">
          Rivalries
        </Link>
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
      <BreakingNewsTicker breakingNews={breakingNews} />
    </header>
  );
}
