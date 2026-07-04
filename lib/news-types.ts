/**
 * MLB News module — shared type contracts.
 *
 * Kept intentionally decoupled from the generic `Article` type (see
 * `lib/types.ts`). The News module has its own lightweight shape so the
 * service layer (`services/news.service.ts`) can be pointed at a real news
 * API later without reshaping data consumed elsewhere in the app.
 */
export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  category: string;
  image: string;
  featured: boolean;
  tags: string[];
}

export interface NewsCategory {
  id: string;
  label: string;
}

export type NewsSortOption = "latest" | "oldest" | "popular";

export interface NewsQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  sortBy?: NewsSortOption;
}

export interface NewsQueryResult {
  articles: NewsArticle[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
