# Hostinger CMS Deployment

Production setup:

| Service | URL | Host |
|---------|-----|------|
| Next.js frontend | `https://www.thesportsrivalry.com` | Vercel |
| WordPress CMS | `https://cms.thesportsrivalry.com` | Hostinger |

The frontend on Vercel fetches content from WordPress via WPGraphQL. **Use Hostinger (or any normal PHP host)** — free hosts that block server-side API calls (e.g. InfinityFree) will not work with a headless setup.

---

## Phase 1 — Hostinger WordPress

### 1. Get hosting

In Hostinger hPanel:

1. **Websites → Add Website → WordPress**
2. Use subdomain **`cms.thesportsrivalry.com`**
3. Complete the WordPress install and note admin credentials

### 2. DNS

**Domains → thesportsrivalry.com → DNS**

| Type | Name | Value |
|------|------|-------|
| A or CNAME | `cms` | Hostinger target (shown in hPanel after adding the site) |

Remove any old `cms` record pointing to InfinityFree (`185.27.134.215`).

SSL is issued automatically once DNS propagates (usually minutes on Hostinger).

### 3. Upload mu-plugins

In hPanel **File Manager** (or SFTP), upload everything from:

```
wordpress/wp-content/mu-plugins/
```

to:

```
domains/cms.thesportsrivalry.com/public_html/wp-content/mu-plugins/
```

On Hostinger, FTP often lands in account-level `public_html/` — that is **not** the live CMS path. Always use the domain-specific path above.

**CI deploy:** pushes to `main` that touch `wordpress/wp-content/mu-plugins/` auto-deploy via GitHub Actions. Add these repository secrets:

| Secret | Value |
|--------|-------|
| `FTP_HOST` | `82.112.239.215` |
| `FTP_USER` | Hostinger FTP username |
| `FTP_PASS` | Hostinger FTP password |

Manual deploy: `FTP_USER=... FTP_PASS=... python3 scripts/deploy-hostinger-ftp.py --mu-only`

### 4. Install plugins

In wp-admin **Plugins → Add New**, install and activate:

| Plugin | Required |
|--------|----------|
| WPGraphQL | Yes |
| Co-Authors Plus | Recommended |
| Classic Editor | Recommended |
| Advanced Editor Tools (TinyMCE) | Recommended |
| Yoast SEO | Optional |

**Do not install** ACF Pro — this project uses Plan C (native post meta + custom admin screens).

### 5. wp-config.php secrets

Add above `/* That's all, stop editing! */` in `wp-config.php`:

```php
define('SR_FRONTEND_URL', 'https://www.thesportsrivalry.com');
define('SR_PREVIEW_SECRET', '<same as Vercel WORDPRESS_PREVIEW_SECRET>');
define('SR_REVALIDATE_ENDPOINT', 'https://www.thesportsrivalry.com/api/revalidate');
define('SR_REVALIDATE_SECRET', '<same as Vercel REVALIDATE_SECRET>');
```

Generate secrets: `openssl rand -base64 32`

### 6. Seed content

In wp-admin:

1. **SR Layout → Seed MLB Content**
2. **SR Layout → Seed All Sports**

Or via WP-CLI: `wp sr seed-mlb` and `wp sr seed-sports`

### 7. Verify WordPress

```bash
curl -X POST https://cms.thesportsrivalry.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ articles(first:3){ nodes { title slug } } }"}'
```

You should get JSON — not HTML or a JavaScript challenge page.

---

## Phase 2 — Vercel frontend

In **Vercel → Project → Settings → Environment Variables** (Production):

```env
NEXT_PUBLIC_SITE_URL=https://www.thesportsrivalry.com
NEXT_PUBLIC_WORDPRESS_URL=https://cms.thesportsrivalry.com
REVALIDATE_SECRET=<match wp-config SR_REVALIDATE_SECRET>
WORDPRESS_PREVIEW_SECRET=<match wp-config SR_PREVIEW_SECRET>
```

Redeploy after saving env vars.

### Verify end-to-end

```bash
npm run verify:cms
```

Or open:

- `https://www.thesportsrivalry.com/api/health/cms` (after redeploy)
- `https://www.thesportsrivalry.com/mlb`

Publish a test article in WordPress (**Articles → Add New**), assign the **mlb** sport, and confirm it appears on `/mlb` within about a minute.

---

## Phase 3 — Decommission InfinityFree

1. Export anything you need from the old InfinityFree WordPress (optional — re-seed on Hostinger is easier)
2. Remove the InfinityFree `cms` DNS record
3. Delete or park the InfinityFree site

---

## Local development

```bash
cd wordpress
docker compose up -d
docker compose run --rm wpcli
```

```env
NEXT_PUBLIC_WORDPRESS_URL=http://localhost:8080
```

See [wordpress/README.md](../wordpress/README.md) for details.
