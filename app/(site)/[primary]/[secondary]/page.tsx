import {
  getArticlesForCollection,
  getArticle,
  getRelatedStories,
  resolveSportDetail,
} from "@/lib/cms";
import { articles, leagueHubs } from "@/lib/mock-data";
import {
  buildArticleJsonLd,
  buildArticleMetadata,
  buildBreadcrumbJsonLd,
  buildMetadata,
  type BreadcrumbItem,
} from "@/lib/seo";
import { ArticleAuthorCard } from "@/components/article-author-card";
import { ArticleBody } from "@/components/article-body";
import { ArticleBrandBanner } from "@/components/article-brand-banner";
import { ArticleCard } from "@/components/article-card";
import { ArticleEssentials } from "@/components/article-essentials";
import { ArticleHeader } from "@/components/article-header";
import { ArticleHeroImage } from "@/components/article-hero-image";
import { ArticleMoreGrid } from "@/components/article-more-grid";
import { ArticleReactionRow } from "@/components/article-reaction-row";
import { ArticleSidebar } from "@/components/article-sidebar";
import { ArticleTopics } from "@/components/article-topics";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { MlbStatsPage } from "@/components/mlb-stats-page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface SportDetailPageProps {
  params: Promise<{
    primary: string;
    secondary: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { primary: "mlb", secondary: "stats" },
    ...articles.map((article) => ({
      primary: article.sport.slug,
      secondary: article.slug,
    })),
    ...leagueHubs.map((league) => ({
      primary: league.sport.slug,
      secondary: league.slug,
    })),
  ];
}

export async function generateMetadata({
  params,
}: SportDetailPageProps): Promise<Metadata> {
  const { primary, secondary } = await params;

  if (primary === "mlb" && secondary === "stats") {
    return buildMetadata({
      title: "MLB Player Stats 2026 — Batting, Pitching & Fielding | Sports Rivalry",
      description: "Full MLB player statistics for the 2026 season including batting averages, ERA, pitching records, and fielding metrics for every player.",
      canonicalPath: "/mlb/stats",
    });
  }

  const resolved = await resolveSportDetail(primary, secondary);

  if (!resolved) {
    return buildMetadata({
      title: "Not found | Sports Rivalry",
      description: "The requested page could not be found.",
      canonicalPath: `/${primary}/${secondary}`,
      noIndex: true,
    });
  }

  if (resolved.type === "league") {
    return buildMetadata(resolved.league.seo);
  }

  const article = await getArticle(primary, secondary);

  if (!article) {
    return buildMetadata({
      title: "Not found | Sports Rivalry",
      description: "The requested page could not be found.",
      canonicalPath: `/${primary}/${secondary}`,
      noIndex: true,
    });
  }

  return buildArticleMetadata(article);
}

export default async function SportDetailPage({ params }: SportDetailPageProps) {
  const { primary, secondary } = await params;

  /* ── MLB stats page ─────────────────────────────── */
  if (primary === "mlb" && secondary === "stats") {
    const breadcrumbs: BreadcrumbItem[] = [
      { name: "Home", href: "/" },
      { name: "MLB", href: "/mlb" },
      { name: "Stats", href: "/mlb/stats" },
    ];
    return (
      <>
        <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
        <MlbStatsPage />
      </>
    );
  }

  const resolved = await resolveSportDetail(primary, secondary);

  if (!resolved) {
    notFound();
  }

  if (resolved.type === "league") {
    const stories = await getArticlesForCollection(resolved.league.articleSlugs);
    const breadcrumbs: BreadcrumbItem[] = [
      { name: "Home", href: "/" },
      { name: resolved.league.sport.name, href: `/${resolved.league.sport.slug}` },
      {
        name: resolved.league.name,
        href: `/${resolved.league.sport.slug}/${resolved.league.slug}`,
      },
    ];

    return (
      <div className="page-shell page-shell--detail">
        <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
        <Breadcrumbs items={breadcrumbs} />
        <section className="hub-hero">
          <span className="eyebrow">{resolved.league.seasonLabel}</span>
          <h1>{resolved.league.name}</h1>
          <p>{resolved.league.description}</p>
        </section>
        <section className="module-block">
          <SectionHeading eyebrow="League hub" title={`${resolved.league.name} coverage`} />
          <div className="story-grid story-grid--three">
            {stories.map((article, index) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant={index === 0 ? "hero" : "feature"}
              />
            ))}
          </div>
        </section>
      </div>
    );
  }

  const article = await getArticle(primary, secondary);

  if (!article) {
    notFound();
  }

  const relatedStories = await getRelatedStories(article);

  return (
    <div className="page-shell page-shell--article">
      <JsonLd data={buildArticleJsonLd(article)} />
      <article className="article-page">
        <ArticleHeader article={article} />
        <div className="article-page__grid">
          <div className="article-page__main">
            <ArticleHeroImage
              image={article.featuredImage}
              sharePath={article.seo.canonicalPath}
              shareTitle={article.title}
            />
            <ArticleBody html={article.bodyHtml} />
            {article.essentials?.length ? (
              <ArticleEssentials items={article.essentials} />
            ) : null}
          </div>
          <ArticleSidebar
            nextStory={relatedStories[0]}
            recommended={relatedStories.slice(1, 4)}
          />
        </div>
        <div className="article-page__modules">
          <ArticleTopics article={article} />
          <ArticleReactionRow />
          {article.authors[0] ? <ArticleAuthorCard author={article.authors[0]} /> : null}
          <ArticleMoreGrid sport={article.sport} articles={relatedStories.slice(0, 4)} />
        </div>
        <ArticleBrandBanner />
      </article>
    </div>
  );
}
