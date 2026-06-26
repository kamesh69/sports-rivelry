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
import { ArticleAuthorCard } from "@/components/article-author-card";
import { ArticleBody } from "@/components/article-body";
import { ArticleCard } from "@/components/article-card";
import { ArticleMoreRail } from "@/components/article-more-rail";
import { ArticleReactionRow } from "@/components/article-reaction-row";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArticleShareBar } from "@/components/article-share-bar";
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
        <div className="article-media">
          <Image
            src={article.featuredImage.src}
            alt={article.featuredImage.alt}
            width={article.featuredImage.width}
            height={article.featuredImage.height}
            priority
          />
          {article.featuredImage.credit ? (
            <span className="article-media__credit">{article.featuredImage.credit}</span>
          ) : null}
        </div>

        <header className="article-header">
          <div className="article-header__meta">
            <span className="eyebrow">{article.sport.name}</span>
            {article.league ? <span className="tag-chip">{article.league.name}</span> : null}
          </div>
          <h1>{article.title}</h1>
          <div className="article-byline">
            <span>{article.authors.map((author) => author.name).join(", ")}</span>
            <span>{formatDateTime(article.publishedAt)}</span>
            <span>{article.readTime} min read</span>
          </div>
          <ArticleShareBar path={article.seo.canonicalPath} title={article.title} />
          <p className="article-deck">{article.deck}</p>
        </header>

        <div className="article-main article-main--stacked">
          <div className="article-main__body article-main__body--feature">
            <ArticleBody html={article.bodyHtml} />
            <div className="article-topic-strip">
              <span>{article.sport.name}</span>
              {article.league ? <span>{article.league.name}</span> : null}
              {article.tags.slice(0, 4).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <ArticleReactionRow />
            <ArticleAuthorCard author={article.authors[0]} />
          </div>

          <ArticleMoreRail
              title={`More stories from ${article.league?.name || article.sport.name}`}
            articles={relatedStories}
          />
        </div>
      </article>
    </div>
  );
}
