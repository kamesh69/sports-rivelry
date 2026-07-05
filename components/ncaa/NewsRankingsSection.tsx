import type { NcaaNewsArticle, RankingGroup } from "@/lib/ncaa-types";
import { NewsCard, NewsCardSkeleton } from "@/components/ncaa/NewsCard";
import { RankingCard, RankingCardSkeleton } from "@/components/ncaa/RankingCard";
import { NcaaEmptyState } from "@/components/ncaa/NcaaStateViews";
import { getLatestNews } from "@/services/ncaa-news.service";
import { getRankings } from "@/services/rankings.service";

interface NewsRankingsSectionProps {
  articles: NcaaNewsArticle[];
  rankings: RankingGroup[];
}

/** Side-by-side Latest News (left) and Rankings Center (right) matching reference layout. */
export function NewsRankingsSection({ articles, rankings }: NewsRankingsSectionProps) {
  return (
    <section className="ncaa-section ncaa-section--news-rankings" aria-labelledby="ncaa-news-rankings-heading">
      <h2 id="ncaa-news-rankings-heading" className="sr-only">
        Latest News and Rankings Center
      </h2>

      <div className="ncaa-news-rankings-grid">
        <div className="ncaa-news-rankings-col ncaa-news-rankings-col--news">
          <h3 className="ncaa-section-title ncaa-section-title--inline">Latest News</h3>
          {articles.length === 0 ? (
            <NcaaEmptyState message="Latest news will appear here soon." />
          ) : (
            <div className="ncaa-news-list ncaa-news-list--sidebar" role="list" aria-label="Latest NCAA news">
              {articles.slice(0, 5).map((article, index) => (
                <div role="listitem" key={article.id}>
                  <NewsCard article={article} priority={index < 2} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="ncaa-news-rankings-col ncaa-news-rankings-col--rankings">
          <h3 className="ncaa-section-title ncaa-section-title--inline">Rankings Center</h3>
          {rankings.length === 0 ? (
            <NcaaEmptyState message="Rankings will appear here once the season begins." />
          ) : (
            <div className="ncaa-rank-grid ncaa-rank-grid--landing" role="list" aria-label="NCAA sport rankings">
              {rankings.map((group) => (
                <div role="listitem" key={group.id}>
                  <RankingCard group={group} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Skeleton placeholder for the combined Latest News + Rankings section. */
export function NewsRankingsSectionSkeleton() {
  return (
    <section className="ncaa-section ncaa-section--news-rankings" aria-hidden="true">
      <div className="ncaa-news-rankings-grid">
        <div className="ncaa-news-rankings-col ncaa-news-rankings-col--news">
          <span className="ncaa-skeleton-block ncaa-skeleton-block--heading" />
          <div className="ncaa-news-list ncaa-news-list--sidebar">
            {Array.from({ length: 5 }).map((_, index) => (
              <NewsCardSkeleton key={index} />
            ))}
          </div>
        </div>
        <div className="ncaa-news-rankings-col ncaa-news-rankings-col--rankings">
          <span className="ncaa-skeleton-block ncaa-skeleton-block--heading" />
          <div className="ncaa-rank-grid ncaa-rank-grid--landing">
            {Array.from({ length: 6 }).map((_, index) => (
              <RankingCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Server-side data loader for the combined Latest News + Rankings section. */
export async function NewsRankingsSectionData() {
  const [articles, rankings] = await Promise.all([getLatestNews(5), getRankings()]);
  return <NewsRankingsSection articles={articles} rankings={rankings} />;
}
