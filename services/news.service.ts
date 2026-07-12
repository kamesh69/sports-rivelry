import {
  getArticle,
  getArticlesForSport,
  getMlbHubPageData,
  getRelatedStories,
} from "@/lib/cms";
import type { Article } from "@/lib/types";
import { stripHtml } from "@/lib/utils";
import type {
  NewsArticle,
  NewsCategory,
  NewsQueryParams,
  NewsQueryResult,
  NewsSortOption,
} from "@/lib/news-types";

const DEFAULT_PAGE_SIZE = 8;

function toNewsArticle(article: Article, featured = false): NewsArticle {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    summary: article.deck || article.excerpt,
    content: stripHtml(article.bodyHtml),
    author: article.authors[0]?.name || "Staff",
    publishedAt: article.publishedAt,
    category: article.league?.name || article.sport.name,
    image: article.featuredImage.src,
    featured,
    tags: article.tags,
  };
}

function toSortMode(sortBy: NewsSortOption): "date" | "trending" {
  return sortBy === "popular" ? "trending" : "date";
}

export async function getFeaturedStories(limit = 4): Promise<NewsArticle[]> {
  const mlbHubPageData = await getMlbHubPageData();
  const featuredStories =
    mlbHubPageData?.featuredStories.length
      ? mlbHubPageData.featuredStories
      : (await getArticlesForSport("mlb", { page: 1, pageSize: limit })).articles;

  return featuredStories.slice(0, limit).map((article) => toNewsArticle(article, true));
}

export async function getNews(params: NewsQueryParams = {}): Promise<NewsQueryResult> {
  const {
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    sortBy = "latest",
  } = params;
  const response = await getArticlesForSport("mlb", {
    page,
    pageSize,
    orderBy: toSortMode(sortBy),
  });

  return {
    articles: response.articles.map((article, index) =>
      toNewsArticle(article, index < 4 && response.page === 1),
    ),
    total: response.total,
    page: response.page,
    pageSize: response.pageSize,
    totalPages: response.totalPages,
  };
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | undefined> {
  const article = await getArticle("mlb", slug);
  return article ? toNewsArticle(article) : undefined;
}

export async function searchNews(query: string, limit = 20): Promise<NewsArticle[]> {
  const response = await getArticlesForSport("mlb", { page: 1, pageSize: 100 });
  const normalizedQuery = query.trim().toLowerCase();

  return response.articles
    .filter((article) => {
      if (!normalizedQuery) {
        return true;
      }

      return (
        article.title.toLowerCase().includes(normalizedQuery) ||
        article.excerpt.toLowerCase().includes(normalizedQuery) ||
        article.deck.toLowerCase().includes(normalizedQuery) ||
        article.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)) ||
        article.authors.some((author) => author.name.toLowerCase().includes(normalizedQuery))
      );
    })
    .slice(0, limit)
    .map((article) => toNewsArticle(article));
}

export async function getCategories(): Promise<NewsCategory[]> {
  return [
    { id: "all", label: "All" },
    { id: "mlb", label: "MLB" },
  ];
}

export async function getRelatedNews(
  article: NewsArticle,
  limit = 4,
): Promise<NewsArticle[]> {
  const sourceArticle = await getArticle("mlb", article.slug);

  if (!sourceArticle) {
    return [];
  }

  const related = await getRelatedStories(sourceArticle);

  return related.slice(0, limit).map((item) => toNewsArticle(item));
}
