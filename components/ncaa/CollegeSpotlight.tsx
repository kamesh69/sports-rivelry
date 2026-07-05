import Image from "next/image";
import Link from "next/link";
import type { College, CollegeSpotlightArticle } from "@/lib/ncaa-types";
import { CollegeCard, CollegeCardSkeleton } from "@/components/ncaa/CollegeCard";
import { NcaaEmptyState } from "@/components/ncaa/NcaaStateViews";
import { NcaaSectionHead } from "@/components/ncaa/NcaaSectionHead";
import { getCollegeSpotlightArticles, getColleges } from "@/services/ncaa.service";

interface CollegeSpotlightProps {
  colleges: College[];
  articles: CollegeSpotlightArticle[];
}

/** A horizontal spotlight story card: image left, category/title/summary/CTA right. */
function SpotlightStoryCard({ article }: { article: CollegeSpotlightArticle }) {
  return (
    <article className="ncaa-spotlight-card">
      <Link href={article.href} className="ncaa-spotlight-card__link">
        <div className="ncaa-spotlight-card__media">
          <Image
            src={article.image.src}
            alt={article.image.alt}
            fill
            sizes="(max-width: 720px) 40vw, 20vw"
            style={{ objectFit: "cover" }}
            loading="lazy"
          />
        </div>
        <div className="ncaa-spotlight-card__body">
          <span className="ncaa-spotlight-card__tag">{article.category}</span>
          <h4 className="ncaa-spotlight-card__title">{article.title}</h4>
          <p className="ncaa-spotlight-card__summary">{article.summary}</p>
          <span className="ncaa-spotlight-card__cta">
            {article.ctaLabel} <span aria-hidden="true">›</span>
          </span>
        </div>
      </Link>
    </article>
  );
}

/** "College Spotlight": a row of college logo cards plus student-athlete/recruiting/NIL/coaching story cards. */
export function CollegeSpotlight({ colleges, articles }: CollegeSpotlightProps) {
  return (
    <section className="ncaa-section ncaa-section--college-spotlight" aria-labelledby="ncaa-spotlight-heading">
      <NcaaSectionHead
        title="College Spotlight"
        href="/ncaa/colleges"
        actionLabel="View All Colleges"
        actionVariant="light"
      />
      <h3 id="ncaa-spotlight-heading" className="sr-only">College Spotlight</h3>

      {colleges.length === 0 ? (
        <NcaaEmptyState message="Featured colleges will appear here soon." />
      ) : (
        <div className="ncaa-college-row" role="list" aria-label="Featured NCAA colleges">
          {colleges.map((college) => (
            <div role="listitem" key={college.id}>
              <CollegeCard college={college} />
            </div>
          ))}
        </div>
      )}

      {articles.length > 0 ? (
        <div className="ncaa-spotlight-grid" role="list" aria-label="College spotlight stories">
          {articles.map((article) => (
            <div role="listitem" key={article.id}>
              <SpotlightStoryCard article={article} />
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

/** Skeleton placeholder for the College Spotlight section. */
export function CollegeSpotlightSkeleton() {
  return (
    <section className="ncaa-section ncaa-section--college-spotlight" aria-hidden="true">
      <span className="ncaa-skeleton-block ncaa-skeleton-block--heading" />
      <div className="ncaa-college-row">
        {Array.from({ length: 10 }).map((_, index) => (
          <CollegeCardSkeleton key={index} />
        ))}
      </div>
      <div className="ncaa-spotlight-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <span key={index} className="ncaa-skeleton-block ncaa-spotlight-card" />
        ))}
      </div>
    </section>
  );
}

/** Server-side data loader: fetches colleges + spotlight articles and renders the section. */
export async function CollegeSpotlightData() {
  const [colleges, articles] = await Promise.all([getColleges(), getCollegeSpotlightArticles()]);
  return <CollegeSpotlight colleges={colleges} articles={articles} />;
}
