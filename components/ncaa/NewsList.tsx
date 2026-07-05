import type { NcaaNewsArticle } from "@/lib/ncaa-types";
import { NewsCard, NewsCardSkeleton } from "@/components/ncaa/NewsCard";
import { NcaaEmptyState } from "@/components/ncaa/NcaaStateViews";
import { NcaaSectionHead } from "@/components/ncaa/NcaaSectionHead";
import { NCAA_PATH } from "@/lib/navigation";
import { getLatestNews } from "@/services/ncaa-news.service";

interface NewsListProps {
  articles: NcaaNewsArticle[];
}

/** "Latest News": a vertical list of recent NCAA headlines with a "View All News" action. */
export function NewsList({ articles }: NewsListProps) {
  return (
    <section className="ncaa-section" aria-labelledby="ncaa-news-heading">
      <NcaaSectionHead title="Latest News" href={`${NCAA_PATH}/news`} actionLabel="View All News" />
      <h3 id="ncaa-news-heading" className="sr-only">Latest News</h3>

      {articles.length === 0 ? (
        <NcaaEmptyState message="Latest news will appear here soon." />
      ) : (
        <div className="ncaa-news-list" role="list" aria-label="Latest NCAA news">
          {articles.map((article, index) => (
            <div role="listitem" key={article.id}>
              <NewsCard article={article} priority={index < 2} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/** Skeleton placeholder for the Latest News section. */
export function NewsListSkeleton() {
  return (
    <section className="ncaa-section" aria-hidden="true">
      <span className="ncaa-skeleton-block ncaa-skeleton-block--heading" />
      <div className="ncaa-news-list">
        {Array.from({ length: 5 }).map((_, index) => (
          <NewsCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}

/** Server-side data loader: fetches the latest news and renders the Latest News section. */
export async function NewsListData() {
  const articles = await getLatestNews(6);
  return <NewsList articles={articles} />;
}
