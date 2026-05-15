import Link from "next/link";
import { getHomePageData } from "@/lib/cms";
import { ArticleCard } from "@/components/article-card";
import { AuthorSpotlight } from "@/components/author-spotlight";
import { AdSlot } from "@/components/ad-slot";
import { HomeHero } from "@/components/home-hero";
import { NewsletterBand } from "@/components/newsletter-band";
import { SectionHeading } from "@/components/section-heading";

export const revalidate = 60;

export default async function HomePage() {
  const homeData = await getHomePageData();

  return (
    <div className="page-shell page-shell--home">
      <section className="homepage-intro">
        <div>
          <span className="eyebrow">India-first sports newsroom</span>
          <h1>Fast editorial coverage shaped like a premium sports media home page.</h1>
        </div>
        <p>
          Sports Rivelry blends EssentiallySports-style narrative density with ESPN-inspired
          discoverability, dynamic hub pages, and search-ready publishing architecture.
        </p>
      </section>

      <HomeHero
        heroArticle={homeData.heroArticle}
        secondaryArticles={homeData.heroSecondary}
      />

      <div className="homepage-columns">
        <section>
          <SectionHeading
            eyebrow="Latest"
            title="The news river"
            description="Fresh stories rendered as crawlable HTML, ready for search and social distribution."
          />
          <div className="story-grid story-grid--two">
            {homeData.latestArticles.slice(0, 6).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        <aside className="sidebar-stack">
          <div className="sidebar-panel">
            <SectionHeading eyebrow="Trending" title="What readers are chasing" />
            <div className="story-stack">
              {homeData.trendingArticles.slice(0, 4).map((article) => (
                <ArticleCard key={article.id} article={article} variant="compact" />
              ))}
            </div>
          </div>
          <AdSlot label="Top right rail ad slot" />
        </aside>
      </div>

      {homeData.sportRails.map((rail) => (
        <section key={rail.sport.slug} className="module-block">
          <SectionHeading
            eyebrow={rail.sport.name}
            title={`${rail.sport.name} hub`}
            href={`/${rail.sport.slug}`}
            description={rail.sport.description}
          />
          <div className="story-grid story-grid--four">
            {rail.articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      ))}

      <section className="module-block">
        <SectionHeading eyebrow="Editors" title="Editor’s picks" />
        <div className="story-grid story-grid--four">
          {homeData.editorsPicks.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      <NewsletterBand issue={homeData.newsletter} />

      <section className="module-block">
        <SectionHeading
          eyebrow="Writers"
          title="Trust-building author identities"
          href="/authors"
          description="Author pages, expertise signals, and profile schema are built into the starter."
        />
        <div className="author-grid">
          {homeData.featuredAuthors.map((author) => (
            <AuthorSpotlight key={author.id} author={author} />
          ))}
        </div>
      </section>

      <section className="module-block module-block--trust">
        <SectionHeading
          eyebrow="SEO foundation"
          title="Launch-ready trust and newsroom operations"
          description="Static trust pages reinforce author credibility, corrections policy, editorial standards, and newsroom contact signals."
        />
        <div className="trust-link-grid">
          <Link href="/about">About Sports Rivelry</Link>
          <Link href="/editorial-guidelines">Editorial Guidelines</Link>
          <Link href="/corrections">Corrections Policy</Link>
          <Link href="/contact">Contact the newsroom</Link>
        </div>
      </section>
    </div>
  );
}
