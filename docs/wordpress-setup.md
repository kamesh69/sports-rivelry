# WordPress Setup

## Recommended stack

- Managed WordPress host with separate staging and production environments
- ACF Pro
- WPGraphQL
- WPGraphQL for ACF
- Yoast SEO
- Co-Authors Plus
- PublishPress or Edit Flow

## Required configuration

1. Place [sr-headless-core.php](/Users/kameshkhatri/Desktop/sports%20website/wordpress/wp-content/mu-plugins/sr-headless-core.php) in `wp-content/mu-plugins/`.
2. In `wp-config.php`, define:

```php
define('SR_FRONTEND_URL', 'https://sportsrivalry.com');
define('SR_PREVIEW_SECRET', 'replace-me');
define('SR_REVALIDATE_ENDPOINT', 'https://sportsrivalry.com/api/revalidate');
define('SR_REVALIDATE_SECRET', 'replace-me');
```

3. Enable the recommended plugins.
4. Create ACF field groups for:
   - article fields: deck, read time, canonical override, source references, related stories, trending score, is breaking, is editor’s pick
   - author profile fields: expertise summary, beat, avatar, social links
   - option pages: home layout, hero slots, newsletter slots, trending config, ad placements
5. Assign at least one `sport` taxonomy term to every article.

## Editorial workflows to enable

- roles for admin, editor, section editor, writer, and SEO reviewer
- scheduled publishing
- revision tracking
- correction notes
- co-author support
- redirect management via Yoast Premium or Redirection

## Preview and revalidation

- WordPress preview links point to the Next.js `/api/preview` route.
- On update, the mu-plugin posts to `/api/revalidate` with affected paths.
- Revalidate home, sport hubs, league hubs, topic hubs, author pages, search, and the primary content URL.
