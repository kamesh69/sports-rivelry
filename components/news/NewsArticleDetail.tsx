import Link from "next/link";
import type { NewsArticle } from "@/lib/news-types";
import { getCategoryLabel } from "@/lib/news-data";
import { MLB_NEWS_PATH } from "@/lib/navigation";
import { formatArticleDate } from "@/lib/utils";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NewsImage } from "@/components/news/NewsImage";
import { NewsCard } from "@/components/news/NewsCard";
import type { BreadcrumbItem } from "@/lib/seo";

interface NewsArticleDetailProps {
  article: NewsArticle;
  related: NewsArticle[];
}

/** MLB News article detail page — reached from any News card at `/mlb/news/:slug`. */
export function NewsArticleDetail({ article, related }: NewsArticleDetailProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: "Baseball", href: "/mlb" },
    { name: "News", href: MLB_NEWS_PATH },
  ];

  const paragraphs = article.content.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);

  return (
    <div className="sport-theme mn-page">
      <div className="mn-shell mn-shell--article">
        <Breadcrumbs items={breadcrumbs} />

        <article className="mn-article">
          <span className="mn-article__category">{getCategoryLabel(article.category)}</span>
          <h1 className="mn-article__title">{article.title}</h1>
          <div className="mn-article__meta">
            <span className="mn-article__author">{article.author}</span>
            <span aria-hidden="true">•</span>
            <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
          </div>

          <div className="mn-article__media">
            <NewsImage
              src={article.image}
              alt={article.title}
              sizes="(max-width: 900px) 100vw, 900px"
              priority
            />
          </div>

          <div className="mn-article__body">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {article.tags.length ? (
            <ul className="mn-article__tags" aria-label="Topics">
              {article.tags.map((tag) => (
                <li key={tag} className="mn-article__tag">
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </article>

        {related.length ? (
          <section className="mn-related" aria-label="More MLB news">
            <h2 className="mn-related__title">More MLB News</h2>
            <div className="nc-list">
              {related.map((item) => (
                <NewsCard key={item.id} article={item} />
              ))}
            </div>
          </section>
        ) : null}

        <p className="mn-back">
          <Link href={MLB_NEWS_PATH} className="mn-back__link">
            ← Back to MLB News
          </Link>
        </p>
      </div>
    </div>
  );
}
