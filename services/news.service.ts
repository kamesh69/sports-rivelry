import { NEWS_ARTICLES, NEWS_CATEGORIES } from "@/lib/news-data";
import type {
  NewsArticle,
  NewsCategory,
  NewsQueryParams,
  NewsQueryResult,
  NewsSortOption,
} from "@/lib/news-types";

/**
 * News data access layer.
 *
 * This module is the single place that knows *how* MLB news is fetched.
 * Today it reads from the local mock dataset in `lib/news-data.ts`; when a
 * real CMS/API is wired up, only the bodies of these functions need to
 * change — every consumer (pages, components) keeps calling the same
 * functions with the same shapes. Mirrors the pattern already established
 * by `services/team.service.ts` and `services/player.service.ts`.
 */

const DEFAULT_PAGE_SIZE = 8;

/** Deterministic pseudo-popularity so "Most Popular" sorting is stable without a real metrics backend. */
function popularityScore(article: NewsArticle): number {
  let hash = 0;
  for (let i = 0; i < article.id.length; i++) {
    hash = (hash * 31 + article.id.charCodeAt(i)) >>> 0;
  }
  return hash % 1000;
}

function matchesSearch(article: NewsArticle, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  return (
    article.title.toLowerCase().includes(q) ||
    article.summary.toLowerCase().includes(q) ||
    article.author.toLowerCase().includes(q) ||
    article.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

function sortArticles(articles: NewsArticle[], sortBy: NewsSortOption): NewsArticle[] {
  const sorted = [...articles];

  if (sortBy === "oldest") {
    return sorted.sort(
      (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime(),
    );
  }

  if (sortBy === "popular") {
    return sorted.sort((a, b) => popularityScore(b) - popularityScore(a));
  }

  return sorted.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

/** Returns every article flagged as a featured MLB story. */
export async function getFeaturedStories(limit = 4): Promise<NewsArticle[]> {
  const featured = NEWS_ARTICLES.filter((article) => article.featured);
  const pool = featured.length ? featured : NEWS_ARTICLES;
  return sortArticles(pool, "latest").slice(0, limit);
}

/** Returns a paginated, filtered, sorted slice of MLB news for the listing page. */
export async function getNews(params: NewsQueryParams = {}): Promise<NewsQueryResult> {
  const {
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    search = "",
    category = "all",
    sortBy = "latest",
  } = params;

  const filtered = NEWS_ARTICLES.filter(
    (article) =>
      (category === "all" || article.category === category) && matchesSearch(article, search),
  );

  const sorted = sortArticles(filtered, sortBy);
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    articles: sorted.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

/** Resolves a single article by its URL slug. */
export async function getNewsBySlug(slug: string): Promise<NewsArticle | undefined> {
  return NEWS_ARTICLES.find((article) => article.slug === slug);
}

/** Full-text search across title, summary, author, and tags. */
export async function searchNews(query: string, limit = 20): Promise<NewsArticle[]> {
  const matches = NEWS_ARTICLES.filter((article) => matchesSearch(article, query));
  return sortArticles(matches, "latest").slice(0, limit);
}

/** Returns the available filter categories, "All" first. */
export async function getCategories(): Promise<NewsCategory[]> {
  return NEWS_CATEGORIES;
}

/** Returns a handful of related stories for the article detail page. */
export async function getRelatedNews(article: NewsArticle, limit = 4): Promise<NewsArticle[]> {
  const sameCategory = NEWS_ARTICLES.filter(
    (candidate) => candidate.id !== article.id && candidate.category === article.category,
  );
  const pool = sameCategory.length >= limit ? sameCategory : NEWS_ARTICLES.filter((c) => c.id !== article.id);
  return sortArticles(pool, "latest").slice(0, limit);
}
