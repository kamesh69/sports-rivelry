import Image from "next/image";
import Link from "next/link";
import type { Article, SportSummary } from "@/lib/types";
import { formatArticleDate } from "@/lib/utils";

interface ArticleMoreGridProps {
  sport: SportSummary;
  articles: Article[];
}

export function ArticleMoreGrid({ sport, articles }: ArticleMoreGridProps) {
  if (!articles.length) {
    return null;
  }

  return (
    <section className="article-more-grid" aria-labelledby="article-more-grid-heading">
      <div className="article-more-grid__header">
        <h2 id="article-more-grid-heading">
          More stories from&nbsp;<span>{sport.name}</span>
        </h2>
        <Link href={`/${sport.slug}`} className="article-more-grid__view-all">
          View all
          <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8h8M9 5l3 3-3 3" />
          </svg>
        </Link>
      </div>
      <div className="article-more-grid__cards">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/${article.sport.slug}/${article.slug}`}
            className="article-more-grid__card"
          >
            <Image
              src={article.featuredImage.src}
              alt={article.featuredImage.alt}
              width={640}
              height={426}
              className="article-more-grid__image"
              sizes="(max-width: 768px) 100vw, (max-width: 1120px) 50vw, 25vw"
            />
            <span className="article-more-grid__tag">
              {article.league?.name || article.sport.name}
            </span>
            <h3>{article.title}</h3>
            <p className="article-more-grid__meta">
              {formatArticleDate(article.publishedAt)}&nbsp;&bull;&nbsp;{article.readTime} min read
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
