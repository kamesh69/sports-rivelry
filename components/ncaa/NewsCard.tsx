import Image from "next/image";
import Link from "next/link";
import type { NcaaNewsArticle } from "@/lib/ncaa-types";
import { getNcaaNewsPath } from "@/lib/navigation";
import { formatRelativeTime } from "@/lib/utils";

interface NewsCardProps {
  article: NcaaNewsArticle;
  priority?: boolean;
}

/** A single Latest News row: thumbnail, headline, and relative publish time. */
export function NewsCard({ article, priority = false }: NewsCardProps) {
  const href = getNcaaNewsPath(article.slug);

  return (
    <article className="ncaa-news-row">
      <Link href={href} className="ncaa-news-row__link" aria-label={article.title}>
        <div className="ncaa-news-row__media">
          <Image
            src={article.image.src}
            alt={article.image.alt}
            fill
            sizes="88px"
            style={{ objectFit: "cover" }}
            loading={priority ? undefined : "lazy"}
            priority={priority}
          />
        </div>
        <div className="ncaa-news-row__body">
          <h4 className="ncaa-news-row__title">{article.title}</h4>
          <time className="ncaa-news-row__time" dateTime={article.publishedAt}>
            {formatRelativeTime(article.publishedAt)}
          </time>
        </div>
      </Link>
    </article>
  );
}

/** Skeleton placeholder matching NewsCard's layout. */
export function NewsCardSkeleton() {
  return (
    <div className="ncaa-news-row ncaa-news-row--skeleton" aria-hidden="true">
      <span className="ncaa-skeleton-block ncaa-news-row__media" />
      <div className="ncaa-news-row__body">
        <span className="ncaa-skeleton-block ncaa-skeleton-block--line" />
        <span className="ncaa-skeleton-block ncaa-skeleton-block--line-short" />
      </div>
    </div>
  );
}
