import { cache } from "react";
import { cookies, draftMode } from "next/headers";
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
import { getSportPageDataBySlug } from "@/lib/sport-page-data";
import { HOMEPAGE_CATEGORY_STRIP } from "@/lib/site-config";
import { dedupeByKey, formatDate, sortByPublishedAt, stripHtml } from "@/lib/utils";
import type {
  Article,
  AuthorProfile,
  HomePageData,
  LandingPage,
  LeagueHub,
  MlbHubPageData,
  MlbHubSettings,
  NewsletterIssue,
  SearchResult,
  TopicHub,
  SportHubPageData,
  SportHubSettings,
  SportPageData,
  SportHub,
} from "@/lib/types";

const wordpressBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL?.replace(/\/$/, "") || "";
const wordpressGraphQLEndpoint = wordpressBaseUrl ? `${wordpressBaseUrl}/graphql` : "";
const WORDPRESS_ARTICLE_SCAN_LIMIT = 300;
const MAIN_SPORT_HUB_SLUGS = ["mlb", "basketball", "golf", "nascar", "football"] as const;
const loggedWordPressFallbackErrors = new Set<string>();

async function getWordPressArticleStatus() {
  try {
    const { isEnabled } = await draftMode();

    return isEnabled ? "DRAFT" : "PUBLISH";
  } catch {
    return "PUBLISH";
  }
}

function getWordPressFallbackErrorSignature(error: unknown) {
  if (!(error instanceof Error)) {
    return String(error);
  }

  const cause = error.cause as { code?: string; hostname?: string } | undefined;

  return [error.message, cause?.code, cause?.hostname].filter(Boolean).join(" | ");
}

async function wpFetch<TData>(
  query: string,
  variables: Record<string, unknown> = {},
  tags: string[] = [],
) {
  if (!wordpressGraphQLEndpoint) {
    return null;
  }

  const isDraftPreview = (await getWordPressArticleStatus()) === "DRAFT";
  const previewSecret = process.env.WORDPRESS_PREVIEW_SECRET;

  try {
    const response = await fetch(wordpressGraphQLEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(isDraftPreview && previewSecret
          ? { "X-Preview-Secret": previewSecret }
          : {}),
      },
      body: JSON.stringify({ query, variables }),
      ...(isDraftPreview
        ? { cache: "no-store" as const }
        : {
            next: {
              revalidate: DEFAULT_REVALIDATE_SECONDS,
              tags: ["wordpress", ...tags],
            },
          }),
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
    const signature = getWordPressFallbackErrorSignature(error);

    if (!loggedWordPressFallbackErrors.has(signature)) {
      loggedWordPressFallbackErrors.add(signature);
      console.error("The Sports Rivalry CMS fallback engaged", error);
    }

    return null;
  }
}

function synthesizeWordPressAuthor(authorNode: {
  slug?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
}): AuthorProfile | null {
  const slug = String(authorNode.slug || "").trim();

  if (!slug) {
    return null;
  }

  const existing = authors.find((entry) => entry.slug === slug);

  if (existing) {
    return existing;
  }

  const name =
    String(authorNode.name || "").trim() ||
    [authorNode.firstName, authorNode.lastName].filter(Boolean).join(" ").trim() ||
    slug;

  return {
    id: slug,
    slug,
    name,
    role: "Contributor",
    beat: "Sports",
    bio: "",
    expertise: "",
    avatar: {
      src: "/images/authors/riya.svg",
      alt: `Portrait illustration of ${name}`,
      width: 720,
      height: 720,
    },
    socials: [],
    seo: {
      title: `${name} | The Sports Rivalry`,
      description: `${name} at The Sports Rivalry.`,
      canonicalPath: `/authors/${slug}`,
    },
  };
}

function normalizeWordPressArticle(node: any, fallbackSportSlug?: string): Article | null {
  const sportSlug = node?.sports?.nodes?.[0]?.slug || fallbackSportSlug;

  if (!node?.slug || !sportSlug) {
    return null;
  }

  const sport = sports.find((entry) => entry.slug === sportSlug);
  const authorNodes =
    node.authors?.nodes?.length > 0
      ? node.authors.nodes
      : node.author?.node
        ? [node.author.node]
        : [];

  const authorList = authorNodes
    .map((authorNode: any) => synthesizeWordPressAuthor(authorNode))
    .filter(Boolean) as AuthorProfile[];

  if (!sport || !authorList.length) {
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
    deck: node.articleFields?.deck || node.articleFields?.articleSummary || node.excerpt || "",
    bodyHtml: node.content || "",
    featuredImage: {
      src: node.featuredImage?.node?.sourceUrl || "/images/articles/mlb-clubhouse.svg",
      alt: node.featuredImage?.node?.altText || node.title,
      width: node.featuredImage?.node?.mediaDetails?.width || MEDIA_STANDARDS.articleFeatured.width,
      height: node.featuredImage?.node?.mediaDetails?.height || MEDIA_STANDARDS.articleFeatured.height,
      credit: node.featuredImage?.node?.caption ? stripHtml(node.featuredImage.node.caption) : undefined,
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
      canonicalPath: `/${sport.slug}/${node.slug}`,
    },
    relatedStorySlugs: node.articleFields?.relatedStories?.map((story: any) => story.slug) || [],
    trendingScore: Number(node.articleFields?.trendingScore || 0),
    isBreaking: Boolean(node.articleFields?.isBreaking),
    isEditorsPick: Boolean(node.articleFields?.isEditorsPick),
    essentials:
      node.articleFields?.essentials?.map((item: { point?: string }) => item.point).filter(Boolean) ||
      undefined,
    sourceArticleLink: node.articleFields?.sourceArticleLink || undefined,
    sentiment: node.articleFields?.sentiment || undefined,
  };
}

const getWordPressArticleBySlug = cache(async (slug: string, status = "PUBLISH", fallbackSportSlug?: string) => {
  if (status === "DRAFT") {
    let previewDatabaseId: number | null = null;

    try {
      const previewId = (await cookies()).get("sr-preview-article-id")?.value;

      if (previewId && /^\d+$/.test(previewId)) {
        previewDatabaseId = Number(previewId);
      }
    } catch {
      previewDatabaseId = null;
    }

    const draftData = await wpFetch<{ previewArticle?: any }>(
      `
        query ArticleDraftBySlug($slug: String!, $databaseId: Int) {
          previewArticle(slug: $slug, databaseId: $databaseId) {
            ${HOME_ARTICLE_FIELDS}
          }
        }
      `,
      { slug, databaseId: previewDatabaseId },
      ["article", slug, "draft"],
    );

    const draftNode = draftData?.previewArticle;

    if (draftNode) {
      return normalizeWordPressArticle(draftNode, fallbackSportSlug);
    }

    if (previewDatabaseId) {
      const draftByIdData = await wpFetch<{ previewArticle?: any }>(
        `
          query ArticleDraftById($databaseId: Int!) {
            previewArticle(databaseId: $databaseId) {
              ${HOME_ARTICLE_FIELDS}
            }
          }
        `,
        { databaseId: previewDatabaseId },
        ["article", String(previewDatabaseId), "draft"],
      );

      const draftByIdNode = draftByIdData?.previewArticle;

      if (draftByIdNode) {
        return normalizeWordPressArticle(draftByIdNode, fallbackSportSlug);
      }
    }

    const fallbackDraftData = await wpFetch<{ articles?: { nodes?: any[] } }>(
      `
        query ArticleDraftBySlugFallback($slug: String!) {
          articles(where: { name: $slug, status: DRAFT }, first: 1) {
            nodes { ${HOME_ARTICLE_FIELDS} }
          }
        }
      `,
      { slug },
      ["article", slug, "draft"],
    );

    const fallbackDraftNode = fallbackDraftData?.articles?.nodes?.[0];

    if (fallbackDraftNode) {
      return normalizeWordPressArticle(fallbackDraftNode, fallbackSportSlug);
    }
  }

  const data = await wpFetch<{
    article?: any;
  }>(
    `
      query ArticleBySlug($slug: ID!) {
        article(id: $slug, idType: SLUG) {
          ${HOME_ARTICLE_FIELDS}
        }
      }
    `,
    { slug },
    ["article", slug],
  );

  return normalizeWordPressArticle(data?.article);
});

const HOME_ARTICLE_FIELDS = `
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
    articleSummary
    sourceArticleLink
    sentiment
    readTime
    isBreaking
    isEditorsPick
    trendingScore
    essentials {
      point
    }
    relatedStories {
      slug
    }
  }
  featuredImage {
    node {
      sourceUrl
      altText
      caption
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
  author {
    node {
      slug
      name
      firstName
      lastName
    }
  }
`;

function extractStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
}

function sortArticlesByMode(pool: Article[], orderBy: "date" | "trending" = "date") {
  if (orderBy === "trending") {
    return [...pool].sort((left, right) => {
      if (right.trendingScore !== left.trendingScore) {
        return right.trendingScore - left.trendingScore;
      }

      return (
        new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
      );
    });
  }

  return sortByPublishedAt(pool);
}

function buildPagedArticles(
  pool: Article[],
  {
    page = 1,
    pageSize,
    limit,
  }: {
    page?: number;
    pageSize?: number;
    limit?: number;
  } = {},
) {
  const effectivePageSize = pageSize || limit || pool.length || 1;
  const total = pool.length;
  const totalPages = Math.max(1, Math.ceil(total / effectivePageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * effectivePageSize;
  const items = limit && !pageSize ? pool.slice(0, limit) : pool.slice(start, start + effectivePageSize);

  return {
    articles: items,
    total,
    page: safePage,
    pageSize: effectivePageSize,
    totalPages,
  };
}

const getWordPressRecentArticles = cache(async (
  first = WORDPRESS_ARTICLE_SCAN_LIMIT,
): Promise<Article[]> => {
  const data = await wpFetch<{ articles?: { nodes?: any[] } }>(
    `
      query RecentArticles($first: Int!) {
        articles(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
          nodes {
            ${HOME_ARTICLE_FIELDS}
          }
        }
      }
    `,
    { first },
    ["articles", String(first)],
  );

  const nodes = data?.articles?.nodes;

  if (!nodes?.length) {
    return [];
  }

  return nodes
    .map((node) => normalizeWordPressArticle(node))
    .filter(Boolean) as Article[];
});

function normalizeMlbHubSettings(node: any): SportHubSettings | null {
  if (!node) {
    return null;
  }

  const heroImage = node.hero?.image?.src
    ? {
        src: node.hero.image.src,
        alt: node.hero.image.alt || "MLB hub hero image",
        width: Number(node.hero.image.width || MEDIA_STANDARDS.articleFeatured.width),
        height: Number(node.hero.image.height || MEDIA_STANDARDS.articleFeatured.height),
        credit: node.hero.image.credit || undefined,
      }
    : undefined;

  const rankingsColumns =
    Array.isArray(node.rankingsColumns) && node.rankingsColumns.length >= 2
      ? [String(node.rankingsColumns[0]), String(node.rankingsColumns[1])] as [string, string]
      : undefined;

  const seoTitle = String(node.seoTitle || "").trim();
  const seoDescription = String(node.seoDescription || "").trim();

  return {
    seo:
      seoTitle || seoDescription
        ? {
            title: seoTitle || undefined,
            description: seoDescription || undefined,
          }
        : undefined,
    hero: node.hero
      ? {
          articleSlug: String(node.hero.articleSlug || "").trim() || undefined,
          pillPrimary: String(node.hero.pillPrimary || "").trim() || undefined,
          pillSecondary: String(node.hero.pillSecondary || "").trim() || undefined,
          headline: String(node.hero.headline || "").trim() || undefined,
          deck: String(node.hero.deck || "").trim() || undefined,
          author: String(node.hero.author || "").trim() || undefined,
          date: String(node.hero.date || "").trim() || undefined,
          readTime:
            typeof node.hero.readTime === "number"
              ? node.hero.readTime
              : Number(node.hero.readTime || 0) || undefined,
          image: heroImage,
        }
      : undefined,
    featuredStorySlugs: extractStringArray(node.featuredStorySlugs),
    headlineSlugs: extractStringArray(node.headlineSlugs),
    trendingSlugs: extractStringArray(node.trendingSlugs),
    liveGame: node.liveGame || undefined,
    scoreboardLabel: String(node.scoreboardLabel || "").trim() || undefined,
    scoreboard: Array.isArray(node.scoreboard) ? node.scoreboard : undefined,
    playerSpotlight: node.playerSpotlight || undefined,
    teamHub:
      node.teamHub && Array.isArray(node.teamHub.teams)
        ? {
            tabs: extractStringArray(node.teamHub.tabs),
            teams: node.teamHub.teams,
          }
        : undefined,
    matchupsLabel: String(node.matchupsLabel || "").trim() || undefined,
    matchups: Array.isArray(node.matchups) ? node.matchups : undefined,
    rankingsLabel: String(node.rankingsLabel || "").trim() || undefined,
    rankingsColumns,
    rankings: Array.isArray(node.rankings) ? node.rankings : undefined,
    analyticsLabel: String(node.analyticsLabel || "").trim() || undefined,
    statLeaders: Array.isArray(node.statLeaders) ? node.statLeaders : undefined,
    videoHighlights: Array.isArray(node.videoHighlights) ? node.videoHighlights : undefined,
    opinions: Array.isArray(node.opinions) ? node.opinions : undefined,
    newsletter:
      String(node.newsletterHeading || "").trim() || String(node.newsletterSubheading || "").trim()
        ? {
            heading: String(node.newsletterHeading || "").trim() || undefined,
            subheading: String(node.newsletterSubheading || "").trim() || undefined,
          }
        : undefined,
  };
}

function fillArticleSlots(primary: Article[], fallback: Article[], count: number) {
  return dedupeByKey([...primary, ...fallback], (article) => article.id).slice(0, count);
}

function fallbackSportPageData(slug: string) {
  return getSportPageDataBySlug(slug);
}

function applyMlbHubSettingsToSportPageData(
  baseData: SportPageData,
  settings: SportHubSettings | null,
  heroArticle: Article | null,
): SportPageData {
  const resolvedHero = heroArticle || null;
  const heroImage = settings?.hero?.image || resolvedHero?.featuredImage || baseData.hero.image;

  return {
    ...baseData,
    hero: {
      pillPrimary: settings?.hero?.pillPrimary || baseData.hero.pillPrimary,
      pillSecondary: settings?.hero?.pillSecondary || baseData.hero.pillSecondary,
      headline:
        settings?.hero?.headline ||
        resolvedHero?.title ||
        baseData.hero.headline,
      deck:
        settings?.hero?.deck ||
        resolvedHero?.deck ||
        resolvedHero?.excerpt ||
        baseData.hero.deck,
      author:
        settings?.hero?.author ||
        resolvedHero?.authors[0]?.name ||
        baseData.hero.author,
      date:
        settings?.hero?.date ||
        (resolvedHero ? formatDate(resolvedHero.publishedAt) : baseData.hero.date),
      readTime:
        settings?.hero?.readTime ||
        resolvedHero?.readTime ||
        baseData.hero.readTime,
      href: resolvedHero?.seo.canonicalPath || baseData.hero.href,
      image: heroImage,
    },
    liveGame: settings?.liveGame || baseData.liveGame,
    playerSpotlight: settings?.playerSpotlight || baseData.playerSpotlight,
    scoreboardLabel: settings?.scoreboardLabel || baseData.scoreboardLabel,
    scoreboard:
      settings?.scoreboard?.length ? settings.scoreboard : baseData.scoreboard,
    teamHub:
      settings?.teamHub?.teams?.length ? settings.teamHub : baseData.teamHub,
    matchupsLabel: settings?.matchupsLabel || baseData.matchupsLabel,
    matchups: settings?.matchups?.length ? settings.matchups : baseData.matchups,
    rankingsLabel: settings?.rankingsLabel || baseData.rankingsLabel,
    rankingsColumns:
      settings?.rankingsColumns?.length === 2
        ? settings.rankingsColumns
        : baseData.rankingsColumns,
    rankings: settings?.rankings?.length ? settings.rankings : baseData.rankings,
    analyticsLabel: settings?.analyticsLabel || baseData.analyticsLabel,
    statLeaders:
      settings?.statLeaders?.length ? settings.statLeaders : baseData.statLeaders,
    videoHighlights:
      settings?.videoHighlights?.length
        ? settings.videoHighlights
        : baseData.videoHighlights,
    opinions: settings?.opinions?.length ? settings.opinions : baseData.opinions,
    newsletter: {
      heading: settings?.newsletter?.heading || baseData.newsletter.heading,
      subheading:
        settings?.newsletter?.subheading || baseData.newsletter.subheading,
    },
  };
}

function mapAuthorProfileNode(node: {
  slug: string;
  name: string;
  role?: string;
  beat?: string;
  bio?: string;
  expertise?: string;
  avatarUrl?: string;
  socials?: Array<{ platform?: string; label?: string; url?: string }>;
}): AuthorProfile {
  return {
    id: node.slug,
    slug: node.slug,
    name: node.name,
    role: node.role || "Contributor",
    beat: node.beat || "Sports",
    bio: node.bio || "",
    expertise: node.expertise || "",
    avatar: {
      src: node.avatarUrl || "/images/authors/riya.svg",
      alt: `Portrait of ${node.name}`,
      width: 720,
      height: 720,
    },
    socials: (node.socials || []).map((social) => ({
      platform: social.platform || "",
      label: social.label || social.platform || "Link",
      url: social.url || "",
    })),
    seo: {
      title: `${node.name} | The Sports Rivalry`,
      description: node.bio || `${node.name} at The Sports Rivalry.`,
      canonicalPath: `/authors/${node.slug}`,
    },
  };
}

function mapTopicHubNode(node: {
  slug: string;
  title: string;
  description?: string;
  seoTitle?: string;
  articleSlugs?: string[];
}): TopicHub {
  return {
    slug: node.slug,
    title: node.title,
    description: node.description || "",
    articleSlugs: node.articleSlugs || [],
    seo: {
      title: node.seoTitle || `${node.title} | The Sports Rivalry`,
      description: node.description || "",
      canonicalPath: `/topics/${node.slug}`,
    },
  };
}

function buildQuickHitsFromPool(pool: Article[]): HomePageData["quickHits"] {
  const sorted = sortByPublishedAt(pool);

  if (sorted.length < 2) {
    return null;
  }

  return {
    config: {
      enabled: true,
      title: "Quick Hits",
      selectionMode: "sport_date",
      sportSlug: sorted[0].sport.slug,
      secondaryCount: 2,
    },
    featured: sorted[0],
    secondary: sorted.slice(1, 3),
  };
}

function assembleHomePageData(pool: Article[], homepageSettings: any = null): HomePageData {
  const sorted = sortByPublishedAt(pool);
  const trendingArticles = [...sorted]
    .sort((left, right) => right.trendingScore - left.trendingScore)
    .slice(0, 8);
  const breakingNews = sorted.filter((article) => article.isBreaking).slice(0, 4);
  const editorsPicks = sorted.filter((article) => article.isEditorsPick).slice(0, 4);
  const heroPool = breakingNews.length >= 1 ? breakingNews : trendingArticles;
  const heroArticle = heroPool[0] || sorted[0];
  const heroSecondary = dedupeByKey(
    [...heroPool.slice(1), ...sorted].filter((article) => article.id !== heroArticle?.id),
    (article) => article.id,
  ).slice(0, 3);
  const topHeadlines = trendingArticles.slice(0, 8);

  const sportRailMap = new Map<string, { sport: Article["sport"]; articles: Article[] }>();
  for (const article of sorted) {
    const entry = sportRailMap.get(article.sport.slug);
    if (entry) {
      if (entry.articles.length < 5) {
        entry.articles.push(article);
      }
    } else {
      sportRailMap.set(article.sport.slug, { sport: article.sport, articles: [article] });
    }
  }
  const sportRails = Array.from(sportRailMap.values())
    .filter((rail) => rail.articles.length > 0)
    .slice(0, 5);

  const recommendedReads = dedupeByKey(
    [...editorsPicks, ...trendingArticles],
    (article) => article.id,
  ).slice(0, 3);

  const categoryStrip =
    homepageSettings?.categoryStrip?.length > 0
      ? homepageSettings.categoryStrip.map((item: { label: string; href: string }) => ({
          slug: item.href.replace(/^\//, ""),
          label: item.label,
          href: item.href,
        }))
      : HOMEPAGE_CATEGORY_STRIP;

  return {
    breakingNews,
    topHeadlines,
    heroArticle: homepageSettings?.heroArticleSlug
      ? pool.find((article) => article.slug === homepageSettings.heroArticleSlug) || heroArticle
      : heroArticle,
    heroSecondary,
    latestArticles: sorted.slice(0, 12),
    categoryStrip,
    quickHits: homepageSettings?.quickHits || buildQuickHitsFromPool(pool),
    sportRails,
    trendingArticles,
    editorsPicks: homepageSettings?.editorsPickSlugs?.length
      ? fillArticleSlots(
          pool.filter((article) => homepageSettings.editorsPickSlugs.includes(article.slug)),
          editorsPicks,
          4,
        )
      : editorsPicks,
    recommendedReads,
    newsletter: homepageSettings?.newsletter || newsletters[0],
    featuredAuthors: homepageSettings?.featuredAuthors?.length
      ? homepageSettings.featuredAuthors
      : authors.slice(0, 4),
  };
}

const SPORT_HUB_SETTINGS_FIELDS = `
  seoTitle
  seoDescription
  hero {
    articleSlug
    pillPrimary
    pillSecondary
    headline
    deck
    author
    date
    readTime
    image {
      src
      alt
      width
      height
      credit
    }
  }
  featuredStorySlugs
  headlineSlugs
  trendingSlugs
  liveGame {
    status
    isLive
    clock
    note
    away { name shortName primaryColor accentColor textColor score record isWinner }
    home { name shortName primaryColor accentColor textColor score record isWinner }
  }
  scoreboardLabel
  scoreboard {
    status isLive detail
    away { name shortName primaryColor accentColor textColor score record isWinner }
    home { name shortName primaryColor accentColor textColor score record isWinner }
  }
  playerSpotlight {
    player meta monogram footnote
    stats { label value }
  }
  teamHub {
    tabs
    teams { slug meta form team { name shortName primaryColor accentColor textColor } }
  }
  matchupsLabel
  matchups {
    status isLive clock info venue network seriesNote spread overUnder
    teams { name shortName primaryColor accentColor textColor score record isWinner }
  }
  rankingsLabel
  rankingsColumns
  rankings {
    rank record trend trendLabel statA statB
    team { name shortName primaryColor accentColor textColor }
  }
  analyticsLabel
  statLeaders {
    category player monogram value team slug
    image { src alt width height credit }
  }
  videoHighlights {
    title duration href featured
    image { src alt width height credit }
  }
  opinions {
    title author category href
    image { src alt width height credit }
  }
  newsletterHeading
  newsletterSubheading
`;

const getWordPressHomePageData = cache(async (): Promise<HomePageData | null> => {
  const [data, homepageSettings] = await Promise.all([
    wpFetch<{ articles?: { nodes?: any[] } }>(
      `
        query HomePageArticles {
          articles(first: 40, where: { orderby: { field: DATE, order: DESC } }) {
            nodes {
              ${HOME_ARTICLE_FIELDS}
            }
          }
        }
      `,
      {},
      ["home", "articles"],
    ),
    getHomepageSettings(),
  ]);

  const nodes = data?.articles?.nodes;

  if (!nodes?.length) {
    return null;
  }

  const normalized = nodes
    .map((node) => normalizeWordPressArticle(node))
    .filter(Boolean) as Article[];

  if (!normalized.length) {
    return null;
  }

  return assembleHomePageData(normalized, homepageSettings);
});

const getHomepageSettings = cache(async () => {
  const data = await wpFetch<{ homepageSettings?: any }>(
    `
      query HomepageSettings {
        homepageSettings {
          heroArticleSlug
          breakingSlugs
          sportRailOrder
          editorsPickSlugs
          featuredAuthorSlugs
          newsletterIssueSlug
          categoryStrip { label href sportSlug }
          quickHits {
            enabled title selectionMode featuredArticleSlug secondaryArticleSlugs authorSlug sportSlug secondaryCount
          }
        }
      }
    `,
    {},
    ["home", "homepage-settings"],
  );

  const settings = data?.homepageSettings;

  if (!settings) {
    return null;
  }

  const [newsletterIssue, featuredAuthors] = await Promise.all([
    settings.newsletterIssueSlug
      ? getNewsletterIssue(settings.newsletterIssueSlug)
      : Promise.resolve(null),
    settings.featuredAuthorSlugs?.length
      ? Promise.all(
          settings.featuredAuthorSlugs.map((slug: string) => getAuthorProfile(slug)),
        ).then((profiles) => profiles.filter(Boolean) as AuthorProfile[])
      : Promise.resolve([] as AuthorProfile[]),
  ]);

  let quickHits = null;

  if (settings.quickHits?.enabled) {
    const featuredSlug = settings.quickHits.featuredArticleSlug;
    const secondarySlugs = settings.quickHits.secondaryArticleSlugs || [];
    const sportSlug = settings.quickHits.sportSlug || "mlb";
    const [featured, ...secondary] = await Promise.all([
      featuredSlug ? getArticle(sportSlug, featuredSlug) : Promise.resolve(null),
      ...secondarySlugs.map((slug: string) => getArticle(sportSlug, slug)),
    ]);

    if (featured) {
      quickHits = {
        config: {
          enabled: true,
          title: settings.quickHits.title || "Quick Hits",
          selectionMode: settings.quickHits.selectionMode || "manual",
          featuredArticleSlug: featuredSlug,
          secondaryArticleSlugs: secondarySlugs,
          authorSlug: settings.quickHits.authorSlug,
          sportSlug,
          secondaryCount: settings.quickHits.secondaryCount,
        },
        featured,
        secondary: secondary.filter(Boolean) as Article[],
      };
    }
  }

  return {
    heroArticleSlug: settings.heroArticleSlug || undefined,
    editorsPickSlugs: settings.editorsPickSlugs || [],
    categoryStrip: settings.categoryStrip || [],
    quickHits,
    newsletter: newsletterIssue || undefined,
    featuredAuthors,
  };
});

export const getSportHubSettings = cache(async (sportSlug: string): Promise<SportHubSettings | null> => {
  const data = await wpFetch<{ sportHubSettings?: any }>(
    `
      query SportHubSettings($sport: String!) {
        sportHubSettings(sport: $sport) {
          ${SPORT_HUB_SETTINGS_FIELDS}
        }
      }
    `,
    { sport: sportSlug },
    ["sport-hub", sportSlug],
  );

  return normalizeMlbHubSettings(data?.sportHubSettings);
});

export const getMlbHubSettings = cache(async (): Promise<MlbHubSettings | null> => {
  return getSportHubSettings("mlb");
});

export async function getHomePageData(): Promise<HomePageData> {
  const wordPressHome = await getWordPressHomePageData();

  if (wordPressHome) {
    return wordPressHome;
  }

  return getMockHomePageData();
}

export async function getLatestNews(sportSlug?: string, limit = 12) {
  if (sportSlug) {
    const result = await getArticlesForSport(sportSlug, { limit, orderBy: "date" });

    return result.articles;
  }

  const wordPressArticles = await getWordPressRecentArticles();

  if (wordPressArticles.length) {
    return sortByPublishedAt(wordPressArticles).slice(0, limit);
  }

  return getLatestArticles(limit);
}

export async function getTrendingNews(sportSlug?: string, limit = 6) {
  if (sportSlug) {
    const result = await getArticlesForSport(sportSlug, { limit, orderBy: "trending" });

    return result.articles;
  }

  const wordPressArticles = await getWordPressRecentArticles();

  if (wordPressArticles.length) {
    return [...wordPressArticles]
      .sort((left, right) => right.trendingScore - left.trendingScore)
      .slice(0, limit);
  }

  return [...articles].sort((left, right) => right.trendingScore - left.trendingScore).slice(0, limit);
}

export async function getArticlesByAuthorSlug(authorSlug: string, limit = 24) {
  const wordPressArticles = await getWordPressRecentArticles();
  const merged = dedupeByKey(
    [...wordPressArticles, ...articles],
    (article) => article.id,
  );

  return merged
    .filter((article) => article.authors.some((author) => author.slug === authorSlug))
    .slice(0, limit);
}

export async function getSportHub(slug: string): Promise<SportHub | null> {
  const hub = getSportHubBySlug(slug);

  if (!hub) {
    return hub;
  }

  if (!MAIN_SPORT_HUB_SLUGS.includes(slug as (typeof MAIN_SPORT_HUB_SLUGS)[number])) {
    return hub;
  }

  const settings = await getSportHubSettings(slug);

  if (!settings?.seo?.title && !settings?.seo?.description) {
    return hub;
  }

  return {
    ...hub,
    description: settings.seo?.description || hub.description,
    seo: {
      ...hub.seo,
      title: settings.seo?.title || hub.seo.title,
      description: settings.seo?.description || hub.seo.description,
    },
  };
}

function mapLeagueHubNode(node: {
  slug: string;
  name: string;
  sportSlug: string;
  seasonLabel?: string;
  description?: string;
  articleSlugs?: string[];
  seoTitle?: string;
  seoDescription?: string;
}): LeagueHub | null {
  const sport = sports.find((entry) => entry.slug === node.sportSlug);

  if (!sport) {
    return null;
  }

  return {
    slug: node.slug,
    name: node.name,
    sport,
    seasonLabel: node.seasonLabel || "2026 Season",
    description: node.description || "",
    articleSlugs: node.articleSlugs || [],
    seo: {
      title: node.seoTitle || `${node.name} ${node.seasonLabel || ""} | The Sports Rivalry`.trim(),
      description: node.seoDescription || node.description || "",
      canonicalPath: `/${sport.slug}/${node.slug}`,
    },
  };
}

export async function getLeagueHub(
  sportSlug: string,
  leagueSlug: string,
): Promise<LeagueHub | null> {
  const data = await wpFetch<{ leagueHub?: Parameters<typeof mapLeagueHubNode>[0] | null }>(
    `
      query LeagueHub($sport: String!, $slug: String!) {
        leagueHub(sport: $sport, slug: $slug) {
          slug name sportSlug seasonLabel description articleSlugs seoTitle seoDescription
        }
      }
    `,
    { sport: sportSlug, slug: leagueSlug },
    ["league", sportSlug, leagueSlug],
  );

  if (data?.leagueHub) {
    return mapLeagueHubNode(data.leagueHub);
  }

  return getLeagueHubBySportAndSlug(sportSlug, leagueSlug);
}

export async function getAllLeagueHubs(): Promise<LeagueHub[]> {
  const data = await wpFetch<{ leagueHubs?: Array<Parameters<typeof mapLeagueHubNode>[0]> }>(
    `
      query LeagueHubs {
        leagueHubs {
          slug name sportSlug seasonLabel description articleSlugs seoTitle seoDescription
        }
      }
    `,
    {},
    ["leagues"],
  );

  const wpLeagues = (data?.leagueHubs || [])
    .map(mapLeagueHubNode)
    .filter((league): league is LeagueHub => Boolean(league));
  const wpKeys = new Set(wpLeagues.map((league) => `${league.sport.slug}/${league.slug}`));
  const mockLeagues = leagueHubs.filter(
    (league) => !wpKeys.has(`${league.sport.slug}/${league.slug}`),
  );

  return wpLeagues.length > 0 ? [...wpLeagues, ...mockLeagues] : leagueHubs;
}

export async function getMlbStatsTables(): Promise<{
  seasonLabel: string;
  batting: unknown[];
  pitching: unknown[];
  fielding: unknown[];
}> {
  const data = await wpFetch<{
    mlbStatsSettings?: {
      seasonLabel?: string | null;
      battingJson?: string | null;
      pitchingJson?: string | null;
      fieldingJson?: string | null;
    } | null;
  }>(
    `
      query MlbStatsSettings {
        mlbStatsSettings {
          seasonLabel
          battingJson
          pitchingJson
          fieldingJson
        }
      }
    `,
    {},
    ["mlb", "mlb-stats"],
  );

  const settings = data?.mlbStatsSettings;

  if (!settings) {
    return { seasonLabel: "2026", batting: [], pitching: [], fielding: [] };
  }

  const parseRows = (value?: string | null) => {
    if (!value) {
      return [];
    }

    try {
      const parsed = JSON.parse(value);

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  return {
    seasonLabel: settings.seasonLabel || "2026",
    batting: parseRows(settings.battingJson),
    pitching: parseRows(settings.pitchingJson),
    fielding: parseRows(settings.fieldingJson),
  };
}

export async function getMlbTeamsPageSettings(): Promise<{
  featuredTeamIds: string[];
  timeline: Array<{ year: string; title: string; description: string }>;
  quickFacts: Array<{ icon: string; value: string; label: string }>;
  heroTitle: string;
  heroDescription: string;
} | null> {
  const data = await wpFetch<{
    mlbTeamsPageSettings?: {
      featuredTeamIds?: string[] | null;
      timeline?: Array<{ year?: string; title?: string; description?: string }> | null;
      quickFacts?: Array<{ icon?: string; value?: string; label?: string }> | null;
      heroTitle?: string | null;
      heroDescription?: string | null;
    } | null;
  }>(
    `
      query MlbTeamsPageSettings {
        mlbTeamsPageSettings {
          featuredTeamIds
          timeline { year title description }
          quickFacts { icon value label }
          heroTitle
          heroDescription
        }
      }
    `,
    {},
    ["mlb", "mlb-teams-page"],
  );

  const settings = data?.mlbTeamsPageSettings;

  if (!settings) {
    return null;
  }

  return {
    featuredTeamIds: settings.featuredTeamIds || [],
    timeline: (settings.timeline || []).map((event) => ({
      year: event.year || "",
      title: event.title || "",
      description: event.description || "",
    })),
    quickFacts: (settings.quickFacts || []).map((fact) => ({
      icon: fact.icon || "",
      value: fact.value || "",
      label: fact.label || "",
    })),
    heroTitle: settings.heroTitle || "",
    heroDescription: settings.heroDescription || "",
  };
}

export async function getArticle(
  sportSlug: string,
  articleSlug: string,
): Promise<Article | null> {
  const status = await getWordPressArticleStatus();
  const wordPressArticle = await getWordPressArticleBySlug(articleSlug, status, sportSlug);

  if (wordPressArticle?.sport.slug === sportSlug) {
    return wordPressArticle;
  }

  const article = getArticleBySlug(articleSlug);

  if (!article || article.sport.slug !== sportSlug) {
    return null;
  }

  return article;
}

export async function getArticlesForSport(
  sportSlug: string,
  options: {
    limit?: number;
    page?: number;
    pageSize?: number;
    orderBy?: "date" | "trending";
    slugs?: string[];
    excludeSlugs?: string[];
  } = {},
) {
  const {
    limit,
    page = 1,
    pageSize,
    orderBy = "date",
    slugs,
    excludeSlugs = [],
  } = options;

  const recentWordPressArticles = await getWordPressRecentArticles();
  const wordPressPool = recentWordPressArticles.filter(
    (article) => article.sport.slug === sportSlug,
  );
  const fallbackPool = articles.filter((article) => article.sport.slug === sportSlug);
  const basePool = dedupeByKey([...wordPressPool, ...fallbackPool], (article) => article.id);

  if (slugs?.length) {
    const requested = (
      await Promise.all(slugs.map((slug) => getArticle(sportSlug, slug)))
    ).filter(Boolean) as Article[];
    const remaining = basePool.filter((article) => !slugs.includes(article.slug));

    return buildPagedArticles(fillArticleSlots(requested, remaining, slugs.length), {
      limit: slugs.length,
    });
  }

  const filtered = basePool.filter((article) => !excludeSlugs.includes(article.slug));
  const sorted = sortArticlesByMode(filtered, orderBy);

  return buildPagedArticles(sorted, { limit, page, pageSize });
}

export async function getSportHubPageData(sportSlug: string): Promise<SportHubPageData | null> {
  const baseData = fallbackSportPageData(sportSlug);

  if (!baseData) {
    return null;
  }

  const settings = await getSportHubSettings(sportSlug);
  const [latestResult, trendingResult] = await Promise.all([
    getArticlesForSport(sportSlug, { page: 1, pageSize: 12 }),
    getArticlesForSport(sportSlug, { page: 1, pageSize: 5, orderBy: "trending" }),
  ]);

  const latestStories = latestResult.articles;
  const fallbackFeatured = latestStories.slice(0, 4);
  const fallbackHeadlines = latestStories.slice(0, 10);
  const fallbackTrending = trendingResult.articles;

  const [featuredResult, headlinesResult, curatedTrendingResult] = await Promise.all([
    settings?.featuredStorySlugs?.length
      ? getArticlesForSport(sportSlug, { slugs: settings.featuredStorySlugs })
      : Promise.resolve({ articles: [] as Article[] }),
    settings?.headlineSlugs?.length
      ? getArticlesForSport(sportSlug, { slugs: settings.headlineSlugs })
      : Promise.resolve({ articles: [] as Article[] }),
    settings?.trendingSlugs?.length
      ? getArticlesForSport(sportSlug, { slugs: settings.trendingSlugs })
      : Promise.resolve({ articles: [] as Article[] }),
  ]);

  const featuredStories = fillArticleSlots(featuredResult.articles, fallbackFeatured, 4);
  const headlines = fillArticleSlots(headlinesResult.articles, fallbackHeadlines, 10);
  const trendingStories = fillArticleSlots(curatedTrendingResult.articles, fallbackTrending, 5);

  const heroSlug =
    settings?.hero?.articleSlug || featuredStories[0]?.slug || latestStories[0]?.slug;
  const heroArticle = heroSlug ? await getArticle(sportSlug, heroSlug) : null;

  return {
    seo: settings?.seo,
    sportPageData: applyMlbHubSettingsToSportPageData(baseData, settings, heroArticle),
    featuredStories,
    headlines,
    trendingStories,
    latestStories,
  };
}

export async function getMlbHubPageData(): Promise<MlbHubPageData | null> {
  return getSportHubPageData("mlb");
}

export async function resolveSportDetail(
  sportSlug: string,
  secondarySlug: string,
): Promise<
  | { type: "league"; league: LeagueHub }
  | { type: "article"; article: Article }
  | null
> {
  const league = await getLeagueHub(sportSlug, secondarySlug);

  if (league) {
    return { type: "league", league };
  }

  const wordPressArticle = await getWordPressArticleBySlug(secondarySlug, await getWordPressArticleStatus());

  if (wordPressArticle?.sport.slug === sportSlug) {
    return { type: "article", article: wordPressArticle };
  }

  return resolveMockSportDetail(sportSlug, secondarySlug);
}

export async function getTopicHub(slug: string): Promise<TopicHub | null> {
  const data = await wpFetch<{ topicHub?: any }>(
    `
      query TopicHub($slug: String!) {
        topicHub(slug: $slug) {
          slug title description seoTitle articleSlugs
        }
      }
    `,
    { slug },
    ["topic", slug],
  );

  if (data?.topicHub) {
    return mapTopicHubNode(data.topicHub);
  }

  return getTopicBySlug(slug);
}

export async function getAuthorProfile(slug: string): Promise<AuthorProfile | null> {
  const data = await wpFetch<{ authorProfile?: any }>(
    `
      query AuthorProfile($slug: String!) {
        authorProfile(slug: $slug) {
          slug name role beat bio expertise avatarUrl
          socials { platform label url }
        }
      }
    `,
    { slug },
    ["author", slug],
  );

  if (data?.authorProfile) {
    return mapAuthorProfileNode(data.authorProfile);
  }

  return getAuthorBySlug(slug);
}

export async function getAllAuthors(): Promise<AuthorProfile[]> {
  const data = await wpFetch<{ authorProfiles?: Array<Parameters<typeof mapAuthorProfileNode>[0]> }>(
    `
      query AuthorProfiles {
        authorProfiles {
          slug name role beat bio expertise avatarUrl
          socials { platform label url }
        }
      }
    `,
    {},
    ["authors"],
  );

  const wpAuthors = (data?.authorProfiles || []).map(mapAuthorProfileNode);
  const wpSlugs = new Set(wpAuthors.map((author) => author.slug));
  const mockAuthors = authors.filter((author) => !wpSlugs.has(author.slug));

  return wpAuthors.length > 0 ? [...wpAuthors, ...mockAuthors] : authors;
}

export async function getAllTopicHubs(): Promise<TopicHub[]> {
  const data = await wpFetch<{
    topicHubs?: Array<Parameters<typeof mapTopicHubNode>[0]>;
  }>(
    `
      query TopicHubs {
        topicHubs {
          slug title description seoTitle articleSlugs
        }
      }
    `,
    {},
    ["topics"],
  );

  const wpTopics = (data?.topicHubs || []).map(mapTopicHubNode);
  const wpSlugs = new Set(wpTopics.map((topic) => topic.slug));
  const mockTopics = topicHubs.filter((topic) => !wpSlugs.has(topic.slug));

  return wpTopics.length > 0 ? [...wpTopics, ...mockTopics] : topicHubs;
}

export async function getAllNewsletterIssues(): Promise<NewsletterIssue[]> {
  const data = await wpFetch<{
    newsletterIssues?: { nodes?: Array<{ slug?: string; title?: string; excerpt?: string }> };
  }>(
    `
      query NewsletterIssues {
        newsletterIssues(first: 100) {
          nodes { slug title excerpt }
        }
      }
    `,
    {},
    ["newsletters"],
  );

  const wpIssues = (data?.newsletterIssues?.nodes || [])
    .filter((issue) => issue.slug)
    .map((issue) => ({
      slug: issue.slug!,
      title: issue.title || issue.slug!,
      description: stripHtml(issue.excerpt || ""),
      heroCopy: stripHtml(issue.excerpt || ""),
      schedule: "",
      ctaLabel: "Subscribe",
      highlightedArticleSlugs: [] as string[],
      seo: {
        title: `${issue.title || issue.slug} | The Sports Rivalry`,
        description: stripHtml(issue.excerpt || ""),
        canonicalPath: `/newsletters/${issue.slug}`,
      },
    }));

  const wpSlugs = new Set(wpIssues.map((issue) => issue.slug));
  const mockIssues = newsletters.filter((issue) => !wpSlugs.has(issue.slug));

  return wpIssues.length > 0 ? [...wpIssues, ...mockIssues] : newsletters;
}

export async function getNewsletterIssue(slug: string): Promise<NewsletterIssue | null> {
  const data = await wpFetch<{ newsletterIssue?: any }>(
    `
      query NewsletterIssue($slug: String!) {
        newsletterIssue(slug: $slug) {
          slug title description heroCopy schedule ctaLabel highlightedArticleSlugs
        }
      }
    `,
    { slug },
    ["newsletter", slug],
  );

  if (data?.newsletterIssue) {
    const node = data.newsletterIssue;

    return {
      slug: node.slug,
      title: node.title,
      description: node.description || "",
      heroCopy: node.heroCopy || "",
      schedule: node.schedule || "",
      ctaLabel: node.ctaLabel || "Subscribe",
      highlightedArticleSlugs: node.highlightedArticleSlugs || [],
      seo: {
        title: `${node.title} | The Sports Rivalry`,
        description: node.description || "",
        canonicalPath: `/newsletters/${node.slug}`,
      },
    };
  }

  return getNewsletterBySlug(slug);
}

export async function getLandingPage(slug: string): Promise<LandingPage | null> {
  const data = await wpFetch<{ landingPage?: any }>(
    `
      query LandingPage($slug: String!) {
        landingPage(slug: $slug) {
          slug title kicker description heroArticleSlug articleSlugs
        }
      }
    `,
    { slug },
    ["landing-page", slug],
  );

  if (data?.landingPage) {
    const node = data.landingPage;

    return {
      slug: node.slug,
      title: node.title,
      kicker: node.kicker || "Event hub",
      description: node.description || "",
      heroArticleSlug: node.heroArticleSlug || node.articleSlugs?.[0] || "",
      articleSlugs: node.articleSlugs || [],
      seo: {
        title: `${node.title} | The Sports Rivalry`,
        description: node.description || "",
        canonicalPath: `/${node.slug}`,
      },
    };
  }

  return getLandingPageBySlug(slug);
}

export async function getRelatedStories(article: Article) {
  if (article.relatedStorySlugs.length) {
    const related = (
      await Promise.all(
        article.relatedStorySlugs.map((slug) => getArticle(article.sport.slug, slug)),
      )
    ).filter(Boolean) as Article[];

    if (related.length) {
      return fillArticleSlots(related, getRelatedArticles(article), 4);
    }
  }

  return getRelatedArticles(article);
}

export async function searchSite(query: string): Promise<SearchResult[]> {
  const trimmed = query.trim();

  if (!trimmed) {
    return [];
  }

  const data = await wpFetch<{ srArticleSearch?: string[] }>(
    `
      query ArticleSearch($query: String!, $first: Int) {
        srArticleSearch(query: $query, first: $first)
      }
    `,
    { query: trimmed, first: 20 },
    ["search", trimmed],
  );

  if (data?.srArticleSearch?.length) {
    const articlesFound = (
      await Promise.all(
        data.srArticleSearch.map(async (slug) => {
          const wpArticles = await getWordPressRecentArticles();
          const match = wpArticles.find((article) => article.slug === slug);

          if (match) {
            return {
              type: "article" as const,
              title: match.title,
              summary: match.excerpt,
              href: match.seo.canonicalPath,
            };
          }

          const mockArticle = getArticleBySlug(slug);

          if (mockArticle) {
            return {
              type: "article" as const,
              title: mockArticle.title,
              summary: mockArticle.excerpt,
              href: mockArticle.seo.canonicalPath,
            };
          }

          return null;
        }),
      )
    ).filter(Boolean) as SearchResult[];

    if (articlesFound.length) {
      return articlesFound;
    }
  }

  return searchMockSite(query);
}

export async function getAllArticlePaths() {
  const wordPressArticles = await getWordPressRecentArticles();
  const paths = [
    ...wordPressArticles.map((article) => article.seo.canonicalPath),
    ...articles.map((article) => `/${article.sport.slug}/${article.slug}`),
  ];

  return Array.from(new Set(paths));
}

export async function getAllSportPaths() {
  return sportHubs.map((sport) => `/${sport.slug}`);
}

export async function getAllLeaguePaths() {
  const data = await wpFetch<{ leagueHubs?: Array<{ sportSlug: string; slug: string }> }>(
    `query { leagueHubs { sportSlug slug } }`,
    {},
    ["leagues"],
  );
  const wpPaths =
    data?.leagueHubs?.map((league) => `/${league.sportSlug}/${league.slug}`) || [];

  return Array.from(
    new Set([...wpPaths, ...leagueHubs.map((league) => `/${league.sport.slug}/${league.slug}`)]),
  );
}

export async function getAllTopicPaths() {
  const data = await wpFetch<{ topicHubs?: Array<{ slug: string }> }>(
    `query { topicHubs { slug } }`,
    {},
    ["topics"],
  );
  const wpPaths = data?.topicHubs?.map((topic) => `/topics/${topic.slug}`) || [];

  return Array.from(new Set([...wpPaths, ...topicHubs.map((topic) => `/topics/${topic.slug}`)]));
}

export async function getAllAuthorPaths() {
  const data = await wpFetch<{ authorProfiles?: Array<{ slug: string }> }>(
    `query { authorProfiles { slug } }`,
    {},
    ["authors"],
  );
  const wpPaths = data?.authorProfiles?.map((author) => `/authors/${author.slug}`) || [];

  return Array.from(new Set([...wpPaths, ...authors.map((author) => `/authors/${author.slug}`)]));
}

export async function getAllNewsletterPaths() {
  const data = await wpFetch<{
    newsletterIssues?: { nodes?: Array<{ slug?: string }> };
  }>(
    `query { newsletterIssues { nodes { slug } } }`,
    {},
    ["newsletters"],
  );
  const wpPaths =
    data?.newsletterIssues?.nodes
      ?.map((issue) => issue.slug)
      .filter(Boolean)
      .map((slug) => `/newsletters/${slug}`) || [];

  return Array.from(
    new Set([...wpPaths, ...newsletters.map((issue) => `/newsletters/${issue.slug}`)]),
  );
}

export async function getAllLandingPaths() {
  const data = await wpFetch<{
    landingPages?: { nodes?: Array<{ slug?: string }> };
  }>(
    `query { landingPages { nodes { slug } } }`,
    {},
    ["landing-pages"],
  );
  const wpPaths =
    data?.landingPages?.nodes
      ?.map((page) => page.slug)
      .filter(Boolean)
      .map((slug) => `/${slug}`) || [];

  return Array.from(new Set([...wpPaths, ...landingPages.map((page) => `/${page.slug}`)]));
}

export async function getNewsSitemapArticles() {
  const fortyEightHoursAgo = Date.now() - 48 * 60 * 60 * 1000;
  const wordPressArticles = await getWordPressRecentArticles();
  const pool = dedupeByKey([...wordPressArticles, ...articles], (article) => article.id);

  return pool.filter(
    (article) => new Date(article.publishedAt).getTime() >= fortyEightHoursAgo,
  );
}

export async function getArticlesForCollection(slugs: string[]) {
  const wordPressArticles = await getWordPressRecentArticles();
  const mockArticles = getArticlesBySlugs(slugs);
  const articleMap = new Map<string, Article>();

  for (const article of [...wordPressArticles, ...mockArticles]) {
    articleMap.set(article.slug, article);
  }

  return slugs
    .map((slug) => articleMap.get(slug))
    .filter(Boolean) as Article[];
}

export async function getSportPageData(slug: string) {
  if (MAIN_SPORT_HUB_SLUGS.includes(slug as (typeof MAIN_SPORT_HUB_SLUGS)[number])) {
    return (await getSportHubPageData(slug))?.sportPageData || fallbackSportPageData(slug);
  }

  return getSportPageDataBySlug(slug);
}
