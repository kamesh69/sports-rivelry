import type { MediaAsset } from "@/lib/types";

/**
 * Domain types for the NCAA module. Mirrors the shape conventions already
 * established in `lib/types.ts` / `lib/news-types.ts` so the module can be
 * swapped from mock data to a real API without touching component code.
 */

export interface NcaaHeroStat {
  label: string;
  value: string;
}

export interface NcaaHeroContent {
  eyebrow: string;
  headline: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  image: MediaAsset;
  stats: NcaaHeroStat[];
  /** Right-panel season label, e.g. "2024-25 SEASON". */
  seasonLabel: string;
  /** Right-panel footer tagline. */
  tagline: string;
}

export interface Sport {
  id: string;
  slug: string;
  name: string;
  image: string;
  storyCount: number;
  isLive?: boolean;
  rankingsHref?: string;
}

export interface SportIconLink {
  id: string;
  slug: string;
  name: string;
}

export interface Championship {
  id: string;
  slug: string;
  name: string;
  logoVariant: string;
  daysRemaining: number;
  subtitle: string;
  /** Optional accent color for the countdown number (e.g. light blue on Football). */
  accentColor?: string;
}

export interface NcaaNewsArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  image: MediaAsset;
  category: string;
  featured?: boolean;
}

export interface RankingEntry {
  rank: number;
  team: string;
  record?: string;
  trend?: "up" | "down" | "flat";
  trendAmount?: number;
}

export interface RankingGroup {
  id: string;
  sportSlug: string;
  sportName: string;
  pollLabel?: string;
  entries: RankingEntry[];
}

export interface College {
  id: string;
  slug: string;
  name: string;
  logo: string;
  conference?: string;
  accent: string;
}

export interface CollegeSpotlightArticle {
  id: string;
  slug: string;
  category: string;
  title: string;
  summary: string;
  image: MediaAsset;
  href: string;
  ctaLabel: string;
}

export interface Conference {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  accent: string;
}

export interface Video {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  duration: string;
  thumbnail: MediaAsset;
  href: string;
}
