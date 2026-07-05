import Image from "next/image";
import Link from "next/link";
import type { NcaaNewsArticle } from "@/lib/ncaa-types";
import { getNcaaNewsPath } from "@/lib/navigation";
import { formatDate } from "@/lib/utils";

interface FeaturedStoryCardProps {
  article: NcaaNewsArticle;
  variant?: "hero" | "compact";
  priority?: boolean;
}

/** A featured NCAA story card. "hero" is the large left-column lead story; "compact" is a thumbnail row for the right-hand list. */
export function FeaturedStoryCard({ article, variant = "compact", priority = false }: FeaturedStoryCardProps) {
  const href = getNcaaNewsPath(article.slug);

  if (variant === "hero") {
    return (
      <article className="ncaa-story-hero">
        <Link href={href} className="ncaa-story-hero__link">
          <div className="ncaa-story-hero__media">
            <Image
              src={article.image.src}
              alt={article.image.alt}
              fill
              sizes="(max-width: 900px) 100vw, 55vw"
              style={{ objectFit: "cover" }}
              priority={priority}
            />
          </div>
          <div className="ncaa-story-hero__body">
            <h3 className="ncaa-story-hero__title">{article.title}</h3>
            <p className="ncaa-story-hero__summary">{article.summary}</p>
            <div className="ncaa-story-hero__meta">
              <span>{article.author}</span>
              <span aria-hidden="true">•</span>
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="ncaa-story-compact">
      <Link href={href} className="ncaa-story-compact__link">
        <div className="ncaa-story-compact__media">
          <Image
            src={article.image.src}
            alt={article.image.alt}
            fill
            sizes="96px"
            style={{ objectFit: "cover" }}
            loading="lazy"
          />
        </div>
        <div className="ncaa-story-compact__body">
          <h4 className="ncaa-story-compact__title">{article.title}</h4>
          <div className="ncaa-story-compact__meta">
            <span>{article.author}</span>
            <span aria-hidden="true">•</span>
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          </div>
        </div>
      </Link>
    </article>
  );
}

/** Skeleton placeholders matching FeaturedStoryCard's two variants. */
export function FeaturedStoryCardSkeleton({ variant = "compact" }: { variant?: "hero" | "compact" }) {
  if (variant === "hero") {
    return (
      <div className="ncaa-story-hero ncaa-story-hero--skeleton" aria-hidden="true">
        <span className="ncaa-skeleton-block ncaa-story-hero__media" />
        <div className="ncaa-story-hero__body">
          <span className="ncaa-skeleton-block ncaa-skeleton-block--line" />
          <span className="ncaa-skeleton-block ncaa-skeleton-block--text" />
        </div>
      </div>
    );
  }

  return (
    <div className="ncaa-story-compact ncaa-story-compact--skeleton" aria-hidden="true">
      <span className="ncaa-skeleton-block ncaa-story-compact__media" />
      <div className="ncaa-story-compact__body">
        <span className="ncaa-skeleton-block ncaa-skeleton-block--line" />
        <span className="ncaa-skeleton-block ncaa-skeleton-block--line-short" />
      </div>
    </div>
  );
}
