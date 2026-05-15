import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
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
import { formatDateTime } from "@/lib/utils";
import { AdSlot } from "@/components/ad-slot";
import { ArticleBody } from "@/components/article-body";
import { ArticleCard } from "@/components/article-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";

export const revalidate = 60;

interface SportDetailPageProps {
  params: Promise<{
    primary: string;
    secondary: string;
  }>;
}

export async function generateStaticParams() {
  return [
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
  const resolved = await resolveSportDetail(primary, secondary);

  if (!resolved) {
    return buildMetadata({
      title: "Not found | Sports Rivelry",
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
      title: "Not found | Sports Rivelry",
      description: "The requested page could not be found.",
      canonicalPath: `/${primary}/${secondary}`,
      noIndex: true,
    });
  }

  return buildArticleMetadata(article);
}

export default async function SportDetailPage({ params }: SportDetailPageProps) {
  const { primary, secondary } = await params;
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
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: article.sport.name, href: `/${article.sport.slug}` },
  ];

  if (article.league) {
    breadcrumbs.push({
      name: article.league.name,
      href: `/${article.sport.slug}/${article.league.slug}`,
    });
  }

  breadcrumbs.push({
    name: article.title,
    href: `/${article.sport.slug}/${article.slug}`,
  });

  return (
    <div className="page-shell page-shell--article">
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={buildArticleJsonLd(article)} />
      <Breadcrumbs items={breadcrumbs} />

      <article className="article-layout">
        <header className="article-header">
          <div className="article-header__meta">
            <span className="eyebrow">{article.sport.name}</span>
            {article.league ? <span className="tag-chip">{article.league.name}</span> : null}
          </div>
          <h1>{article.title}</h1>
          <p className="article-deck">{article.deck}</p>
          <div className="article-byline">
            <span>{article.authors.map((author) => author.name).join(", ")}</span>
            <span>{formatDateTime(article.publishedAt)}</span>
            <span>{article.readTime} min read</span>
          </div>
        </header>

        <div className="article-media">
          <Image
            src={article.featuredImage.src}
            alt={article.featuredImage.alt}
            width={article.featuredImage.width}
            height={article.featuredImage.height}
            priority
          />
        </div>

        <div className="article-main">
          <div className="article-main__body">
            <ArticleBody html={article.bodyHtml} />
            <div className="topic-row">
              {article.tags.map((tag) => (
                <span key={tag} className="tag-chip tag-chip--muted">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <aside className="article-main__aside">
            <div className="sidebar-panel">
              <SectionHeading eyebrow="Related" title="From this beat" />
              <div className="story-stack">
                {relatedStories.map((story) => (
                  <ArticleCard key={story.id} article={story} variant="compact" />
                ))}
              </div>
            </div>
            <AdSlot label="In-article sidebar ad slot" />
          </aside>
        </div>
      </article>
    </div>
  );
}
