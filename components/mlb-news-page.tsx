"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { NewsArticle, NewsQueryResult } from "@/lib/news-types";
import { getNews } from "@/services/news.service";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NewsHeader } from "@/components/news/NewsHeader";
import { NewsList } from "@/components/news/NewsList";
import { NewsPagination } from "@/components/news/NewsPagination";
import { NewsErrorState } from "@/components/news/NewsErrorState";
import { BrandStrip } from "@/components/brand-strip";
import type { BreadcrumbItem } from "@/lib/seo";

const PAGE_SIZE = 8;

const BREADCRUMB_ITEMS: BreadcrumbItem[] = [
  { name: "Home", href: "/" },
  { name: "Baseball", href: "/mlb" },
];

interface MlbNewsPageProps {
  initialResult: NewsQueryResult;
}

/**
 * MLB News listing page ("Featured Stories → View All" destination).
 *
 * Data fetching is delegated entirely to `services/news.service.ts`, so this
 * component owns UI/state only — swapping the mock service for a real API
 * later requires no changes here.
 */
export function MlbNewsPage({ initialResult }: MlbNewsPageProps) {
  const [page, setPage] = useState(1);

  const [result, setResult] = useState<NewsQueryResult>(initialResult);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFirstRun = useRef(true);
  const requestId = useRef(0);

  const loadNews = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setError(null);

    try {
      const response = await getNews({ page, pageSize: PAGE_SIZE });
      if (currentRequest === requestId.current) {
        setResult(response);
      }
    } catch {
      if (currentRequest === requestId.current) {
        setError("We couldn't load MLB news right now.");
      }
    } finally {
      if (currentRequest === requestId.current) {
        setLoading(false);
      }
    }
  }, [page]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    loadNews();
  }, [loadNews]);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setPage(Math.min(Math.max(1, nextPage), result.totalPages));
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [result.totalPages],
  );

  const articles: NewsArticle[] = useMemo(() => result.articles, [result.articles]);

  return (
    <div className="sport-theme mn-page">
      <div className="mn-shell">
        <Breadcrumbs items={BREADCRUMB_ITEMS} />

        <NewsHeader title="More On Baseball" />

        {error ? (
          <NewsErrorState message={error} onRetry={loadNews} />
        ) : (
          <>
            <NewsList articles={articles} loading={loading} skeletonCount={PAGE_SIZE} />
            <NewsPagination
              currentPage={result.page}
              totalPages={result.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      <BrandStrip />
    </div>
  );
}

/* ── Server-side data loader wrapper ─────────────────────────
   Fetches the first page on the server (fast first paint, SEO-friendly),
   then hands off to the client component for pagination.
──────────────────────────────────────────────────────────── */
export async function MlbNewsPageLoader() {
  const initialResult = await getNews({ page: 1, pageSize: PAGE_SIZE });

  return <MlbNewsPage initialResult={initialResult} />;
}
