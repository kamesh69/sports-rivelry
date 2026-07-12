# WordPress Setup (Plan C)

Plan C uses **native WordPress storage** — no ACF Pro, no WPGraphQL for ACF.

## Required stack

- Self-hosted WordPress (Hostinger, Oracle Cloud free tier, or Docker locally)
- WPGraphQL
- Co-Authors Plus (recommended)
- Classic Editor (recommended)
- Advanced Editor Tools / TinyMCE Advanced (recommended)
- Yoast SEO (recommended)

## Automated setup from this repo

Mu-plugins register article meta boxes, MLB Hub admin screens, GraphQL `articleFields`, and the `mlbHubSettings` query.

- [wordpress/README.md](../wordpress/README.md) — hosting + DNS
- [wordpress/wp-content/mu-plugins/](../wordpress/wp-content/mu-plugins/) — upload entire folder

Local Docker:

```bash
cd wordpress
docker compose up -d
docker compose run --rm wpcli
```

## Required configuration

1. Upload all files from `wordpress/wp-content/mu-plugins/` to the server.
2. In `wp-config.php`:

```php
define('SR_FRONTEND_URL', 'https://www.thesportsrivalry.com');
define('SR_PREVIEW_SECRET', 'replace-me');
define('SR_REVALIDATE_ENDPOINT', 'https://www.thesportsrivalry.com/api/revalidate');
define('SR_REVALIDATE_SECRET', 'replace-me');
```

3. Install WPGraphQL + Co-Authors Plus + Classic Editor + TinyMCE Advanced + Yoast SEO.
4. Run **SR Layout → Seed MLB Content** or `wp sr seed-mlb`.
5. Assign `sport: mlb` on every MLB article.

## Editorial screen (EssentiallySports-style)

Articles use the **Classic Editor** (not Gutenberg) with a rich toolbar (Georgia 12pt default).

| Box | Purpose |
|-----|---------|
| Source Article Link | Required reference URL for the story |
| Article Summary | Deck text for cards/SEO (syncs to Deck when empty) |
| Editorial Signals | Sentiment dropdown |
| Syndication | MSN / Yahoo publish flags (future workflows) |
| Article Fields | Deck, read time, breaking, editor's pick, trending |
| Tags | Standard WordPress tags on articles |
| Yoast SEO | SEO title, meta, readability (when plugin active) |

## Author slug reference

| WP user slug | Display name |
|--------------|--------------|
| `miles-donovan` | Miles Donovan |
| `tessa-cole` | Tessa Cole |
| `reese-mercer` | Reese Mercer |
| `chase-holloway` | Chase Holloway |

New authors still render via the WordPress author fallback in `lib/cms.ts`.

## MLB editorial setup

- Publish in the `article` CPT with `sport` term `mlb`.
- Article extras: **Article Fields** meta box on the post screen.
- Hub curation: **SR Layout → MLB Hub**.
- Advanced modules: **SR Layout → MLB Advanced JSON** (or leave empty for frontend defaults in `lib/sport-page-data.ts`).

## Verify

```bash
npm run verify:cms
```
