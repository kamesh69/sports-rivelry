import { getNewsSitemapArticles } from "@/lib/cms";
import { SITE_DOMAIN, SITE_NAME } from "@/lib/site-config";

export async function GET() {
  const articles = await getNewsSitemapArticles();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${articles
  .map(
    (article) => `<url>
  <loc>${SITE_DOMAIN}/${article.sport.slug}/${article.slug}</loc>
  <news:news>
    <news:publication>
      <news:name>${SITE_NAME}</news:name>
      <news:language>en</news:language>
    </news:publication>
    <news:publication_date>${article.publishedAt}</news:publication_date>
    <news:title><![CDATA[${article.title}]]></news:title>
  </news:news>
</url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
