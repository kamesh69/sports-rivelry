# Vercel deployment

## 1. Connect the repository

1. In [Vercel](https://vercel.com), import the GitHub repo `kamesh69/sports-rivalry`.
2. Framework preset: **Next.js** (auto-detected).
3. Root directory: repository root.
4. Build command: `npm run build` (default).

## 2. Environment variables

In **Project → Settings → Environment Variables**, add these for **Production**, **Preview**, and **Development**:

| Variable | Example value | Notes |
|----------|---------------|--------|
| `NEXT_PUBLIC_SITE_URL` | `https://thesportsrivalry.com` | Your Vercel/custom domain |
| `NEXT_PUBLIC_WORDPRESS_URL` | `https://cms.thesportsrivalry.com` | Optional until CMS is live |
| `REVALIDATE_SECRET` | *(openssl rand -base64 32)* | Must match WordPress `SR_REVALIDATE_SECRET` |
| `WORDPRESS_PREVIEW_SECRET` | *(openssl rand -base64 32)* | Must match WordPress `SR_PREVIEW_SECRET` |

`WORDPRESS_REVALIDATE_ENDPOINT` is only stored in WordPress (`wp-config.php`), not in the Next.js app.

After the first deploy, use your live URL in WordPress:

```php
define('SR_FRONTEND_URL', 'https://thesportsrivalry.com');
define('SR_PREVIEW_SECRET', 'same-as-WORDPRESS_PREVIEW_SECRET');
define('SR_REVALIDATE_ENDPOINT', 'https://thesportsrivalry.com/api/revalidate');
define('SR_REVALIDATE_SECRET', 'same-as-REVALIDATE_SECRET');
```

## 3. Domain

1. Add `thesportsrivalry.com` under **Domains**.
2. Point DNS to Vercel (A/CNAME as shown in the dashboard).
3. Redeploy after changing `NEXT_PUBLIC_SITE_URL` if you used a preview URL first.

## 4. Verify

- Homepage loads with mock content (WordPress optional).
- `https://your-domain.com/sitemap.xml`
- `https://your-domain.com/api/revalidate` returns 401 without auth (expected).
- After WordPress is connected, publish an article and confirm the homepage updates within ~1 minute.

## 5. Local development

```bash
cp .env.example .env.local
# Edit secrets in .env.local, then:
npm install
npm run dev
```
