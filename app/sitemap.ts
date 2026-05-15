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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pathGroups = await Promise.all([
    getAllSportPaths(),
    getAllLeaguePaths(),
    getAllArticlePaths(),
    getAllTopicPaths(),
    getAllAuthorPaths(),
    getAllNewsletterPaths(),
    getAllLandingPaths(),
  ]);

  return ["/", "/about", "/editorial-guidelines", "/corrections", "/contact", "/authors", "/search", ...pathGroups.flat()].map(
    (path) => ({
      url: `${SITE_DOMAIN}${path}`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: path === "/" ? 1 : 0.7,
    }),
  );
}
