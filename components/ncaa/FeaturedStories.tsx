import type { NcaaNewsArticle } from "@/lib/ncaa-types";
import { FeaturedStoryCard, FeaturedStoryCardSkeleton } from "@/components/ncaa/FeaturedStoryCard";
import { NcaaEmptyState } from "@/components/ncaa/NcaaStateViews";
import { NcaaSectionHead } from "@/components/ncaa/NcaaSectionHead";
import { getFeaturedStories } from "@/services/ncaa-news.service";

interface FeaturedStoriesProps {
  stories: NcaaNewsArticle[];
}

/** Two-column "Featured Stories": a large lead story on the left, a vertical list of stories on the right. */
export function FeaturedStories({ stories }: FeaturedStoriesProps) {
  if (stories.length === 0) {
    return (
      <section className="ncaa-section ncaa-section--featured" aria-labelledby="ncaa-featured-heading">
        <NcaaSectionHead title="Featured Stories" />
        <h3 id="ncaa-featured-heading" className="sr-only">Featured Stories</h3>
        <NcaaEmptyState message="Featured stories will appear here soon." />
      </section>
    );
  }

  const [lead, ...rest] = stories;
  const secondary = rest.slice(0, 4);

  return (
    <section className="ncaa-section ncaa-section--featured" aria-labelledby="ncaa-featured-heading">
      <NcaaSectionHead title="Featured Stories" />
      <h3 id="ncaa-featured-heading" className="sr-only">Featured Stories</h3>

      <div className="ncaa-featured-grid">
        <FeaturedStoryCard article={lead} variant="hero" priority />
        <div className="ncaa-featured-list" role="list" aria-label="More featured stories">
          {secondary.map((article) => (
            <div role="listitem" key={article.id}>
              <FeaturedStoryCard article={article} variant="compact" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Skeleton placeholder for the Featured Stories section. */
export function FeaturedStoriesSkeleton() {
  return (
    <section className="ncaa-section" aria-hidden="true">
      <span className="ncaa-skeleton-block ncaa-skeleton-block--heading" />
      <div className="ncaa-featured-grid">
        <FeaturedStoryCardSkeleton variant="hero" />
        <div className="ncaa-featured-list">
          {Array.from({ length: 4 }).map((_, index) => (
            <FeaturedStoryCardSkeleton key={index} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Server-side data loader: fetches featured stories and renders the Featured Stories section. */
export async function FeaturedStoriesData() {
  const stories = await getFeaturedStories(5);
  return <FeaturedStories stories={stories} />;
}
