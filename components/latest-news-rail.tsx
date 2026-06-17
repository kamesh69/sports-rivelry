import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

interface LatestNewsRailProps {
  articles: Article[];
}

export function LatestNewsRail({ articles }: LatestNewsRailProps) {
  if (!articles.length) {
    return null;
  }

  return (
    <section className="latest-news-rail" aria-labelledby="latest-news-heading">
      <h2 id="latest-news-heading">Latest News</h2>
      <div className="latest-news-rail__track">
        {articles.map((article) => (
          <article key={article.id} className="latest-news-card">
            <Link href={`/${article.sport.slug}/${article.slug}`} className="latest-news-card__image-link">
              <Image
                src={article.featuredImage.src}
                alt={article.featuredImage.alt}
                width={640}
                height={360}
                className="latest-news-card__image"
                sizes="(max-width: 720px) 78vw, 16vw"
              />
            </Link>
            <div className="latest-news-card__body">
              <span className="latest-news-card__tag">
                {article.league?.name || article.sport.name}
              </span>
              <h3>
                <Link href={`/${article.sport.slug}/${article.slug}`}>{article.title}</Link>
              </h3>
              <time dateTime={article.publishedAt}>{formatRelativeTime(article.publishedAt)}</time>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
