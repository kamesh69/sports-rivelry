import type { MediaAsset } from "@/lib/types";

/** Standard editorial image sizes (16:9 landscape). Use when uploading to WordPress or mock assets. */
export const MEDIA_STANDARDS = {
  articleFeatured: { width: 1600, height: 900, ratio: "16:9" as const },
  articleCard: { width: 640, height: 360, ratio: "16:9" as const },
  articleHero: { width: 1280, height: 720, ratio: "16:9" as const },
  authorAvatar: { width: 400, height: 400, ratio: "1:1" as const },
} as const;

export function normalizeFeaturedImage(
  image: MediaAsset,
  target: keyof typeof MEDIA_STANDARDS = "articleCard",
): MediaAsset {
  const { width, height } = MEDIA_STANDARDS[target];

  return {
    ...image,
    width,
    height,
  };
}
