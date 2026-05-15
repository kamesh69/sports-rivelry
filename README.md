# Sports Rivelry

Sports Rivelry is a headless sports publishing starter built with Next.js App Router on the frontend and WordPress as the editorial CMS. The codebase is shaped for an India-first, editorial-first launch modeled on the rhythm of EssentiallySports, with clear room for ESPN-style utility layers later.

## What is included

- A responsive homepage with hero, news river, sport rails, trending, authors, trust pages, and newsletter CTA modules
- Clean dynamic routes for sport hubs, league hubs, articles, author pages, topic pages, newsletters, and event landing pages
- Metadata, JSON-LD, XML sitemap, news sitemap, robots.txt, and preview/revalidation endpoints
- A WordPress mu-plugin starter for post types, taxonomies, ACF options, preview links, and frontend revalidation
- Mock content so the UI can run immediately before the CMS is connected

## Getting started

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
3. Set `NEXT_PUBLIC_WORDPRESS_URL` to your WordPress origin when the CMS is ready.
4. Run `npm install`.
5. Run `npm run dev`.

## Core environment variables

- `NEXT_PUBLIC_SITE_URL`: canonical public origin, for example `https://sportsrivelry.com`
- `NEXT_PUBLIC_WORDPRESS_URL`: WordPress base URL, for example `https://cms.sportsrivelry.com`
- `WORDPRESS_PREVIEW_SECRET`: shared secret used by the preview route
- `REVALIDATE_SECRET`: shared secret used by the revalidate webhook
- `WORDPRESS_REVALIDATE_ENDPOINT`: frontend webhook URL stored on the WordPress side

## WordPress stack

Recommended plugin stack:

- ACF Pro
- WPGraphQL
- WPGraphQL for ACF
- Yoast SEO
- Co-Authors Plus
- PublishPress or Edit Flow

The mu-plugin starter lives at [wordpress/wp-content/mu-plugins/sr-headless-core.php](/Users/kameshkhatri/Desktop/sports%20website/wordpress/wp-content/mu-plugins/sr-headless-core.php).

## Architecture notes

- The frontend uses a repository layer in `lib/cms.ts`.
- When WordPress is not configured or unavailable, the site falls back to `lib/mock-data.ts`.
- The route pair `app/[primary]/page.tsx` and `app/[primary]/[secondary]/page.tsx` resolves clean URLs like `/cricket`, `/cricket/ipl`, and `/cricket/story-slug`.

Additional implementation notes live in:

- [docs/architecture.md](/Users/kameshkhatri/Desktop/sports%20website/docs/architecture.md)
- [docs/wordpress-setup.md](/Users/kameshkhatri/Desktop/sports%20website/docs/wordpress-setup.md)
- [docs/seo-launch-checklist.md](/Users/kameshkhatri/Desktop/sports%20website/docs/seo-launch-checklist.md)
