# Hostinger Deployment

This project is prepared for the following production setup:

- Frontend: `https://thesportsrivalry.com`
- WordPress CMS: `https://cms.thesportsrivalry.com`

## 1. Deploy the Next.js frontend

Use a Hostinger hosting plan that supports Node.js apps.

In hPanel:

1. Go to `Websites`.
2. Click `Add website`.
3. Choose `Node.js`.
4. Choose `Import Git Repository`.
5. Connect the GitHub repo:
   - `https://github.com/kamesh69/sports-rivelry`
6. Use Node `22.x` if Hostinger offers that version.
7. Add these environment variables:

```env
NEXT_PUBLIC_SITE_URL=https://thesportsrivalry.com
NEXT_PUBLIC_WORDPRESS_URL=https://cms.thesportsrivalry.com
REVALIDATE_SECRET=replace-with-a-strong-random-string
WORDPRESS_PREVIEW_SECRET=replace-with-a-strong-random-string
WORDPRESS_REVALIDATE_ENDPOINT=https://thesportsrivalry.com/api/revalidate
```

8. Deploy first on a temporary Hostinger domain if hPanel asks for one.
9. After the app builds, click `Connect domain` and attach `thesportsrivalry.com`.
10. Point `www.thesportsrivalry.com` to the same frontend if desired.

## 2. Create the WordPress CMS

In hPanel:

1. Go to `Websites`.
2. Click `Add website`.
3. Choose `WordPress`.
4. Set the site address to `cms.thesportsrivalry.com`.
5. Install:
   - ACF Pro
   - WPGraphQL
   - WPGraphQL for ACF
   - Yoast SEO
   - Co-Authors Plus
   - PublishPress or Edit Flow

Upload the MU plugin from:

- [wordpress/wp-content/mu-plugins/sr-headless-core.php](/Users/kameshkhatri/Desktop/sports website/wordpress/wp-content/mu-plugins/sr-headless-core.php)

In `wp-config.php`, add:

```php
define('SR_FRONTEND_URL', 'https://thesportsrivalry.com');
define('SR_PREVIEW_SECRET', 'use-the-same-preview-secret');
define('SR_REVALIDATE_ENDPOINT', 'https://thesportsrivalry.com/api/revalidate');
define('SR_REVALIDATE_SECRET', 'use-the-same-revalidate-secret');
```

## 3. Verify the publish flow

Check these in order:

1. Frontend loads on `https://thesportsrivalry.com`
2. WordPress admin loads on `https://cms.thesportsrivalry.com/wp-admin`
3. Preview links open the Next.js preview route
4. Publishing an article updates the frontend within about one minute
5. `https://thesportsrivalry.com/sitemap.xml` loads
6. `https://thesportsrivalry.com/news-sitemap.xml` loads

## 4. Notes

- This repo currently uses mock content until WordPress is connected.
- If Hostinger asks for a domain and your main domain is already attached elsewhere, deploy to a temporary domain first and connect the custom domain after the first successful build.
- SSL should be issued automatically after the domain is connected and DNS settles.
