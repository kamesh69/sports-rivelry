import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

interface ArticleMoreRailProps {
  title: string;
  articles: Article[];
}

export function ArticleMoreRail({ title, articles }: ArticleMoreRailProps) {
  if (!articles.length) {
    return null;
  }

  return (
    <section className="article-more-rail" aria-labelledby="article-more-rail-heading">
      <h2 id="article-more-rail-heading">{title}</h2>
      <div className="article-more-rail__track">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/${article.sport.slug}/${article.slug}`}
            className="article-more-card"
          >
            <Image
              src={article.featuredImage.src}
              alt={article.featuredImage.alt}
              width={640}
              height={360}
              className="article-more-card__image"
              sizes="(max-width: 720px) 82vw, 18vw"
            />
            <span className="article-more-card__tag">{article.league?.name || article.sport.name}</span>
            <h3>{article.title}</h3>
            <time dateTime={article.publishedAt}>{formatRelativeTime(article.publishedAt)}</time>
          </Link>
        ))}
      </div>
    </section>
  );
}
