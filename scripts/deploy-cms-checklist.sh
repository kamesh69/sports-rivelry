#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== The Sports Rivalry CMS deployment checklist ==="
echo ""
echo "Full guide: docs/hostinger-deployment.md"
echo ""
echo "1. Host WordPress at https://cms.thesportsrivalry.com"
echo "2. Upload mu-plugins from wordpress/wp-content/mu-plugins/"
echo "3. Install plugins: WPGraphQL, Co-Authors Plus, Classic Editor, TinyMCE Advanced, Yoast SEO"
echo "4. Run: bash scripts/vercel-env-setup.sh"
echo "5. Add secrets to wp-config.php and Vercel"
echo "6. Seed: wp sr seed-mlb && wp sr seed-sports"
echo ""

if command -v docker >/dev/null 2>&1; then
  echo "Local Docker verify:"
  (cd "$ROOT/wordpress" && docker compose ps 2>/dev/null) || echo "  Docker not running"
fi

if [ -n "${NEXT_PUBLIC_WORDPRESS_URL:-}" ]; then
  echo "Probing ${NEXT_PUBLIC_WORDPRESS_URL}/graphql ..."
  npm run verify:cms 2>/dev/null || node "$ROOT/scripts/verify-cms.mjs" || true
else
  echo "Set NEXT_PUBLIC_WORDPRESS_URL to probe CMS (e.g. http://localhost:8080)"
fi

echo ""
echo "Production health: https://www.thesportsrivalry.com/api/health/cms"
