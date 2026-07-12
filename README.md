# The Sports Rivalry

The Sports Rivalry is a headless sports publishing starter built with Next.js App Router on the frontend and WordPress as the editorial CMS. The codebase is shaped for an India-first, editorial-first launch modeled on the rhythm of EssentiallySports, with clear room for ESPN-style utility layers later.

## What is included

- A responsive homepage with latest news, quick hits, sport rails, trending, authors, trust pages, and newsletter CTA modules
- Clean dynamic routes for sport hubs, league hubs, articles, author pages, topic pages, newsletters, and event landing pages
- Metadata, JSON-LD, XML sitemap, news sitemap, robots.txt, and preview/revalidation endpoints
- A WordPress mu-plugin starter for post types, taxonomies, ACF options, preview links, and frontend revalidation
- Mock content so the UI can run immediately before the CMS is connected

## Getting started

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SITE_URL` to your production domain (or `http://localhost:3000` locally).
3. Set `NEXT_PUBLIC_WORDPRESS_URL` to your WordPress origin when the CMS is ready.
4. Generate secrets: `openssl rand -base64 32` for `REVALIDATE_SECRET` and `WORDPRESS_PREVIEW_SECRET`.
5. Run `npm install`.
6. Run `npm run dev`.

## Image standards

Upload featured images at **1600×900 (16:9)**. See [docs/image-upload-standards.md](docs/image-upload-standards.md).

## Deploy on Vercel

See [docs/vercel-deployment.md](docs/vercel-deployment.md) for environment variables and domain setup.

Generate shared CMS secrets: `bash scripts/vercel-env-setup.sh`

## Core environment variables

- `NEXT_PUBLIC_SITE_URL`: canonical public origin, for example `https://thesportsrivalry.com`
- `NEXT_PUBLIC_WORDPRESS_URL`: WordPress base URL, for example `https://cms.thesportsrivalry.com`
- `WORDPRESS_PREVIEW_SECRET`: shared secret used by the preview route
- `REVALIDATE_SECRET`: shared secret used by the revalidate webhook
- `WORDPRESS_REVALIDATE_ENDPOINT`: frontend webhook URL stored on the WordPress side

## WordPress stack (Plan C)

No ACF Pro required. See [wordpress/README.md](wordpress/README.md) and [docs/wordpress-setup.md](docs/wordpress-setup.md).

Required plugins: **WPGraphQL**, **Co-Authors Plus** (optional Yoast SEO).

Upload all mu-plugins from [wordpress/wp-content/mu-plugins/](wordpress/wp-content/mu-plugins/).

For the MLB hub rollout, editors should publish from a separate WordPress admin such as `https://cms.<frontend-domain>/wp-admin`, manage landing-page modules in `SR Layout -> MLB Hub`, and use canonical article URLs at `/mlb/:slug`.

## Architecture notes

- The frontend uses a repository layer in `lib/cms.ts`.
- When WordPress is not configured or unavailable, the site falls back to `lib/mock-data.ts`.
- The route pair `app/[primary]/page.tsx` and `app/[primary]/[secondary]/page.tsx` resolves clean URLs like `/mlb`, `/basketball/nba`, and `/football/story-slug`.

Additional implementation notes live in:

- [docs/architecture.md](/Users/kameshkhatri/Desktop/sports%20website/docs/architecture.md)
- [docs/vercel-deployment.md](/Users/kameshkhatri/Desktop/sports%20website/docs/vercel-deployment.md)
- [docs/hostinger-deployment.md](/Users/kameshkhatri/Desktop/sports%20website/docs/hostinger-deployment.md)
- [docs/quick-hits-config.md](/Users/kameshkhatri/Desktop/sports%20website/docs/quick-hits-config.md)
- [docs/mlb-wordpress-hub-fields.md](/Users/kameshkhatri/Desktop/sports%20website/docs/mlb-wordpress-hub-fields.md)
- [docs/wordpress-setup.md](/Users/kameshkhatri/Desktop/sports%20website/docs/wordpress-setup.md)
- [docs/seo-launch-checklist.md](/Users/kameshkhatri/Desktop/sports%20website/docs/seo-launch-checklist.md)
