import Image from "next/image";
import type { Article } from "@/lib/types";
import { formatArticleDate } from "@/lib/utils";

interface ArticleHeaderProps {
  article: Article;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  const author = article.authors[0];
  const category = article.league?.name || article.sport.name;

  return (
    <header className="article-header">
      <span className="article-header__category">{category}</span>
      <h1 className="article-header__title">{article.title}</h1>
      <div className="article-header__byline">
        {author ? (
          <Image
            src={author.avatar.src}
            alt={author.avatar.alt}
            width={32}
            height={32}
            className="article-header__avatar"
          />
        ) : null}
        <div className="article-header__byline-text">
          {author ? <strong>{author.name}</strong> : null}
          <span className="article-header__meta-sep" aria-hidden="true">|</span>
          <span>{formatArticleDate(article.publishedAt)}</span>
          <span className="article-header__meta-sep" aria-hidden="true">·</span>
          <span>{article.readTime} min read</span>
        </div>
      </div>
      {article.sourceArticleLink ? (
        <p className="article-header__source">
          Source:{" "}
          <a href={article.sourceArticleLink} rel="noopener noreferrer" target="_blank">
            {article.sourceArticleLink}
          </a>
        </p>
      ) : null}
    </header>
  );
}
