# Architecture

## Frontend

- Framework: Next.js App Router
- Rendering: SSR + ISR with 60-second default revalidation
- Design system: custom CSS variables, editorial card modules, responsive hub layouts
- Dynamic routes:
  - `/`
  - `/search`
  - `/<sport>`
  - `/<sport>/<league-or-article-slug>`
  - `/topics/<slug>`
  - `/authors/<slug>`
  - `/newsletters/<slug>`
  - `/<event-hub>`

## CMS contract

- WordPress is the editorial source of truth
- Core entities:
  - `article`
  - `live_blog`
  - `video`
  - `newsletter_issue`
  - `landing_page`
- Core taxonomies:
  - `sport`
  - `league`
  - `team`
  - `tournament`
  - `topic`

## Data flow

1. Editors create or update content in WordPress.
2. WordPress stores structured fields via ACF and exposes content through WPGraphQL.
3. The Next.js repository layer maps WordPress nodes into normalized frontend entities.
4. Saving content can trigger the revalidation webhook to refresh impacted pages.
5. If WordPress is not connected yet, the frontend renders from mock data with the same entity shape.

## Why the route resolver matters

`/<sport>/<slug>` is shared by both article pages and league hubs in the product spec. Next.js cannot represent those as two separate file-system routes, so the implementation resolves the second segment at runtime:

- if it matches a league slug for the sport, render the league hub
- otherwise, treat it as an article slug

That keeps the public URL shape clean without adding `/articles/` or `/leagues/` prefixes.
