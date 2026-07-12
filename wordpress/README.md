# WordPress CMS for The Sports Rivalry (Plan C)

Headless WordPress at `https://cms.thesportsrivalry.com` powers MLB articles and the `/mlb` hub. The Next.js frontend on Vercel reads content via WPGraphQL.

**Plan C** — no ACF Pro. Article metadata and MLB Hub settings are stored in native WordPress post meta and `wp_options`, with custom admin screens and GraphQL fields in the mu-plugins.

## Cost profile

| Item | Plan C |
|------|--------|
| ACF Pro | **Not required** |
| WPGraphQL | Free |
| Co-Authors Plus | Free |
| Yoast SEO | Free (optional, for SEO metadata) |
| Classic Editor | Free (article writing UI) |
| Advanced Editor Tools (TinyMCE) | Free (rich toolbar) |
| WordPress hosting | ~$3–6/mo (Hostinger WordPress) |
| Vercel frontend | Free tier OK |

## Quick start (local Docker)

```bash
cd wordpress
chmod +x bootstrap.sh
docker compose up -d
docker compose run --rm wpcli
```

Seeds: `wp sr seed-mlb` and `wp sr seed-sports` run automatically on bootstrap.

Production deploy checklist: `npm run verify:deploy`

- WordPress admin: http://localhost:8080/wp-admin (user `admin`, password `changeme`)
- GraphQL: http://localhost:8080/graphql
- Mu-plugins load automatically from this repo

Local frontend env:

```env
NEXT_PUBLIC_WORDPRESS_URL=http://localhost:8080
```

## Production on Hostinger (or any PHP host)

### 1. Provision WordPress

1. hPanel → **Websites** → **Add Website** → **WordPress**
2. Use subdomain **`cms.thesportsrivalry.com`**
3. Complete the install

### 2. DNS (Hostinger)

**Domains → thesportsrivalry.com → DNS**

| Type | Name | Value |
|------|------|-------|
| A or CNAME | `cms` | Target from Hostinger |

### 3. Install plugins (no ACF)

Upload mu-plugins from `wordpress/wp-content/mu-plugins/` to `wp-content/mu-plugins/` on the server.

Install and activate:

| Plugin | Required |
|--------|----------|
| WPGraphQL | Yes |
| Co-Authors Plus | Recommended |
| Classic Editor | Recommended |
| Advanced Editor Tools (TinyMCE Advanced) | Recommended |
| Yoast SEO | Recommended |

**Do not install** ACF Pro or WPGraphQL for ACF — Plan C replaces them.

### 4. wp-config.php secrets

```php
define('SR_FRONTEND_URL', 'https://www.thesportsrivalry.com');
define('SR_PREVIEW_SECRET', '<same as Vercel WORDPRESS_PREVIEW_SECRET>');
define('SR_REVALIDATE_ENDPOINT', 'https://www.thesportsrivalry.com/api/revalidate');
define('SR_REVALIDATE_SECRET', '<same as Vercel REVALIDATE_SECRET>');
```

Generate secrets: `bash scripts/vercel-env-setup.sh`

### 5. Seed and edit content

1. **SR Layout → Seed MLB Content** (or `wp sr seed-mlb`)
2. **SR Layout → MLB Hub** — hero, featured, headlines, trending
3. **Articles** — use the **Article Fields** meta box (deck, read time, flags)
4. **SR Layout → MLB Advanced JSON** — optional scoreboard/rankings/matchups JSON

### 6. Vercel

```env
NEXT_PUBLIC_WORDPRESS_URL=https://cms.thesportsrivalry.com
NEXT_PUBLIC_SITE_URL=https://www.thesportsrivalry.com
REVALIDATE_SECRET=<shared>
WORDPRESS_PREVIEW_SECRET=<shared>
```

Redeploy after saving.

## Editor workflow (Plan C)

EssentiallySports-style editorial UX on the free tier:

| Task | Where |
|------|-------|
| Publish MLB article | **Articles → Add New** (classic editor, Georgia 12pt toolbar) |
| Source link & summary | Right sidebar → **Source Article Link**, **Article Summary** |
| Sentiment & syndication flags | Right sidebar → **Editorial Signals**, **Syndication** |
| Deck, read time, breaking flag | **Article Fields** meta box |
| Sport / league / topic | Taxonomy boxes on the article screen |
| Tags | Standard **Tags** box (enabled for articles) |
| SEO score & readability | **Yoast SEO** panel (install plugin) |
| Curate `/mlb` hero & rails | **SR Layout → MLB Hub** |
| Scoreboard, rankings, matchups | **SR Layout → MLB Advanced JSON** or leave empty for frontend defaults |

Local Docker installs Classic Editor, TinyMCE Advanced, and Yoast automatically via `bootstrap.sh`.

Field key reference for advanced JSON: [docs/mlb-wordpress-hub-fields.md](../docs/mlb-wordpress-hub-fields.md)

## Verify

```bash
npm run verify:cms
```

Or: `https://www.thesportsrivalry.com/api/health/cms`

## Mu-plugin files

| File | Purpose |
|------|---------|
| `sr-headless-core.php` | CPTs, taxonomies, `mlbHubSettings` GraphQL, revalidation |
| `sr-plan-c-storage.php` | `wp_options` storage for MLB hub |
| `sr-plan-c-admin.php` | SR Layout admin UI + article meta boxes |
| `sr-plan-c-graphql.php` | `articleFields` GraphQL without ACF |
| `sr-sport-hub-storage.php` | Per-sport hub options (`sr_sport_hub_{sport}`) |
| `sr-sport-hub-admin.php` | SR Layout → sport hub screens (MLB, Basketball, Golf, NASCAR, Football) |
| `sr-sport-hub-graphql.php` | `sportHubSettings(sport:)` GraphQL query |
| `sr-homepage-storage.php` | `sr_homepage_settings` option |
| `sr-homepage-admin.php` | SR Layout → Homepage + `homepageSettings` GraphQL |
| `sr-author-profiles.php` | User profile meta + `authorProfile` / `authorProfiles` GraphQL |
| `sr-topic-hub.php` | Topic term meta + `topicHub` / `topicHubs` GraphQL |
| `sr-content-graphql.php` | Newsletters, landing pages, search, video/live blog fields |
| `sr-seed-sports.php` | Seed basketball/golf/nascar/football (`wp sr seed-sports`) |
