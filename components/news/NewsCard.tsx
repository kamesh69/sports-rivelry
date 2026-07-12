import Link from "next/link";
import type { NewsArticle } from "@/lib/news-types";
import { getNewsArticlePath } from "@/lib/navigation";
import { formatDate } from "@/lib/utils";
import { NewsImage } from "@/components/news/NewsImage";

interface NewsCardProps {
  article: NewsArticle;
  priority?: boolean;
}

/** A single, fully-clickable article row: headline + description + byline on the left, image on the right. */
export function NewsCard({ article, priority = false }: NewsCardProps) {
  const href = getNewsArticlePath(article.slug);

  return (
    <article className="nc-row">
      <Link href={href} className="nc-row__link" aria-label={article.title}>
        <div className="nc-row__body">
          <span className="nc-row__category">{article.category}</span>
          <h3 className="nc-row__title">{article.title}</h3>
          <p className="nc-row__summary">{article.summary}</p>
          <div className="nc-row__meta">
            <span className="nc-row__author">{article.author}</span>
            <span className="nc-row__dot" aria-hidden="true">
              •
            </span>
            <time className="nc-row__date" dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
          </div>
        </div>
        <div className="nc-row__media">
          <NewsImage
            src={article.image}
            alt={article.title}
            sizes="(max-width: 720px) 100vw, 148px"
            priority={priority}
          />
        </div>
      </Link>
    </article>
  );
}
