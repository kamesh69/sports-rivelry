import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getArticlesForCollection,
  getLandingPage,
  getSportHub,
  getSportHubPageData,
  getSportPageData,
  getLatestNews,
  getTrendingNews,
} from "@/lib/cms";
import { landingPages, sportHubs } from "@/lib/mock-data";
import { buildBreadcrumbJsonLd, buildMetadata, type BreadcrumbItem } from "@/lib/seo";
import { ArticleCard } from "@/components/article-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { SportHubShowcase } from "@/components/sport-hub-showcase";
import { SportLeaguePage } from "@/components/sport-page/sport-league-page";

export const revalidate = 60;

const FULL_SPORT_HUB_SLUGS = new Set(["mlb", "basketball", "golf", "nascar", "football"]);

interface PrimaryPageProps {
  params: Promise<{
    primary: string;
  }>;
}

export async function generateStaticParams() {
  return [
    ...sportHubs.map((sport) => ({ primary: sport.slug })),
    ...landingPages.map((page) => ({ primary: page.slug })),
  ];
}

export async function generateMetadata({
  params,
}: PrimaryPageProps): Promise<Metadata> {
  const { primary } = await params;
  const sportHub = await getSportHub(primary);

  if (sportHub) {
    return buildMetadata(sportHub.seo);
  }

  const landingPage = await getLandingPage(primary);

  if (landingPage) {
    return buildMetadata(landingPage.seo);
  }

  return buildMetadata({
    title: "Not found | The Sports Rivalry",
    description: "The requested page could not be found.",
    canonicalPath: `/${primary}`,
    noIndex: true,
  });
}

export default async function PrimaryPage({ params }: PrimaryPageProps) {
  const { primary } = await params;
  const sportHub = await getSportHub(primary);

  if (sportHub) {
    if (FULL_SPORT_HUB_SLUGS.has(sportHub.slug)) {
      const hubPageData = await getSportHubPageData(sportHub.slug);
      const breadcrumbs: BreadcrumbItem[] = [
        { name: "Home", href: "/" },
        { name: sportHub.name, href: `/${sportHub.slug}` },
      ];

      if (hubPageData) {
        return (
          <>
            <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
            <SportLeaguePage
              hub={sportHub}
              data={hubPageData.sportPageData}
              articles={hubPageData.featuredStories}
              trending={hubPageData.trendingStories}
              featuredStories={hubPageData.featuredStories}
              headlines={hubPageData.headlines}
              latestStories={hubPageData.latestStories}
              trendingStories={hubPageData.trendingStories}
            />
          </>
        );
      }
    }

    const sportPageData = await getSportPageData(sportHub.slug);
    const breadcrumbs: BreadcrumbItem[] = [
      { name: "Home", href: "/" },
      { name: sportHub.name, href: `/${sportHub.slug}` },
    ];

    if (sportPageData) {
      const [latestStories, trendingArticles] = await Promise.all([
        getLatestNews(sportHub.slug, 80),
        getTrendingNews(sportHub.slug, 40),
      ]);

      return (
        <>
          <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
          <SportLeaguePage
            hub={sportHub}
            data={sportPageData}
            articles={latestStories}
            trending={trendingArticles}
          />
        </>
      );
    }

    const heroStories = await getArticlesForCollection(sportHub.featuredArticleSlugs);
    const editorsPicks = await getArticlesForCollection(sportHub.editorsPickSlugs);
    const latestStories = await getLatestNews(sportHub.slug, 80);

    return (
      <div className="page-shell page-shell--detail">
        <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
        <Breadcrumbs items={breadcrumbs} />
        <SportHubShowcase
          hub={sportHub}
          heroStories={heroStories}
          latestStories={latestStories}
          editorsPicks={editorsPicks}
        />
      </div>
    );
  }

  const landingPage = await getLandingPage(primary);

  if (!landingPage) {
    notFound();
  }

  const heroStories = await getArticlesForCollection([
    landingPage.heroArticleSlug,
    ...landingPage.articleSlugs,
  ]);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: landingPage.title, href: `/${landingPage.slug}` },
  ];

  return (
    <div className="page-shell page-shell--detail">
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <Breadcrumbs items={breadcrumbs} />
      <section className="hub-hero hub-hero--event">
        <span className="eyebrow">{landingPage.kicker}</span>
        <h1>{landingPage.title}</h1>
        <p>{landingPage.description}</p>
      </section>

      <section className="module-block">
        <SectionHeading
          eyebrow="Evergreen hub"
          title="High-intent search coverage"
          description="This template is built for World Cup, Olympics, and tournament landing pages that mix manual hero slots with rolling news."
        />
        <div className="story-grid story-grid--three">
          {heroStories.map((article, index) => (
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
