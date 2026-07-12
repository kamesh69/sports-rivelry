import type { MetadataRoute } from "next";
import {
  getAllArticlePaths,
  getAllAuthorPaths,
  getAllLandingPaths,
  getAllLeaguePaths,
  getAllNewsletterPaths,
  getAllSportPaths,
  getAllTopicPaths,
} from "@/lib/cms";
import { SITE_DOMAIN } from "@/lib/site-config";
import { getLatestNews as getLatestNcaaNews } from "@/services/ncaa-news.service";
import { getColleges, getConferences, getVideos } from "@/services/ncaa.service";
import { getNcaaCollegePath, getNcaaConferencePath, getNcaaNewsPath, getNcaaVideoPath, NCAA_PATH } from "@/lib/navigation";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pathGroups, ncaaNews, ncaaColleges, ncaaConferences, ncaaVideos] = await Promise.all([
    Promise.all([
      getAllSportPaths(),
      getAllLeaguePaths(),
      getAllArticlePaths(),
      getAllTopicPaths(),
      getAllAuthorPaths(),
      getAllNewsletterPaths(),
      getAllLandingPaths(),
    ]),
    getLatestNcaaNews(100),
    getColleges(),
    getConferences(),
    getVideos(),
  ]);

  const ncaaPaths = [
    NCAA_PATH,
    `${NCAA_PATH}/news`,
    `${NCAA_PATH}/rankings`,
    `${NCAA_PATH}/colleges`,
    `${NCAA_PATH}/conferences`,
    `${NCAA_PATH}/videos`,
    ...ncaaNews.map((article) => getNcaaNewsPath(article.slug)),
    ...ncaaColleges.map((college) => getNcaaCollegePath(college.slug)),
    ...ncaaConferences.map((conference) => getNcaaConferencePath(conference.slug)),
    ...ncaaVideos.map((video) => getNcaaVideoPath(video.slug)),
  ];

  return [
    "/",
    "/about",
    "/advertise",
    "/authors",
    "/editorial-team",
    "/editorial-guidelines",
    "/take-down-policy",
    "/contact",
    "/faqs",
    "/privacy-policy",
    "/terms-of-use",
    "/fact-checking-policy",
    "/corrections",
    "/search",
    "/mlb/news",
    "/mlb/stats",
    "/mlb/teams",
    ...pathGroups.flat(),
    ...ncaaPaths,
  ].map((path) => ({
    url: `${SITE_DOMAIN}${path}`,
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
