import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import { SectionHead } from "@/components/sport-page/atoms";

function articleTag(article: Article) {
  return article.league?.name || article.sport.name;
}

function articleHref(article: Article) {
  return `/${article.sport.slug}/${article.slug}`;
}

export function FeaturedStories({
  lead,
  grid,
  headlines,
  viewAllHref,
}: {
  lead: Article;
  grid: Article[];
  headlines: Article[];
  viewAllHref: string;
}) {
  return (
    <section className="sp-section" aria-label="Featured stories and headlines">
      <div className="sp-feature-wrap">
        <SectionHead title="Featured Stories" href={viewAllHref} />

        <div className="sp-feature-grid">
          <Link href={articleHref(lead)} className="sp-featured__lead">
            <div className="sp-featured__lead-media">
              <Image
                src={lead.featuredImage.src}
                alt={lead.featuredImage.alt}
                fill
                sizes="(max-width: 900px) 100vw, 40vw"
                style={{ objectFit: "cover" }}
              />
              <div className="sp-featured__lead-overlay">
                <span className="sp-tag sp-tag--dark sp-tag--overlay">{articleTag(lead)}</span>
                <h3>{lead.title}</h3>
                <p>{lead.excerpt}</p>
                <span className="sp-byline sp-byline--light">
                  {formatRelativeTime(lead.publishedAt)}
                </span>
              </div>
            </div>
          </Link>

          <div className="sp-feature-stack">
            {grid.map((article) => (
              <Link key={article.id} href={articleHref(article)} className="sp-feature-row">
                <div className="sp-feature-row__media">
                  <Image
                    src={article.featuredImage.src}
                    alt={article.featuredImage.alt}
                    fill
                    sizes="120px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="sp-feature-row__body">
                  <span className="sp-tag sp-tag--muted">{articleTag(article)}</span>
                  <h4>{article.title}</h4>
                  <span className="sp-byline sp-byline--row">
                    By {article.authors[0]?.name || "Staff"} · {formatRelativeTime(article.publishedAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <LatestHeadlines headlines={headlines} viewAllHref={viewAllHref} />
      </div>
    </section>
  );
}

function LatestHeadlines({
  headlines,
  viewAllHref,
}: {
  headlines: Article[];
  viewAllHref: string;
}) {
  return (
    <aside className="sp-headlines" aria-label="Latest headlines">
      <div className="sp-headlines__head">
        <h3>Latest Headlines</h3>
        <Link href={viewAllHref} className="sp-viewall">
          View All
        </Link>
      </div>
      {headlines.map((article) => (
        <Link key={article.id} href={articleHref(article)} className="sp-headline">
          <span className="sp-headline__title">{article.title}</span>
          <span className="sp-headline__time">{formatRelativeTime(article.publishedAt)}</span>
        </Link>
      ))}
    </aside>
  );
}
