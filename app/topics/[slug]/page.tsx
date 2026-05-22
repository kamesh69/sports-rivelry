import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticlesForCollection, getTopicHub } from "@/lib/cms";
import { buildBreadcrumbJsonLd, buildMetadata, type BreadcrumbItem } from "@/lib/seo";
import { ArticleCard } from "@/components/article-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";

interface TopicPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getTopicHub(slug);

  if (!topic) {
    return buildMetadata({
      title: "Not found | Sports Rivalry",
      description: "The requested page could not be found.",
      canonicalPath: `/topics/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata(topic.seo);
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = await getTopicHub(slug);

  if (!topic) {
    notFound();
  }

  const stories = await getArticlesForCollection(topic.articleSlugs);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: "Topics", href: "/topics" },
    { name: topic.title, href: `/topics/${topic.slug}` },
  ];

  return (
    <div className="page-shell page-shell--detail">
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <Breadcrumbs items={breadcrumbs} />
      <section className="hub-hero">
        <span className="eyebrow">Topic hub</span>
        <h1>{topic.title}</h1>
        <p>{topic.description}</p>
      </section>
      <section className="module-block">
        <SectionHeading title={`${topic.title} coverage`} />
        <div className="story-grid story-grid--three">
          {stories.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
