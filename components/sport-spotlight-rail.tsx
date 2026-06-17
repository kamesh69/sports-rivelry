import Image from "next/image";
import Link from "next/link";
import type { Article, SportSummary } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

interface SportSpotlightRailProps {
  sport: SportSummary;
  articles: Article[];
}

export function SportSpotlightRail({ sport, articles }: SportSpotlightRailProps) {
  const [leadArticle, ...headlineArticles] = articles;

  if (!leadArticle) {
    return null;
  }

  return (
    <section className="sport-spotlight" aria-labelledby={`sport-spotlight-${sport.slug}`}>
      <div className="section-heading">
        <div className="section-heading__copy">
          <span className="eyebrow">{sport.name}</span>
          <h2 id={`sport-spotlight-${sport.slug}`}>{sport.name} rivalry desk</h2>
          <p>{sport.description}</p>
        </div>
        <Link href={`/${sport.slug}`} className="section-action">
          More {sport.name}
        </Link>
      </div>

      <div className="sport-spotlight__layout">
        <Link href={`/${leadArticle.sport.slug}/${leadArticle.slug}`} className="sport-spotlight__lead">
          <Image
            src={leadArticle.featuredImage.src}
            alt={leadArticle.featuredImage.alt}
            width={leadArticle.featuredImage.width}
            height={leadArticle.featuredImage.height}
            className="sport-spotlight__lead-image"
            sizes="(max-width: 1100px) 100vw, 52vw"
          />
          <div className="sport-spotlight__lead-copy">
            <span className="sport-spotlight__label">{leadArticle.league?.name || sport.name}</span>
            <h3>{leadArticle.title}</h3>
            <p>{leadArticle.excerpt}</p>
            <small>
              {leadArticle.authors[0]?.name} | {formatRelativeTime(leadArticle.publishedAt)}
            </small>
          </div>
        </Link>

        <div className="sport-spotlight__headlines">
          <span className="sport-spotlight__headlines-title">{sport.name} headlines</span>
          {headlineArticles.map((article) => (
            <Link
              key={article.id}
              href={`/${article.sport.slug}/${article.slug}`}
              className="sport-spotlight__headline"
            >
              <Image
                src={article.featuredImage.src}
                alt={article.featuredImage.alt}
                width={article.featuredImage.width}
                height={article.featuredImage.height}
                className="sport-spotlight__headline-image"
                sizes="120px"
              />
              <div>
                <strong>{article.title}</strong>
                <span>{formatRelativeTime(article.publishedAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
