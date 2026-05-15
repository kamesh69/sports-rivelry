# SEO Launch Checklist

## Technical

- Verify canonical public domain in `NEXT_PUBLIC_SITE_URL`
- Confirm metadata output on homepage, article pages, author pages, and hubs
- Submit `sitemap.xml` and `news-sitemap.xml` to Search Console
- Verify `robots.txt` allows crawl for content paths and disallows internal preview endpoints
- Confirm `max-image-preview:large` is configured in the live robots/meta policy if required at deploy edge
- Validate article, breadcrumb, organization, website, and profile schema

## Editorial

- Every story has:
  - a strong headline
  - a focused deck
  - a featured image at or above 1200px wide
  - a named author
  - a sport taxonomy
  - internal links
  - meta title and description
- Publish About, Editorial Guidelines, Corrections, Contact, and Authors pages before launch
- Establish naming rules for event hubs, league pages, and topic hubs to avoid duplicate intent

## Performance

- Target LCP <= 2.5s
- Target INP <= 200ms
- Target CLS <= 0.1
- Compress imagery and serve modern formats
- Keep ad placeholders layout-stable before ad tags go live

## Measurement

- Set up Google Search Console
- Set up GA4
- Create dashboards for Discover CTR, search CTR, index coverage, and top landing pages
- Track newsletter CTA conversion separately from organic traffic growth
