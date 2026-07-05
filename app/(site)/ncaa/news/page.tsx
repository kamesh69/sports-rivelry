import type { Metadata } from "next";
import { getLatestNews } from "@/services/ncaa-news.service";
import { buildBreadcrumbJsonLd, buildMetadata, type BreadcrumbItem } from "@/lib/seo";
import { NCAA_PATH } from "@/lib/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { NewsCard } from "@/components/ncaa/NewsCard";
import { NcaaEmptyState } from "@/components/ncaa/NcaaStateViews";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "NCAA News | The Sports Rivalry",
    description: "Every NCAA headline in one place — rivalries, recruiting, NIL, and more.",
    canonicalPath: `${NCAA_PATH}/news`,
  });
}

export default async function NcaaNewsIndexPage() {
  const articles = await getLatestNews(50);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: "NCAA", href: NCAA_PATH },
    { name: "News", href: `${NCAA_PATH}/news` },
  ];

  return (
    <div className="ncaa-page">
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <div className="ncaa-shell ncaa-index">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="ncaa-index__title">NCAA News</h1>

        {articles.length === 0 ? (
          <NcaaEmptyState message="No NCAA news yet. Check back soon." />
        ) : (
          <div className="ncaa-news-list ncaa-news-list--index">
            {articles.map((article, index) => (
              <NewsCard key={article.id} article={article} priority={index < 2} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
