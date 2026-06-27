import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";

interface ArticleRecommendedProps {
  articles: Article[];
}

export function ArticleRecommended({ articles }: ArticleRecommendedProps) {
  if (!articles.length) {
    return null;
  }

  return (
    <section className="article-recommended" aria-labelledby="article-recommended-heading">
      <span id="article-recommended-heading" className="article-sidebar__label">
        Recommended
      </span>
      <ul className="article-recommended__list">
        {articles.map((article) => (
          <li key={article.id}>
            <Link
              href={`/${article.sport.slug}/${article.slug}`}
              className="article-recommended__item"
            >
              <Image
                src={article.featuredImage.src}
                alt={article.featuredImage.alt}
                width={96}
                height={96}
                className="article-recommended__thumb"
                sizes="48px"
              />
              <span className="article-recommended__title">{article.title}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="article-recommended__dots" aria-hidden="true">
        <span />
        <span className="is-active" />
        <span />
      </div>
    </section>
  );
}
