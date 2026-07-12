#!/usr/bin/env bash
set -euo pipefail

REVALIDATE_SECRET="${REVALIDATE_SECRET:-$(openssl rand -base64 32)}"
WORDPRESS_PREVIEW_SECRET="${WORDPRESS_PREVIEW_SECRET:-$(openssl rand -base64 32)}"

cat <<EOF
Add these to Vercel → Project → Settings → Environment Variables (Production):

NEXT_PUBLIC_SITE_URL=https://www.thesportsrivalry.com
NEXT_PUBLIC_WORDPRESS_URL=https://cms.thesportsrivalry.com
REVALIDATE_SECRET=${REVALIDATE_SECRET}
WORDPRESS_PREVIEW_SECRET=${WORDPRESS_PREVIEW_SECRET}

Add the same SR_* values to WordPress wp-config.php:

define('SR_FRONTEND_URL', 'https://www.thesportsrivalry.com');
define('SR_PREVIEW_SECRET', '${WORDPRESS_PREVIEW_SECRET}');
define('SR_REVALIDATE_ENDPOINT', 'https://www.thesportsrivalry.com/api/revalidate');
define('SR_REVALIDATE_SECRET', '${REVALIDATE_SECRET}');

After saving in Vercel, redeploy production from the Deployments tab.
EOF
