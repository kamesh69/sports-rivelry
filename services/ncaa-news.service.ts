import { NCAA_NEWS_ARTICLES } from "@/lib/ncaa-data";
import type { NcaaNewsArticle } from "@/lib/ncaa-types";
import { sortByPublishedAt } from "@/lib/utils";

/**
 * NCAA news data access layer.
 *
 * Named separately from `services/news.service.ts` (which is scoped to the
 * MLB news module and its own `lib/news-types.ts` shape) to keep the two
 * sports' content models independent while following the same conventions.
 */

export async function getFeaturedStories(limit = 5): Promise<NcaaNewsArticle[]> {
  const featured = NCAA_NEWS_ARTICLES.filter((article) => article.featured);
  const pool = featured.length ? featured : NCAA_NEWS_ARTICLES;
  return sortByPublishedAt(pool).slice(0, limit);
}

export async function getLatestNews(limit = 6): Promise<NcaaNewsArticle[]> {
  return sortByPublishedAt(NCAA_NEWS_ARTICLES).slice(0, limit);
}

export async function getNewsBySlug(slug: string): Promise<NcaaNewsArticle | undefined> {
  return NCAA_NEWS_ARTICLES.find((article) => article.slug === slug);
}

export async function getRelatedNews(
  article: NcaaNewsArticle,
  limit = 4,
): Promise<NcaaNewsArticle[]> {
  const rest = NCAA_NEWS_ARTICLES.filter((candidate) => candidate.id !== article.id);
  return sortByPublishedAt(rest).slice(0, limit);
}
