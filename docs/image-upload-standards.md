# Image upload standards

All story images should be **landscape 16:9** before upload so cards and the hero carousel crop consistently.

## Recommended sizes

| Use | Dimensions | Ratio |
|-----|------------|--------|
| Article featured (CMS) | **1600 × 900** | 16:9 |
| Card / Latest News grid | 640 × 360 (derived from featured) | 16:9 |
| Hero carousel | 1280 × 720 minimum | 16:9 |
| Author avatar | 400 × 400 | 1:1 |

## WordPress

1. Crop or export featured images at **1600×900** (JPEG or WebP, &lt; 400 KB when possible).
2. Use the same focal point across crops — faces/action centered.
3. The frontend uses `object-fit: cover` in a fixed 16:9 frame; portrait uploads will be heavily cropped.

## Mock / static assets

Place artwork under `public/images/articles/` at **1600×900** (SVG or raster). The app normalizes display dimensions in `lib/media.ts`.
