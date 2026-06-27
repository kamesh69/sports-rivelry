import type { Metadata } from "next";

export interface MediaAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  credit?: string;
}

export interface SocialLink {
  platform: string;
  label: string;
  url: string;
}

export interface NavItem {
  slug: string;
  label: string;
  href?: string;
  disabled?: boolean;
}

export interface FooterLinkGroup {
  title: string;
  links: Array<{
    href: string;
    label: string;
  }>;
}

export interface TeamIdentity {
  name: string;
  shortName: string;
  primaryColor: string;
  accentColor: string;
  textColor?: string;
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
  featuredTeams?: TeamIdentity[];
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
  featuredTeams?: TeamIdentity[];
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

export type QuickHitsSelectionMode = "manual" | "author_date" | "sport_date";

export interface QuickHitsConfig {
  enabled: boolean;
  title: string;
  selectionMode: QuickHitsSelectionMode;
  featuredArticleSlug?: string;
  secondaryArticleSlugs?: string[];
  authorSlug?: string;
  sportSlug?: string;
  publishedDate?: string;
  secondaryCount?: number;
}

export interface QuickHitsBlock {
  config: QuickHitsConfig;
  featured: Article;
  secondary: Article[];
}

export interface HomePageData {
  breakingNews: Article[];
  topHeadlines: Article[];
  heroArticle: Article;
  heroSecondary: Article[];
  latestArticles: Article[];
  categoryStrip: NavItem[];
  quickHits: QuickHitsBlock | null;
  sportRails: Array<{
    sport: SportSummary;
    articles: Article[];
  }>;
  trendingArticles: Article[];
  editorsPicks: Article[];
  recommendedReads: Article[];
  newsletter: NewsletterIssue;
  featuredAuthors: AuthorProfile[];
}

export interface FanZoneCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  href?: string;
  sortOrder: number;
}

export interface FanZoneContent {
  heading: string;
  subheading: string;
  ctaLabel: string;
  ctaHref: string;
  cards: FanZoneCard[];
}

export interface FanPollOption {
  id: string;
  label: string;
  votes: number;
}

export interface FanPoll {
  id: string;
  question: string;
  isActive: boolean;
  options: FanPollOption[];
}

export interface SearchResult {
  type: "article" | "author" | "topic" | "sport" | "league" | "landing";
  title: string;
  href: string;
  summary: string;
}

/* ---- Sport league page (dark template) ---- */

export interface SportLeagueTab {
  label: string;
  href: string;
  active?: boolean;
}

export interface SportNavConfig {
  /** Brand mark monogram shown in the league sub-nav (e.g. "SR"). */
  mark: string;
  /** Wordmark shown next to the mark (e.g. "Hoop Report"). */
  wordmark: string;
  /** League/section tabs across the sub-nav. */
  tabs: SportLeagueTab[];
}

export interface ScoreTeam {
  name: string;
  shortName: string;
  primaryColor: string;
  accentColor: string;
  textColor?: string;
  score?: number;
  record?: string;
  isWinner?: boolean;
}

export interface LiveGame {
  status: string;
  isLive?: boolean;
  clock?: string;
  home: ScoreTeam;
  away: ScoreTeam;
  note?: string;
}

export interface ScoreboardGame {
  status: string;
  isLive?: boolean;
  away: ScoreTeam;
  home: ScoreTeam;
  detail?: string;
}

export interface PlayerStatLine {
  player: string;
  meta: string;
  monogram: string;
  stats: Array<{ label: string; value: string }>;
  footnote?: string;
}

export interface TeamStanding {
  rank: number;
  team: TeamIdentity;
  record: string;
  trend: "up" | "down" | "flat";
  trendLabel: string;
  statA: string;
  statB: string;
}

export interface StatLeader {
  category: string;
  player: string;
  monogram: string;
  value: string;
  team: string;
  image?: MediaAsset;
}

export interface Matchup {
  status: string;
  isLive?: boolean;
  teams: ScoreTeam[];
  info?: string;
}

export interface VideoHighlight {
  title: string;
  duration: string;
  image: MediaAsset;
  href?: string;
  featured?: boolean;
}

export interface OpinionItem {
  title: string;
  author: string;
  monogram: string;
  href?: string;
}

export interface SportPageData {
  navConfig: SportNavConfig;
  hero: {
    pillPrimary: string;
    pillSecondary?: string;
    headline: string;
    deck: string;
    author: string;
    date: string;
    readTime: number;
    href: string;
    image: MediaAsset;
  };
  liveGame?: LiveGame;
  playerSpotlight?: PlayerStatLine;
  scoreboard: ScoreboardGame[];
  scoreboardLabel: string;
  teamHub?: {
    tabs: string[];
    teams: Array<{ team: TeamIdentity; meta: string }>;
  };
  matchupsLabel: string;
  matchups: Matchup[];
  rankingsLabel: string;
  rankingsColumns: [string, string];
  rankings: TeamStanding[];
  analyticsLabel: string;
  statLeaders: StatLeader[];
  videoHighlights: VideoHighlight[];
  opinions: OpinionItem[];
  newsletter: {
    heading: string;
    subheading: string;
  };
}
