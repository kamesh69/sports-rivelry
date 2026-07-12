import { getHomePageData } from "@/lib/cms";
import { getActivePoll, getFanZoneContent } from "@/lib/supabase/data";
import { dedupeByKey } from "@/lib/utils";
import type { Article } from "@/lib/types";
import { ArticleCard } from "@/components/article-card";
import { AuthorSpotlight } from "@/components/author-spotlight";
import { CategoryStrip } from "@/components/category-strip";
import { FanZoneCta } from "@/components/fan-zone-cta";
import { HomeFeatureGrid } from "@/components/home-feature-grid";
import { HomeHero } from "@/components/home-hero";
import { HomeHeroFeature } from "@/components/home-hero-feature";
import { LatestNewsRail } from "@/components/latest-news-rail";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { QuickHits } from "@/components/quick-hits";
import { RecommendedReads } from "@/components/recommended-reads";
import { SectionHeading } from "@/components/section-heading";
import { SportSpotlightRail } from "@/components/sport-spotlight-rail";

export const revalidate = 60;

const LATEST_COUNT = 8;

export default async function HomePage() {
  const [homeData, fanZone, poll] = await Promise.all([
    getHomePageData(),
    getFanZoneContent(),
    getActivePoll(),
  ]);

  const heroIds = new Set<string>(
    [homeData.heroArticle?.id, ...homeData.heroSecondary.map((article) => article.id)].filter(
      Boolean,
    ) as string[],
  );

  const supportingPool = dedupeByKey(
    [...homeData.editorsPicks, ...homeData.trendingArticles, ...homeData.latestArticles],
    (article) => article.id,
  ).filter((article) => !heroIds.has(article.id));

  const secondaryFeature: Article | undefined = supportingPool[0];
  const sideStories = supportingPool.slice(1, 3);
  const numberedHeadlines = dedupeByKey(
    [...homeData.topHeadlines, ...homeData.trendingArticles],
    (article) => article.id,
  ).slice(0, 10);

  const latestArticles = homeData.latestArticles.slice(0, LATEST_COUNT);
  const trendingArticles = homeData.trendingArticles.slice(0, LATEST_COUNT);

  const recommendedArticles = dedupeByKey(
    [...homeData.recommendedReads, ...homeData.editorsPicks, ...homeData.trendingArticles],
    (article) => article.id,
  ).slice(0, 8);

  return (
    <>
      <div className="page-shell page-shell--home">
        <HomeHeroFeature
          featured={homeData.heroArticle}
          secondary={homeData.heroSecondary}
        />

        <CategoryStrip items={homeData.categoryStrip} />

        <LatestNewsRail articles={latestArticles} />

        {secondaryFeature ? (
          <HomeFeatureGrid
            featured={secondaryFeature}
            sideArticles={sideStories}
            headlines={numberedHeadlines}
          />
        ) : null}
      </div>

      <div className="home-hero-bleed">
        <HomeHero slides={[homeData.heroArticle, ...homeData.heroSecondary]} />
      </div>

      <div className="page-shell page-shell--home">
        {homeData.sportRails.map((rail) => (
          <div key={rail.sport.slug} className="module-block">
            <SportSpotlightRail sport={rail.sport} articles={rail.articles} />
          </div>
        ))}

        {homeData.quickHits ? (
          <div className="module-block">
            <QuickHits block={homeData.quickHits} />
          </div>
        ) : null}
      </div>

      <div className="home-module-bleed">
        <FanZoneCta content={fanZone} poll={poll} />
      </div>

      <div className="page-shell page-shell--home">
        <section className="module-block">
          <SectionHeading title="Trending Stories" href="/search" />
          <div className="story-grid story-grid--tiles">
            {trendingArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="tile" />
            ))}
          </div>
        </section>
      </div>

      <RecommendedReads articles={recommendedArticles} />

      {homeData.featuredAuthors.length > 0 ? (
        <div className="page-shell page-shell--home">
          <section className="module-block">
            <SectionHeading title="Featured writers" href="/authors" />
            <div className="author-grid">
              {homeData.featuredAuthors.map((author) => (
                <AuthorSpotlight key={author.id} author={author} />
              ))}
            </div>
          </section>
        </div>
      ) : null}

      <div className="page-shell page-shell--home">
        <div className="module-block">
          <NewsletterSignup
            heading={homeData.newsletter.title}
            description={homeData.newsletter.heroCopy || homeData.newsletter.description}
            source="homepage"
          />
        </div>
      </div>
    </>
  );
}
