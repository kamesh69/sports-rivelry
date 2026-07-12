import type { NewsQueryResult } from "@/lib/news-types";
import { MLB_NEWS_PATH } from "@/lib/navigation";
import { getNews } from "@/services/news.service";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NewsHeader } from "@/components/news/NewsHeader";
import { NewsList } from "@/components/news/NewsList";
import { NewsPagination } from "@/components/news/NewsPagination";
import { BrandStrip } from "@/components/brand-strip";
import type { BreadcrumbItem } from "@/lib/seo";

const PAGE_SIZE = 8;

const BREADCRUMB_ITEMS: BreadcrumbItem[] = [
  { name: "Home", href: "/" },
  { name: "Baseball", href: "/mlb" },
];

function buildPageHref(page: number) {
  return page <= 1 ? MLB_NEWS_PATH : `${MLB_NEWS_PATH}?page=${page}`;
}

interface MlbNewsPageProps {
  result: NewsQueryResult;
}

export function MlbNewsPage({ result }: MlbNewsPageProps) {
  return (
    <div className="sport-theme mn-page">
      <div className="mn-shell">
        <Breadcrumbs items={BREADCRUMB_ITEMS} />

        <NewsHeader title="More On Baseball" />

        <NewsList articles={result.articles} loading={false} skeletonCount={PAGE_SIZE} />
        <NewsPagination
          currentPage={result.page}
          totalPages={result.totalPages}
          buildHref={buildPageHref}
        />
      </div>

      <BrandStrip />
    </div>
  );
}

export async function MlbNewsPageLoader({ page = 1 }: { page?: number }) {
  const initialResult = await getNews({ page, pageSize: PAGE_SIZE });

  return <MlbNewsPage result={initialResult} />;
}
