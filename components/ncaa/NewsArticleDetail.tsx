import Link from "next/link";
import Image from "next/image";
import type { NcaaNewsArticle } from "@/lib/ncaa-types";
import { NCAA_PATH } from "@/lib/navigation";
import { formatArticleDate } from "@/lib/utils";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NewsCard } from "@/components/ncaa/NewsCard";
import type { BreadcrumbItem } from "@/lib/seo";

interface NewsArticleDetailProps {
  article: NcaaNewsArticle;
  related: NcaaNewsArticle[];
}

/** NCAA news article detail page, reached from any NCAA story card at `/ncaa/news/:slug`. Mirrors `components/news/NewsArticleDetail.tsx`. */
export function NewsArticleDetail({ article, related }: NewsArticleDetailProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: "NCAA", href: NCAA_PATH },
    { name: "News", href: `${NCAA_PATH}/news` },
  ];

  const paragraphs = article.content.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);

  return (
    <div className="ncaa-page">
      <div className="ncaa-shell ncaa-article">
        <Breadcrumbs items={breadcrumbs} />

        <article className="ncaa-article__body-wrap">
          <span className="ncaa-article__category">{article.category}</span>
          <h1 className="ncaa-article__title">{article.title}</h1>
          <div className="ncaa-article__meta">
            <span>{article.author}</span>
            <span aria-hidden="true">•</span>
            <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
          </div>

          <div className="ncaa-article__media">
            <Image
              src={article.image.src}
              alt={article.image.alt}
              fill
              sizes="(max-width: 900px) 100vw, 900px"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          <div className="ncaa-article__content">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>

        {related.length > 0 ? (
          <section className="ncaa-article__related" aria-label="More NCAA news">
            <h2 className="ncaa-article__related-title">More NCAA News</h2>
            <div className="ncaa-news-list">
              {related.map((item) => (
                <NewsCard key={item.id} article={item} />
              ))}
            </div>
          </section>
        ) : null}

        <p className="ncaa-article__back">
          <Link href={`${NCAA_PATH}/news`} className="ncaa-viewall">
            ← Back to NCAA News
          </Link>
        </p>
      </div>
    </div>
  );
}
