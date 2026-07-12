#!/bin/sh
set -eu

cd /var/www/html

if [ ! -f wp-config.php ]; then
  echo "Waiting for WordPress files..."
  sleep 5
fi

if ! wp core is-installed --allow-root 2>/dev/null; then
  wp core install \
    --url="${WP_URL:-http://localhost:8080}" \
    --title="The Sports Rivalry CMS" \
    --admin_user=admin \
    --admin_password="${WP_ADMIN_PASSWORD:-changeme}" \
    --admin_email="${WP_ADMIN_EMAIL:-admin@thesportsrivalry.com}" \
    --skip-email \
    --allow-root
fi

wp plugin install --activate $(tr '\n' ' ' < /plugins.txt) --allow-root || true

if ! wp plugin is-active wordpress-seo --allow-root 2>/dev/null; then
  wp plugin install wordpress-seo --activate --allow-root \
    || wp plugin install wordpress-seo --version=24.9 --activate --allow-root \
    || true
fi

wp option update classic-editor-replace 'classic' --allow-root 2>/dev/null || true
wp option update classic-editor-allow-users 'disallow' --allow-root 2>/dev/null || true

echo "Plan C: skipping ACF Pro and WPGraphQL for ACF"

wp rewrite flush --hard --allow-root

if wp eval 'echo function_exists("sr_seed_mlb_content") ? "yes" : "no";' --allow-root | grep -q yes; then
  wp sr seed-mlb --allow-root || true
  wp sr seed-sports --allow-root || true
fi

echo "WordPress bootstrap complete."
