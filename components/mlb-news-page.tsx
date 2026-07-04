"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { NewsArticle, NewsCategory, NewsQueryResult, NewsSortOption } from "@/lib/news-types";
import { getCategories, getNews } from "@/services/news.service";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NewsHeader } from "@/components/news/NewsHeader";
import { NewsFilters } from "@/components/news/NewsFilters";
import { NewsList } from "@/components/news/NewsList";
import { NewsPagination } from "@/components/news/NewsPagination";
import { NewsErrorState } from "@/components/news/NewsErrorState";
import type { BreadcrumbItem } from "@/lib/seo";

const PAGE_SIZE = 8;

const BREADCRUMB_ITEMS: BreadcrumbItem[] = [
  { name: "Home", href: "/" },
  { name: "Baseball", href: "/mlb" },
];

interface MlbNewsPageProps {
  initialResult: NewsQueryResult;
  initialCategories: NewsCategory[];
}

/**
 * MLB News listing page ("Featured Stories → View All" destination).
 *
 * Data fetching is delegated entirely to `services/news.service.ts`, so this
 * component owns UI/state only — swapping the mock service for a real API
 * later requires no changes here.
 */
export function MlbNewsPage({ initialResult, initialCategories }: MlbNewsPageProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState<NewsSortOption>("latest");
  const [page, setPage] = useState(1);

  const [result, setResult] = useState<NewsQueryResult>(initialResult);
  const [categories] = useState<NewsCategory[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFirstRun = useRef(true);
  const requestId = useRef(0);

  const loadNews = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setError(null);

    try {
      const response = await getNews({ page, pageSize: PAGE_SIZE, search, category, sortBy });
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
  }, [page, search, category, sortBy]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    loadNews();
  }, [loadNews]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setCategory(value);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((value: NewsSortOption) => {
    setSortBy(value);
    setPage(1);
  }, []);

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

        <NewsFilters
          search={search}
          onSearchChange={handleSearchChange}
          categories={categories}
          category={category}
          onCategoryChange={handleCategoryChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          resultCount={result.total}
        />

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

        <p className="mn-back">
          <Link href="/mlb" className="mn-back__link">
            ← Back to MLB
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ── Server-side data loader wrapper ─────────────────────────
   Fetches the first page on the server (fast first paint, SEO-friendly),
   then hands off to the client component for interactive filtering.
──────────────────────────────────────────────────────────── */
export async function MlbNewsPageLoader() {
  const [initialResult, initialCategories] = await Promise.all([
    getNews({ page: 1, pageSize: PAGE_SIZE }),
    getCategories(),
  ]);

  return <MlbNewsPage initialResult={initialResult} initialCategories={initialCategories} />;
}
