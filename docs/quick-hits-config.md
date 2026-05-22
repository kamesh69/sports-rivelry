# Quick Hits configuration

Quick Hits is the featured block below **Latest News** on the homepage. Editors can control it from WordPress under **SR Layout → Quick Hits**.

## Selection modes

| Mode | Use when |
|------|----------|
| `manual` | Pin exact articles by slug (featured + secondary list) |
| `author_date` | Show stories from one author published on a given day |
| `sport_date` | Show stories from one sport published on a given day |

## Recommended ACF fields (WordPress)

Create an ACF field group on the `sr-quick-hits` options page:

- `quick_hits_enabled` (true/false)
- `quick_hits_title` (text)
- `quick_hits_selection_mode` (select: manual, author_date, sport_date)
- `quick_hits_featured_article` (post object, article CPT)
- `quick_hits_secondary_articles` (relationship, max 4)
- `quick_hits_author` (user or taxonomy, for author_date mode)
- `quick_hits_sport` (sport taxonomy, for sport_date mode)
- `quick_hits_published_date` (date picker, YYYY-MM-DD)
- `quick_hits_secondary_count` (number, default 2)

Expose these fields through WPGraphQL (ACF to GraphQL) and map them in `lib/cms.ts` when wiring homepage data from WordPress.

## Frontend resolver

`resolveQuickHits()` in `lib/mock-data.ts` mirrors the backend rules. Update `quickHitsConfig` (mock) or the WordPress fetch in `getHomePageData()` to change what appears on the homepage without code changes.
