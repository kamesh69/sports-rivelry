import type { CSSProperties } from "react";
import type { College, Conference, NcaaNewsArticle } from "@/lib/ncaa-types";
import { NCAA_PATH } from "@/lib/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CollegeCard } from "@/components/ncaa/CollegeCard";
import { NewsCard } from "@/components/ncaa/NewsCard";
import { NcaaEmptyState } from "@/components/ncaa/NcaaStateViews";
import type { BreadcrumbItem } from "@/lib/seo";

interface ConferenceDetailProps {
  conference: Conference;
  colleges: College[];
  relatedNews: NcaaNewsArticle[];
}

/** NCAA conference detail page, reached from any conference logo card at `/ncaa/conference/:slug`. */
export function ConferenceDetail({ conference, colleges, relatedNews }: ConferenceDetailProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: "NCAA", href: NCAA_PATH },
    { name: "Conferences", href: `${NCAA_PATH}/conferences` },
    { name: conference.name, href: `${NCAA_PATH}/conference/${conference.slug}` },
  ];

  return (
    <div className="ncaa-page">
      <div className="ncaa-shell ncaa-index">
        <Breadcrumbs items={breadcrumbs} />

        <header className="ncaa-entity-hero">
          <span
            className="ncaa-entity-hero__mark"
            style={{ "--ncaa-college-accent": conference.accent } as CSSProperties}
            aria-hidden="true"
          >
            {conference.shortName.slice(0, 3).toUpperCase()}
          </span>
          <div>
            <h1 className="ncaa-entity-hero__title">{conference.name}</h1>
          </div>
        </header>

        <section aria-labelledby="ncaa-conference-colleges-heading">
          <h2 id="ncaa-conference-colleges-heading" className="ncaa-section-title">
            Member Schools
          </h2>
          {colleges.length === 0 ? (
            <NcaaEmptyState message="No featured member schools yet." />
          ) : (
            <div className="ncaa-college-row ncaa-college-row--index">
              {colleges.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          )}
        </section>

        <section aria-labelledby="ncaa-conference-news-heading">
          <h2 id="ncaa-conference-news-heading" className="ncaa-section-title">
            Related Coverage
          </h2>
          {relatedNews.length === 0 ? (
            <NcaaEmptyState message={`No stories about the ${conference.shortName} yet. Check back soon.`} />
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
