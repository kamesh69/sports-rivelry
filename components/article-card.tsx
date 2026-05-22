import Image from "next/image";
import Link from "next/link";
import { normalizeFeaturedImage } from "@/lib/media";
import type { Article } from "@/lib/types";
import { formatDate, formatRelativeTime } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  variant?: "hero" | "feature" | "compact" | "tile" | "headline";
}

export function ArticleCard({ article, variant = "feature" }: ArticleCardProps) {
  const summary =
    variant === "compact" || variant === "tile" ? article.excerpt : article.deck;
  const showSummary = variant !== "headline";
  const showFooter = variant !== "headline" && variant !== "tile";
  const timeLabel =
    variant === "headline" || variant === "tile"
      ? formatRelativeTime(article.publishedAt)
      : formatDate(article.publishedAt);
  const imageTarget =
    variant === "hero" ? "articleHero" : variant === "headline" || variant === "tile" ? "articleCard" : "articleFeatured";
  const image = normalizeFeaturedImage(article.featuredImage, imageTarget);

  return (
    <article className={`story-card story-card--${variant}`}>
      <Link href={`/${article.sport.slug}/${article.slug}`} className="story-card__image-link">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="story-card__image"
          priority={variant === "hero"}
          sizes={
            variant === "headline"
              ? "(max-width: 720px) 100vw, 16vw"
              : variant === "hero"
                ? "100vw"
                : "(max-width: 720px) 100vw, 33vw"
          }
        />
      </Link>
      <div className="story-card__body">
        <div className="story-card__meta">
          <span className="story-card__sport">{article.sport.name}</span>
          {variant !== "headline" && article.league ? <span>{article.league.name}</span> : null}
          <span>{timeLabel}</span>
        </div>
        <h3>
          <Link href={`/${article.sport.slug}/${article.slug}`}>{article.title}</Link>
        </h3>
        {showSummary ? <p>{summary}</p> : null}
        {showFooter ? (
          <div className="story-card__footer">
            <span>{article.authors.map((author) => author.name).join(", ")}</span>
            <span>{article.readTime} min read</span>
          </div>
        ) : null}
      </div>
    </article>
  );
}
