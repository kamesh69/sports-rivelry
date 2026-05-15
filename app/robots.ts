import type { MetadataRoute } from "next";
import { SITE_DOMAIN } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/preview"],
    },
    sitemap: [`${SITE_DOMAIN}/sitemap.xml`, `${SITE_DOMAIN}/news-sitemap.xml`],
    host: SITE_DOMAIN,
  };
}
