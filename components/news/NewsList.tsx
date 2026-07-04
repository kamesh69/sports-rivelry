import type { NewsArticle } from "@/lib/news-types";
import { NewsCard } from "@/components/news/NewsCard";
import { NewsCardSkeleton } from "@/components/news/NewsCardSkeleton";
import { NewsEmptyState } from "@/components/news/NewsEmptyState";

interface NewsListProps {
  articles: NewsArticle[];
  loading: boolean;
  skeletonCount?: number;
}

/** Vertical list of article rows, each separated by a subtle divider. */
export function NewsList({ articles, loading, skeletonCount = 8 }: NewsListProps) {
  if (loading) {
    return (
      <div className="nc-list" aria-hidden="true">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <NewsCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return <NewsEmptyState />;
  }

  return (
    <div className="nc-list" role="list" aria-label="MLB news articles">
      {articles.map((article, index) => (
        <div role="listitem" key={article.id} style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }} className="nc-list__item">
          <NewsCard article={article} priority={index < 2} />
        </div>
      ))}
    </div>
  );
}
