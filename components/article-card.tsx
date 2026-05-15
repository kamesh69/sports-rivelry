import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  variant?: "hero" | "feature" | "compact";
}

export function ArticleCard({ article, variant = "feature" }: ArticleCardProps) {
  return (
    <article className={`story-card story-card--${variant}`}>
      <Link href={`/${article.sport.slug}/${article.slug}`} className="story-card__image-link">
        <Image
          src={article.featuredImage.src}
          alt={article.featuredImage.alt}
          width={article.featuredImage.width}
          height={article.featuredImage.height}
          className="story-card__image"
          priority={variant === "hero"}
        />
      </Link>
      <div className="story-card__body">
        <div className="story-card__meta">
          <span>{article.sport.name}</span>
          {article.league ? <span>{article.league.name}</span> : null}
          <span>{formatDate(article.publishedAt)}</span>
        </div>
        <h3>
          <Link href={`/${article.sport.slug}/${article.slug}`}>{article.title}</Link>
        </h3>
        <p>{variant === "compact" ? article.excerpt : article.deck}</p>
        <div className="story-card__footer">
          <span>{article.authors.map((author) => author.name).join(", ")}</span>
          <span>{article.readTime} min read</span>
        </div>
      </div>
    </article>
  );
}
