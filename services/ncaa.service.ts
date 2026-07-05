import {
  NCAA_CHAMPIONSHIPS,
  NCAA_COLLEGES,
  NCAA_COLLEGE_SPOTLIGHT_ARTICLES,
  NCAA_CONFERENCES,
  NCAA_HERO_CONTENT,
  NCAA_SPORT_ICON_LINKS,
  NCAA_SPORTS,
  NCAA_VIDEOS,
} from "@/lib/ncaa-data";
import type {
  Championship,
  College,
  CollegeSpotlightArticle,
  Conference,
  NcaaHeroContent,
  Sport,
  SportIconLink,
  Video,
} from "@/lib/ncaa-types";

/**
 * NCAA data access layer.
 *
 * This module is the single place that knows *how* NCAA module content is
 * fetched. Today it reads from the local mock dataset in `lib/ncaa-data.ts`;
 * when a real CMS/API is wired up, only the bodies of these functions need
 * to change. Mirrors the pattern established by `services/team.service.ts`
 * and `services/news.service.ts`.
 */

export async function getHeroContent(): Promise<NcaaHeroContent> {
  return NCAA_HERO_CONTENT;
}

export async function getSports(): Promise<Sport[]> {
  return NCAA_SPORTS;
}

export async function getSportIconLinks(): Promise<SportIconLink[]> {
  return NCAA_SPORT_ICON_LINKS;
}

export async function getChampionships(): Promise<Championship[]> {
  return NCAA_CHAMPIONSHIPS;
}

export async function getColleges(): Promise<College[]> {
  return NCAA_COLLEGES;
}

export async function getCollegeBySlug(slug: string): Promise<College | undefined> {
  return NCAA_COLLEGES.find((college) => college.slug === slug);
}

export async function getCollegeSpotlightArticles(): Promise<CollegeSpotlightArticle[]> {
  return NCAA_COLLEGE_SPOTLIGHT_ARTICLES;
}

export async function getConferences(): Promise<Conference[]> {
  return NCAA_CONFERENCES;
}

export async function getConferenceBySlug(slug: string): Promise<Conference | undefined> {
  return NCAA_CONFERENCES.find((conference) => conference.slug === slug);
}

export async function getCollegesByConference(slug: string): Promise<College[]> {
  return NCAA_COLLEGES.filter((college) => college.conference === slug);
}

export async function getVideos(): Promise<Video[]> {
  return NCAA_VIDEOS;
}

export async function getVideoBySlug(slug: string): Promise<Video | undefined> {
  return NCAA_VIDEOS.find((video) => video.slug === slug);
}
