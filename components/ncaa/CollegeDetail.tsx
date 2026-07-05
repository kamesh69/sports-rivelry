import Link from "next/link";
import type { CSSProperties } from "react";
import type { College, Conference, NcaaNewsArticle } from "@/lib/ncaa-types";
import { getNcaaConferencePath, NCAA_PATH } from "@/lib/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NewsCard } from "@/components/ncaa/NewsCard";
import { NcaaEmptyState } from "@/components/ncaa/NcaaStateViews";
import type { BreadcrumbItem } from "@/lib/seo";

interface CollegeDetailProps {
  college: College;
  conference?: Conference;
  relatedNews: NcaaNewsArticle[];
}

/** NCAA college detail page, reached from any college logo card at `/ncaa/college/:slug`. */
export function CollegeDetail({ college, conference, relatedNews }: CollegeDetailProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: "NCAA", href: NCAA_PATH },
    { name: "Colleges", href: `${NCAA_PATH}/colleges` },
    { name: college.name, href: `${NCAA_PATH}/college/${college.slug}` },
  ];

  return (
    <div className="ncaa-page">
      <div className="ncaa-shell ncaa-index">
        <Breadcrumbs items={breadcrumbs} />

        <header className="ncaa-entity-hero">
          <span
            className="ncaa-entity-hero__mark"
            style={{ "--ncaa-college-accent": college.accent } as CSSProperties}
            aria-hidden="true"
          >
            {college.logo}
          </span>
          <div>
            <h1 className="ncaa-entity-hero__title">{college.name}</h1>
            {conference ? (
              <Link href={getNcaaConferencePath(conference.slug)} className="ncaa-entity-hero__meta-link">
                {conference.name}
              </Link>
            ) : null}
          </div>
        </header>

        <section aria-labelledby="ncaa-college-news-heading">
          <h2 id="ncaa-college-news-heading" className="ncaa-section-title">
            Related Coverage
          </h2>
          {relatedNews.length === 0 ? (
            <NcaaEmptyState message={`No stories about ${college.name} yet. Check back soon.`} />
          ) : (
            <div className="ncaa-news-list ncaa-news-list--index">
              {relatedNews.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
