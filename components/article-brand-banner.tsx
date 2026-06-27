import Link from "next/link";
import { SOCIAL_LINKS, SITE_TAGLINE } from "@/lib/site-config";
import { SocialIcon } from "@/components/social-icon";

export function ArticleBrandBanner() {
  const year = new Date().getFullYear();

  return (
    <div className="article-brand-banner">
      <div className="article-brand-banner__inner">
        <Link href="/" className="article-brand-banner__logo" aria-label="Sports Rivalry home">
          <span className="article-brand-banner__mark">SR</span>
          <span className="article-brand-banner__name">Sports Rivalry</span>
        </Link>
        <p className="article-brand-banner__tagline">{SITE_TAGLINE}</p>
        <div className="article-brand-banner__socials">
          {SOCIAL_LINKS.map((item) => (
            <a
              key={item.platform}
              href={item.url}
              className="article-brand-banner__social-link"
              aria-label={item.label}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SocialIcon platform={item.platform} />
            </a>
          ))}
        </div>
        <p className="article-brand-banner__copy">
          Sports Rivalry Media, Inc. &copy; {year} | All Rights Reserved
        </p>
      </div>
    </div>
  );
}
