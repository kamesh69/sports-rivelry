import Link from "next/link";
import { getHomePageData } from "@/lib/cms";
import { ArticleCard } from "@/components/article-card";
import { CategoryStrip } from "@/components/category-strip";
import { HomeFeatureGrid } from "@/components/home-feature-grid";
import { HomeHero } from "@/components/home-hero";
import { LatestNewsRail } from "@/components/latest-news-rail";
import { NewsletterBand } from "@/components/newsletter-band";
import { SportSpotlightRail } from "@/components/sport-spotlight-rail";
import { SectionHeading } from "@/components/section-heading";

export const revalidate = 60;

export default async function HomePage() {
  const homeData = await getHomePageData();

  return (
    <>
      <div className="home-topper">
        <div className="page-shell page-shell--home">
          <LatestNewsRail articles={homeData.latestArticles.slice(0, 8)} />
          <HomeFeatureGrid
            featured={homeData.heroArticle}
            sideArticles={homeData.heroSecondary}
            headlines={[...homeData.topHeadlines, ...homeData.trendingArticles]}
          />
        </div>
      </div>

      <div className="home-hero-bleed">
        <HomeHero slides={[homeData.heroArticle, ...homeData.heroSecondary]} />
      </div>

      <div className="page-shell page-shell--home">
        <CategoryStrip items={homeData.categoryStrip} />

        <section className="module-block">
          <SectionHeading eyebrow="Trending" title="What readers are chasing" />
          <div className="story-grid story-grid--tiles">
            {homeData.trendingArticles.slice(0, 4).map((article) => (
              <ArticleCard key={article.id} article={article} variant="tile" />
            ))}
          </div>
        </section>

        {homeData.sportRails.map((rail) => (
          <div key={rail.sport.slug} className="module-block">
            <SportSpotlightRail sport={rail.sport} articles={rail.articles} />
          </div>
        ))}

        <section className="module-block">
          <SectionHeading eyebrow="Editors" title="Editor’s picks" />
          <div className="story-grid story-grid--tiles">
            {homeData.editorsPicks.map((article) => (
              <ArticleCard key={article.id} article={article} variant="tile" />
            ))}
          </div>
        </section>

        <NewsletterBand issue={homeData.newsletter} />

        <section className="module-block module-block--trust">
          <SectionHeading
            eyebrow="Newsroom"
            title="How the rivalry desk works"
            description="Trust pages, author records, and corrections standards stay available without interrupting the front-page energy."
          />
          <div className="trust-link-grid">
            <Link href="/about">About Sports Rivalry</Link>
            <Link href="/editorial-guidelines">Editorial Guidelines</Link>
            <Link href="/corrections">Corrections Policy</Link>
            <Link href="/contact">Contact the newsroom</Link>
          </div>
        </section>
      </div>
    </>
  );
}
