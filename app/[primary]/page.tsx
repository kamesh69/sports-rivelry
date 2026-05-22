import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticlesForCollection, getLandingPage, getSportHub, getLatestNews } from "@/lib/cms";
import { landingPages, sportHubs } from "@/lib/mock-data";
import { buildBreadcrumbJsonLd, buildMetadata, type BreadcrumbItem } from "@/lib/seo";
import { ArticleCard } from "@/components/article-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";

export const revalidate = 60;

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
    title: "Not found | Sports Rivalry",
    description: "The requested page could not be found.",
    canonicalPath: `/${primary}`,
    noIndex: true,
  });
}

export default async function PrimaryPage({ params }: PrimaryPageProps) {
  const { primary } = await params;
  const sportHub = await getSportHub(primary);

  if (sportHub) {
    const heroStories = await getArticlesForCollection(sportHub.featuredArticleSlugs);
    const editorsPicks = await getArticlesForCollection(sportHub.editorsPickSlugs);
    const latestStories = (await getLatestNews()).filter(
      (article) => article.sport.slug === sportHub.slug,
    );
    const breadcrumbs: BreadcrumbItem[] = [
      { name: "Home", href: "/" },
      { name: sportHub.name, href: `/${sportHub.slug}` },
    ];

    return (
      <div className="page-shell page-shell--detail">
        <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
        <Breadcrumbs items={breadcrumbs} />
        <section className="hub-hero" style={{ ["--hub-accent" as string]: sportHub.accent }}>
          <span className="eyebrow">Sport hub</span>
          <h1>{sportHub.name}</h1>
          <p>{sportHub.description}</p>
          <div className="tag-row">
            {sportHub.leagueSlugs.map((slug) => (
              <Link key={slug} href={`/${sportHub.slug}/${slug}`} className="tag-chip">
                {slug.replace(/-/g, " ")}
              </Link>
            ))}
          </div>
        </section>

        <section className="module-block">
          <SectionHeading eyebrow="Lead" title={`${sportHub.name} top stories`} />
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

        <section className="module-block">
          <SectionHeading eyebrow="Latest" title={`${sportHub.name} news river`} />
          <div className="story-grid story-grid--three">
            {latestStories.slice(0, 6).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        {editorsPicks.length ? (
          <section className="module-block">
            <SectionHeading eyebrow="Editors" title={`${sportHub.name} picks`} />
            <div className="story-grid story-grid--three">
              {editorsPicks.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        ) : null}
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
          description="This template is built for IPL, World Cup, Olympics, and tournament landing pages that mix manual hero slots with rolling news."
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
