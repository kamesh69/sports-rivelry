# MLB / Sport Hub Fields (Plan C)

Plan C stores hub settings in WordPress `wp_options` — **not** ACF Pro.

## Storage keys

| Option key | Sport |
|------------|-------|
| `sr_sport_hub_mlb` | MLB (`/mlb`) |
| `sr_sport_hub_basketball` | Basketball |
| `sr_sport_hub_golf` | Golf |
| `sr_sport_hub_nascar` | NASCAR |
| `sr_sport_hub_football` | Football |

Legacy `sr_mlb_hub_settings` is migrated automatically to `sr_sport_hub_mlb`.

## Field prefix pattern

Each sport uses `{sport}_hub_*` keys inside its option array. Example for MLB:

| Key | GraphQL field | Admin UI |
|-----|---------------|----------|
| `mlb_hub_seo_title` | `seoTitle` | Sport Hub form |
| `mlb_hub_seo_description` | `seoDescription` | Sport Hub form |
| `mlb_hub_hero_article` | `hero.articleSlug` | Sport Hub form |
| `mlb_hub_hero_pill_primary` | `hero.pillPrimary` | Sport Hub form |
| `mlb_hub_hero_pill_secondary` | `hero.pillSecondary` | Sport Hub form |
| `mlb_hub_hero_headline` | `hero.headline` | Sport Hub form |
| `mlb_hub_hero_deck` | `hero.deck` | Sport Hub form |
| `mlb_hub_hero_author` | `hero.author` | Sport Hub form |
| `mlb_hub_featured_stories` | `featuredStorySlugs` | Sport Hub form (post IDs) |
| `mlb_hub_headlines` | `headlineSlugs` | Sport Hub form |
| `mlb_hub_trending` | `trendingSlugs` | Sport Hub form |
| `mlb_hub_newsletter_heading` | `newsletterHeading` | Sport Hub form |
| `mlb_hub_newsletter_subheading` | `newsletterSubheading` | Sport Hub form |

## Advanced JSON modules

Edit via **SR Layout → {Sport} Advanced**. Keys use the same `{sport}_hub_*` prefix:

- `{sport}_hub_scoreboard_label`, `{sport}_hub_scoreboard`
- `{sport}_hub_live_game`
- `{sport}_hub_player_spotlight`
- `{sport}_hub_team_hub_tabs`, `{sport}_hub_team_hub_teams`
- `{sport}_hub_matchups_label`, `{sport}_hub_matchups`
- `{sport}_hub_rankings_label`, `{sport}_hub_rankings_column_a`, `{sport}_hub_rankings_column_b`, `{sport}_hub_rankings`
- `{sport}_hub_analytics_label`, `{sport}_hub_stat_leaders`
- `{sport}_hub_video_highlights`, `{sport}_hub_opinions`

Leave empty to use frontend defaults from `lib/sport-page-data.ts`.

## GraphQL

```graphql
query {
  mlbHubSettings { seoTitle hero { articleSlug } }
  sportHubSettings(sport: "basketball") { seoTitle featuredStorySlugs }
}
```

## Homepage settings

Option: `sr_homepage_settings`  
Admin: **SR Layout → Homepage**  
GraphQL: `homepageSettings`

## Stats / teams / rosters

Live MLB stats tables (`/mlb/stats`) and team rosters remain **mock data** in the Next.js app. Editorial scoreboard/rankings on sport hubs are curated via Advanced JSON above. Connect a live stats API in a future phase when budget allows.
