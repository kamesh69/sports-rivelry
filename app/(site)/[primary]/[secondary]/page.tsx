import {
  getArticlesForCollection,
  getArticle,
  getAllLeaguePaths,
  getRelatedStories,
  resolveSportDetail,
} from "@/lib/cms";
import { articles } from "@/lib/mock-data";
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
import { MlbStatsPageLoader } from "@/components/mlb-stats-page-loader";
import { MlbTeamsPageLoader } from "@/components/mlb-teams-page-loader";
import { MlbNewsPageLoader } from "@/components/mlb-news-page";
import { MLB_NEWS_PATH } from "@/lib/navigation";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface SportDetailPageProps {
  params: Promise<{
    primary: string;
    secondary: string;
  }>;
  searchParams?: Promise<{
    page?: string;
  }>;
}

export async function generateStaticParams() {
  const leaguePaths = await getAllLeaguePaths();

  return [
    { primary: "mlb", secondary: "stats" },
    { primary: "mlb", secondary: "teams" },
    { primary: "mlb", secondary: "news" },
    ...articles.map((article) => ({
      primary: article.sport.slug,
      secondary: article.slug,
    })),
    ...leaguePaths.map((path) => {
      const [, primary, secondary] = path.split("/");

      return { primary, secondary };
    }),
  ];
}

export async function generateMetadata({
  params,
}: SportDetailPageProps): Promise<Metadata> {
  const { primary, secondary } = await params;

  if (primary === "mlb" && secondary === "stats") {
    return buildMetadata({
      title: "MLB Player Stats 2026 — Batting, Pitching & Fielding | The Sports Rivalry",
      description: "Full MLB player statistics for the 2026 season including batting averages, ERA, pitching records, and fielding metrics for every player.",
      canonicalPath: "/mlb/stats",
    });
  }

  if (primary === "mlb" && secondary === "teams") {
    return buildMetadata({
      title: "MLB Teams Directory — All 30 Franchises | The Sports Rivalry",
      description: "Browse every Major League Baseball franchise. Discover team histories, championships, stadiums, divisions, and organizational information from one beautifully organized directory.",
      canonicalPath: "/mlb/teams",
    });
  }

  if (primary === "mlb" && secondary === "news") {
    return buildMetadata({
      title: "More On Baseball — MLB News | The Sports Rivalry",
      description: "The latest MLB headlines: trades, injuries, interviews, analysis, and more from around the league.",
      canonicalPath: MLB_NEWS_PATH,
    });
  }

  const resolved = await resolveSportDetail(primary, secondary);

  if (!resolved) {
    return buildMetadata({
      title: "Not found | The Sports Rivalry",
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
      title: "Not found | The Sports Rivalry",
      description: "The requested page could not be found.",
      canonicalPath: `/${primary}/${secondary}`,
      noIndex: true,
    });
  }

  return buildArticleMetadata(article);
}

export default async function SportDetailPage({
  params,
  searchParams,
}: SportDetailPageProps) {
  const { primary, secondary } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const archivePage = Math.max(1, Number(resolvedSearchParams.page || "1") || 1);

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
        <MlbStatsPageLoader />
      </>
    );
  }

  /* ── MLB teams directory ─────────────────────────── */
  if (primary === "mlb" && secondary === "teams") {
    const breadcrumbs: BreadcrumbItem[] = [
      { name: "Home", href: "/" },
      { name: "MLB", href: "/mlb" },
      { name: "Teams", href: "/mlb/teams" },
    ];
    return (
      <>
        <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
        <MlbTeamsPageLoader />
      </>
    );
  }

  /* ── MLB news listing ────────────────────────────── */
  if (primary === "mlb" && secondary === "news") {
    const breadcrumbs: BreadcrumbItem[] = [
      { name: "Home", href: "/" },
      { name: "Baseball", href: "/mlb" },
      { name: "News", href: MLB_NEWS_PATH },
    ];
    return (
      <>
        <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
        <MlbNewsPageLoader page={archivePage} />
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
