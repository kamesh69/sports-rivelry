import Link from "next/link";
import { getHomePageData } from "@/lib/cms";
import { ArticleCard } from "@/components/article-card";
import { AuthorSpotlight } from "@/components/author-spotlight";
import { NewsletterBand } from "@/components/newsletter-band";
import { QuickHits } from "@/components/quick-hits";
import { SectionHeading } from "@/components/section-heading";

export const revalidate = 60;

export default async function HomePage() {
  const homeData = await getHomePageData();

  return (
    <div className="page-shell page-shell--home">
      <section className="module-block">
        <SectionHeading title="Latest News" />
        <div className="story-grid story-grid--latest">
          {homeData.latestArticles.slice(0, 6).map((article) => (
            <ArticleCard key={article.id} article={article} variant="headline" />
          ))}
        </div>
      </section>

      {homeData.quickHits ? (
        <section className="module-block module-block--quick-hits">
          <QuickHits block={homeData.quickHits} />
        </section>
      ) : null}

      <section className="module-block">
        <SectionHeading eyebrow="Trending" title="What readers are chasing" />
        <div className="story-grid story-grid--tiles">
          {homeData.trendingArticles.slice(0, 4).map((article) => (
            <ArticleCard key={article.id} article={article} variant="tile" />
          ))}
        </div>
      </section>

      {homeData.sportRails.map((rail) => (
        <section key={rail.sport.slug} className="module-block">
          <SectionHeading
            eyebrow={rail.sport.name}
            title={`${rail.sport.name} hub`}
            href={`/${rail.sport.slug}`}
            description={rail.sport.description}
          />
          <div className="story-grid story-grid--tiles">
            {rail.articles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="tile" />
            ))}
          </div>
        </section>
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
          <Link href="/about">About Sports Rivalry</Link>
          <Link href="/editorial-guidelines">Editorial Guidelines</Link>
          <Link href="/corrections">Corrections Policy</Link>
          <Link href="/contact">Contact the newsroom</Link>
        </div>
      </section>
    </div>
  );
}
