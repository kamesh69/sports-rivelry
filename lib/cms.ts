import { DEFAULT_REVALIDATE_SECONDS } from "@/lib/site-config";
import { MEDIA_STANDARDS } from "@/lib/media";
import {
  articles,
  authors,
  getArticleBySlug,
  getArticlesBySlugs,
  getAuthorBySlug,
  getHomePageData as getMockHomePageData,
  getLandingPageBySlug,
  getLatestArticles,
  getLeagueHubBySportAndSlug,
  getNewsletterBySlug,
  getRelatedArticles,
  getSportHubBySlug,
  getTopicBySlug,
  landingPages,
  leagueHubs,
  newsletters,
  resolveSportDetail as resolveMockSportDetail,
  searchSite as searchMockSite,
  sportHubs,
  sports,
  topicHubs,
} from "@/lib/mock-data";
import type {
  Article,
  AuthorProfile,
  HomePageData,
  LandingPage,
  LeagueHub,
  NewsletterIssue,
  SearchResult,
  SportHub,
  TopicHub,
} from "@/lib/types";

const wordpressBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL?.replace(/\/$/, "") || "";
const wordpressGraphQLEndpoint = wordpressBaseUrl ? `${wordpressBaseUrl}/graphql` : "";

async function wpFetch<TData>(
  query: string,
  variables: Record<string, unknown> = {},
  tags: string[] = [],
) {
  if (!wordpressGraphQLEndpoint) {
    return null;
  }

  try {
    const response = await fetch(wordpressGraphQLEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
      next: {
        revalidate: DEFAULT_REVALIDATE_SECONDS,
        tags: ["wordpress", ...tags],
      },
    });

    if (!response.ok) {
      throw new Error(`WordPress fetch failed: ${response.status}`);
    }

    const payload = (await response.json()) as {
      data?: TData;
      errors?: Array<{ message: string }>;
    };

    if (payload.errors?.length) {
      throw new Error(payload.errors.map((error) => error.message).join(", "));
    }

    return payload.data || null;
  } catch (error) {
    console.error("Sports Rivalry CMS fallback engaged", error);
    return null;
  }
}

function normalizeWordPressArticle(node: any): Article | null {
  if (!node?.slug || !node?.sports?.nodes?.[0]?.slug) {
    return null;
  }

  const sport = sports.find((entry) => entry.slug === node.sports.nodes[0].slug);
  const authorList = node.authors?.nodes
    ?.map((authorNode: any) => {
      const existing = authors.find((entry) => entry.slug === authorNode.slug);

      if (existing) {
        return existing;
      }

      return null;
    })
    .filter(Boolean) as AuthorProfile[] | undefined;

  if (!sport || !authorList?.length) {
    return null;
  }

  const leagueNode = node.leagues?.nodes?.[0];
  const league = leagueNode
    ? getLeagueHubBySportAndSlug(sport.slug, leagueNode.slug)
    : null;

  return {
    id: String(node.databaseId || node.id),
    slug: node.slug,
    title: node.title,
    excerpt: node.excerpt || node.summary || "",
    deck: node.articleFields?.deck || node.excerpt || "",
    bodyHtml: node.content || "",
    featuredImage: {
      src: node.featuredImage?.node?.sourceUrl || "/images/articles/cricket-pulse.svg",
      alt: node.featuredImage?.node?.altText || node.title,
      width: node.featuredImage?.node?.mediaDetails?.width || MEDIA_STANDARDS.articleFeatured.width,
      height: node.featuredImage?.node?.mediaDetails?.height || MEDIA_STANDARDS.articleFeatured.height,
    },
    sport,
    league: league
      ? {
          slug: league.slug,
          name: league.name,
          sportSlug: league.sport.slug,
          seasonLabel: league.seasonLabel,
          description: league.description,
        }
      : undefined,
    authors: authorList,
    publishedAt: node.dateGmt || node.date || new Date().toISOString(),
    updatedAt: node.modifiedGmt || node.modified || new Date().toISOString(),
    readTime: Number(node.articleFields?.readTime || 5),
    topicSlugs: node.topics?.nodes?.map((topic: any) => topic.slug) || [],
    tags: node.tags?.nodes?.map((tag: any) => tag.name) || [],
    seo: {
      title: node.seo?.title || `${node.title}`,
      description: node.seo?.metaDesc || node.excerpt || "",
      canonicalPath: new URL(node.uri || `/${sport.slug}/${node.slug}`, "https://placeholder.local")
        .pathname,
    },
    relatedStorySlugs: node.articleFields?.relatedStories?.map((story: any) => story.slug) || [],
    trendingScore: Number(node.articleFields?.trendingScore || 0),
    isBreaking: Boolean(node.articleFields?.isBreaking),
    isEditorsPick: Boolean(node.articleFields?.isEditorsPick),
  };
}

async function getWordPressArticleByUri(uri: string) {
  const data = await wpFetch<{
    contentNode?: any;
  }>(
    `
      query ArticleByUri($uri: ID!) {
        contentNode(id: $uri, idType: URI) {
          ... on Article {
            id
            databaseId
            slug
            uri
            title
            excerpt
            content
            date
            dateGmt
            modified
            modifiedGmt
            articleFields {
              deck
              readTime
              isBreaking
              isEditorsPick
              trendingScore
              relatedStories {
                ... on Article {
                  slug
                }
              }
            }
            featuredImage {
              node {
                sourceUrl
                altText
                mediaDetails {
                  width
                  height
                }
              }
            }
            sports {
              nodes {
                slug
              }
            }
            leagues {
              nodes {
                slug
              }
            }
            topics {
              nodes {
                slug
              }
            }
            tags {
              nodes {
                name
              }
            }
            authors {
              nodes {
                slug
              }
            }
            seo {
              title
              metaDesc
            }
          }
        }
      }
    `,
    { uri },
    ["article", uri],
  );

  return normalizeWordPressArticle(data?.contentNode);
}

export async function getHomePageData(): Promise<HomePageData> {
  return getMockHomePageData();
}

export async function getLatestNews(limit = 12) {
  return getLatestArticles(limit);
}

export async function getTrendingNews(limit = 6) {
  return [...articles].sort((left, right) => right.trendingScore - left.trendingScore).slice(0, limit);
}

export async function getSportHub(slug: string): Promise<SportHub | null> {
  return getSportHubBySlug(slug);
}

export async function getLeagueHub(
  sportSlug: string,
  leagueSlug: string,
): Promise<LeagueHub | null> {
  return getLeagueHubBySportAndSlug(sportSlug, leagueSlug);
}

export async function getArticle(
  sportSlug: string,
  articleSlug: string,
): Promise<Article | null> {
  const wordPressArticle = await getWordPressArticleByUri(`/${sportSlug}/${articleSlug}/`);

  if (wordPressArticle) {
    return wordPressArticle;
  }

  const article = getArticleBySlug(articleSlug);

  if (!article || article.sport.slug !== sportSlug) {
    return null;
  }

  return article;
}

export async function resolveSportDetail(
  sportSlug: string,
  secondarySlug: string,
): Promise<
  | { type: "league"; league: LeagueHub }
  | { type: "article"; article: Article }
  | null
> {
  return resolveMockSportDetail(sportSlug, secondarySlug);
}

export async function getTopicHub(slug: string): Promise<TopicHub | null> {
  return getTopicBySlug(slug);
}

export async function getAuthorProfile(slug: string): Promise<AuthorProfile | null> {
  return getAuthorBySlug(slug);
}

export async function getNewsletterIssue(slug: string): Promise<NewsletterIssue | null> {
  return getNewsletterBySlug(slug);
}

export async function getLandingPage(slug: string): Promise<LandingPage | null> {
  return getLandingPageBySlug(slug);
}

export async function getRelatedStories(article: Article) {
  return getRelatedArticles(article);
}

export async function searchSite(query: string): Promise<SearchResult[]> {
  return searchMockSite(query);
}

export async function getAllArticlePaths() {
  return articles.map((article) => `/${article.sport.slug}/${article.slug}`);
}

export async function getAllSportPaths() {
  return sportHubs.map((sport) => `/${sport.slug}`);
}

export async function getAllLeaguePaths() {
  return leagueHubs.map((league) => `/${league.sport.slug}/${league.slug}`);
}

export async function getAllTopicPaths() {
  return topicHubs.map((topic) => `/topics/${topic.slug}`);
}

export async function getAllAuthorPaths() {
  return authors.map((author) => `/authors/${author.slug}`);
}

export async function getAllNewsletterPaths() {
  return newsletters.map((issue) => `/newsletters/${issue.slug}`);
}

export async function getAllLandingPaths() {
  return landingPages.map((page) => `/${page.slug}`);
}

export async function getNewsSitemapArticles() {
  const fortyEightHoursAgo = Date.now() - 48 * 60 * 60 * 1000;

  return articles.filter(
    (article) => new Date(article.publishedAt).getTime() >= fortyEightHoursAgo,
  );
}

export async function getArticlesForCollection(slugs: string[]) {
  return getArticlesBySlugs(slugs);
}
