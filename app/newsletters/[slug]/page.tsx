import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticlesForCollection, getNewsletterIssue } from "@/lib/cms";
import { buildBreadcrumbJsonLd, buildMetadata, type BreadcrumbItem } from "@/lib/seo";
import { ArticleCard } from "@/components/article-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { NewsletterBand } from "@/components/newsletter-band";
import { SectionHeading } from "@/components/section-heading";

interface NewsletterPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: NewsletterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const issue = await getNewsletterIssue(slug);

  if (!issue) {
    return buildMetadata({
      title: "Not found | Sports Rivalry",
      description: "The requested page could not be found.",
      canonicalPath: `/newsletters/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata(issue.seo);
}

export default async function NewsletterPage({ params }: NewsletterPageProps) {
  const { slug } = await params;
  const issue = await getNewsletterIssue(slug);

  if (!issue) {
    notFound();
  }

  const stories = await getArticlesForCollection(issue.highlightedArticleSlugs);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: "Newsletters", href: "/newsletters" },
    { name: issue.title, href: `/newsletters/${issue.slug}` },
  ];

  return (
    <div className="page-shell page-shell--detail">
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <Breadcrumbs items={breadcrumbs} />
      <NewsletterBand issue={issue} />
      <section className="module-block">
        <SectionHeading title="Inside the briefing" />
        <div className="story-grid story-grid--three">
          {stories.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
