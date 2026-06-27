import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { SectionHead } from "@/components/sport-page/atoms";

export function TrendingToday({
  articles,
  viewAllHref,
}: {
  articles: Article[];
  viewAllHref: string;
}) {
  if (!articles.length) {
    return null;
  }

  return (
    <section className="sp-section" aria-label="Trending today">
      <SectionHead title="Trending Today" href={viewAllHref} />
      <div className="sp-trending__track">
        {articles.slice(0, 5).map((article, index) => (
          <Link
            key={article.id}
            href={`/${article.sport.slug}/${article.slug}`}
            className="sp-trendcard"
          >
            <div className="sp-trendcard__media">
              <Image
                src={article.featuredImage.src}
                alt={article.featuredImage.alt}
                fill
                sizes="(max-width: 680px) 70vw, 220px"
                style={{ objectFit: "cover" }}
              />
              <span className="sp-trendcard__rank">{index + 1}</span>
            </div>
            <div className="sp-trendcard__body">
              <h4>{article.title}</h4>
              <span className="sp-byline">
                <strong>{article.authors[0]?.name || "Staff"}</strong>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
