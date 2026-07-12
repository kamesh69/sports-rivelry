#!/usr/bin/env node

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.thesportsrivalry.com").replace(
  /\/$/,
  "",
);
const wordpressUrl = (process.env.NEXT_PUBLIC_WORDPRESS_URL || "").replace(/\/$/, "");

const siteChecks = [
  "/",
  "/mlb",
  "/mlb/news",
  "/mlb/yankees-red-sox-rivalry-feels-mean-again-because-both-dugouts-need-it",
  "/sitemap.xml",
  "/robots.txt",
  "/api/health/cms",
];

async function checkUrl(path) {
  const url = `${siteUrl}${path}`;

  try {
    const response = await fetch(url, { redirect: "manual" });
    return { path, status: response.status, ok: response.status >= 200 && response.status < 400 };
  } catch (error) {
    return {
      path,
      status: "ERR",
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function checkGraphQL() {
  if (!wordpressUrl) {
    return { ok: false, message: "NEXT_PUBLIC_WORDPRESS_URL is not set" };
  }

  const response = await fetch(`${wordpressUrl}/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query { mlbHubSettings { seoTitle } sportHubSettings(sport: "basketball") { seoTitle } homepageSettings { heroArticleSlug } articles(first: 5) { nodes { slug } } }`,
    }),
  });

  const payload = await response.json();

  if (!response.ok || payload.errors?.length) {
    return {
      ok: false,
      message: payload.errors?.map((error) => error.message).join(", ") || `HTTP ${response.status}`,
    };
  }

  return {
    ok: true,
    seoTitle: payload.data?.mlbHubSettings?.seoTitle || null,
    articleSlugs: payload.data?.articles?.nodes?.map((node) => node.slug) || [],
  };
}

async function checkRevalidate() {
  const response = await fetch(`${siteUrl}/api/revalidate`, { method: "POST" });
  return { ok: response.status === 401, status: response.status };
}

async function main() {
  console.log(`Verifying site: ${siteUrl}`);
  console.log(`WordPress: ${wordpressUrl || "(not configured)"}`);
  console.log("");

  let siteResults = [];
  let siteProbeFailed = false;

  try {
    siteResults = await Promise.all(siteChecks.map(checkUrl));
  } catch (error) {
    siteProbeFailed = true;
    console.log("WARN\tSite probe skipped:", error instanceof Error ? error.message : error);
  }

  const graphql = await checkGraphQL();

  let revalidate = { ok: false, status: "ERR" };

  try {
    revalidate = await checkRevalidate();
  } catch (error) {
    console.log(
      "WARN\tRevalidate probe skipped:",
      error instanceof Error ? error.message : error,
    );
  }

  if (siteResults.length) {
    for (const result of siteResults) {
      console.log(`${result.ok ? "OK" : "FAIL"}\t${result.status}\t${result.path}`);
    }
    console.log("");
  }

  console.log(graphql.ok ? "OK" : "FAIL", "\tGraphQL", graphql.ok ? JSON.stringify(graphql) : graphql.message);
  console.log(
    revalidate.ok ? "OK" : "FAIL",
    `\tPOST /api/revalidate -> ${revalidate.status} (401 expected without auth)`,
  );

  const failed =
    siteProbeFailed ||
    siteResults.some((result) => !result.ok) ||
    !graphql.ok ||
    !revalidate.ok;

  if (failed) {
    process.exitCode = 1;
  }
}

main();
