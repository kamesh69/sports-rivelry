import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

interface TopHeadlinesProps {
  articles: Article[];
}

export function TopHeadlines({ articles }: TopHeadlinesProps) {
  return (
    <section className="top-headlines" aria-labelledby="top-headlines-heading">
      <div className="section-heading">
        <div className="section-heading__copy">
          <span className="eyebrow">Top Headlines</span>
          <h2 id="top-headlines-heading">The stories setting the week’s mood</h2>
          <p>Fast reads with no featured images, just the pressure points worth tracking now.</p>
        </div>
      </div>
      <div className="top-headlines__grid">
        {articles.map((article) => (
          <article key={article.id} className="top-headlines__item">
            <div className="top-headlines__meta">
              <span>{article.sport.name}</span>
              <span>{formatRelativeTime(article.publishedAt)}</span>
            </div>
            <h3>
              <Link href={`/${article.sport.slug}/${article.slug}`}>{article.title}</Link>
            </h3>
          </article>
        ))}
      </div>
    </section>
  );
}
