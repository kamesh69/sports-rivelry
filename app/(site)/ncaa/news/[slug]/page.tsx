import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsBySlug, getRelatedNews } from "@/services/ncaa-news.service";
import { buildBreadcrumbJsonLd, buildMetadata, type BreadcrumbItem } from "@/lib/seo";
import { getNcaaNewsPath, NCAA_PATH } from "@/lib/navigation";
import { JsonLd } from "@/components/json-ld";
import { NewsArticleDetail } from "@/components/ncaa/NewsArticleDetail";

export const revalidate = 60;

interface NcaaNewsArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NcaaNewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    return buildMetadata({
      title: "Story not found | The Sports Rivalry",
      description: "The requested NCAA story could not be found.",
      canonicalPath: getNcaaNewsPath(slug),
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${article.title} | NCAA | The Sports Rivalry`,
    description: article.summary,
    canonicalPath: getNcaaNewsPath(article.slug),
    ogImage: article.image,
  });
}

export default async function NcaaNewsArticlePage({ params }: NcaaNewsArticlePageProps) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = await getRelatedNews(article, 4);

  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: "NCAA", href: NCAA_PATH },
    { name: "News", href: `${NCAA_PATH}/news` },
    { name: article.title, href: getNcaaNewsPath(article.slug) },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <NewsArticleDetail article={article} related={related} />
    </>
  );
}
