import { SITE_DOMAIN } from "@/lib/site-config";

const wordpressBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL?.replace(/\/$/, "") || "";

async function probeGraphQL() {
  if (!wordpressBaseUrl) {
    return {
      configured: false,
      ok: false,
      message: "NEXT_PUBLIC_WORDPRESS_URL is not set",
    };
  }

  const endpoint = `${wordpressBaseUrl}/graphql`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query CmsHealth {
            mlbHubSettings { seoTitle }
            sportHubSettings(sport: "basketball") { seoTitle }
            homepageSettings { heroArticleSlug }
            articles(where: { status: PUBLISH }, first: 1) {
              nodes { slug sports { nodes { slug } } }
            }
          }
        `,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        configured: true,
        ok: false,
        endpoint,
        message: `GraphQL HTTP ${response.status}`,
      };
    }

    const payload = (await response.json()) as {
      data?: {
        mlbHubSettings?: { seoTitle?: string | null } | null;
        sportHubSettings?: { seoTitle?: string | null } | null;
        homepageSettings?: { heroArticleSlug?: string | null } | null;
        articles?: { nodes?: Array<{ slug?: string; sports?: { nodes?: Array<{ slug?: string }> } }> };
      };
      errors?: Array<{ message: string }>;
    };

    if (payload.errors?.length) {
      return {
        configured: true,
        ok: false,
        endpoint,
        message: payload.errors.map((error) => error.message).join(", "),
      };
    }

    return {
      configured: true,
      ok: true,
      endpoint,
      mlbHubSeoTitle: payload.data?.mlbHubSettings?.seoTitle || null,
      basketballHubSeoTitle: payload.data?.sportHubSettings?.seoTitle || null,
      homepageHeroSlug: payload.data?.homepageSettings?.heroArticleSlug || null,
      sampleArticleSlug: payload.data?.articles?.nodes?.[0]?.slug || null,
    };
  } catch (error) {
    return {
      configured: true,
      ok: false,
      endpoint,
      message: error instanceof Error ? error.message : "GraphQL probe failed",
    };
  }
}

export async function GET() {
  const cms = await probeGraphQL();

  return Response.json({
    ok: cms.ok,
    site: SITE_DOMAIN,
    wordpress: cms,
    revalidateSecretConfigured: Boolean(process.env.REVALIDATE_SECRET),
    previewSecretConfigured: Boolean(process.env.WORDPRESS_PREVIEW_SECRET),
    checkedAt: new Date().toISOString(),
  });
}
