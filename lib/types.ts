import type { Metadata } from "next";

export interface MediaAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface SocialLink {
  platform: string;
  label: string;
  url: string;
}

export interface SeoMeta {
  title: string;
  description: string;
  canonicalPath: string;
  keywords?: string[];
  ogImage?: MediaAsset;
  noIndex?: boolean;
  metadata?: Metadata;
}

export interface SportSummary {
  slug: string;
  name: string;
  description: string;
  accent: string;
}

export interface LeagueSummary {
  slug: string;
  name: string;
  sportSlug: string;
  seasonLabel: string;
  description: string;
}

export interface AuthorProfile {
  id: string;
  slug: string;
  name: string;
  role: string;
  beat: string;
  bio: string;
  expertise: string;
  avatar: MediaAsset;
  socials: SocialLink[];
  seo: SeoMeta;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  deck: string;
  bodyHtml: string;
  featuredImage: MediaAsset;
  sport: SportSummary;
  league?: LeagueSummary;
  authors: AuthorProfile[];
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  topicSlugs: string[];
  tags: string[];
  seo: SeoMeta;
  relatedStorySlugs: string[];
  trendingScore: number;
  isBreaking?: boolean;
  isEditorsPick?: boolean;
}

export interface TopicHub {
  slug: string;
  title: string;
  description: string;
  articleSlugs: string[];
  seo: SeoMeta;
}

export interface LeagueHub {
  slug: string;
  name: string;
  sport: SportSummary;
  seasonLabel: string;
  description: string;
  articleSlugs: string[];
  seo: SeoMeta;
}

export interface SportHub {
  slug: string;
  name: string;
  description: string;
  accent: string;
  heroArticleSlug: string;
  featuredArticleSlugs: string[];
  editorsPickSlugs: string[];
  leagueSlugs: string[];
  seo: SeoMeta;
}

export interface NewsletterIssue {
  slug: string;
  title: string;
  description: string;
  heroCopy: string;
  schedule: string;
  ctaLabel: string;
  highlightedArticleSlugs: string[];
  seo: SeoMeta;
}

export interface LandingPage {
  slug: string;
  title: string;
  kicker: string;
  description: string;
  heroArticleSlug: string;
  articleSlugs: string[];
  seo: SeoMeta;
}

export interface HomePageData {
  breakingNews: Article[];
  heroArticle: Article;
  heroSecondary: Article[];
  latestArticles: Article[];
  sportRails: Array<{
    sport: SportSummary;
    articles: Article[];
  }>;
  trendingArticles: Article[];
  editorsPicks: Article[];
  newsletter: NewsletterIssue;
  featuredAuthors: AuthorProfile[];
}

export interface SearchResult {
  type: "article" | "author" | "topic" | "sport" | "league" | "landing";
  title: string;
  href: string;
  summary: string;
}
