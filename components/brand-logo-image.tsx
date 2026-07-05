import Image from "next/image";
import {
  SITE_LOGO_CIRCLE_PATH,
  SITE_LOGO_CIRCLE_SIZE,
  SITE_LOGO_HEIGHT,
  SITE_LOGO_PATH,
  SITE_LOGO_WIDTH,
  SITE_NAME,
} from "@/lib/site-config";

type BrandLogoVariant = "header" | "strip" | "banner" | "card";

const VARIANT_HEIGHT: Record<BrandLogoVariant, number> = {
  header: 46,
  strip: 48,
  banner: 56,
  card: 28,
};

interface BrandLogoImageProps {
  variant?: BrandLogoVariant;
  className?: string;
  priority?: boolean;
}

/** Site logo mark used anywhere the TSR brand appears in the UI. */
export function BrandLogoImage({ variant = "header", className, priority = false }: BrandLogoImageProps) {
  if (variant === "header") {
    return (
      <Image
        src={SITE_LOGO_CIRCLE_PATH}
        alt={`${SITE_NAME} logo`}
        width={SITE_LOGO_CIRCLE_SIZE}
        height={SITE_LOGO_CIRCLE_SIZE}
        className={className ?? "brand-logo-img brand-logo-img--header"}
        priority={priority}
        sizes="46px"
      />
    );
  }

  const height = VARIANT_HEIGHT[variant];
  const width = Math.round((SITE_LOGO_WIDTH / SITE_LOGO_HEIGHT) * height);

  return (
    <Image
      src={SITE_LOGO_PATH}
      alt={`${SITE_NAME} logo`}
      width={width}
      height={height}
      className={className ?? `brand-logo-img brand-logo-img--${variant}`}
      priority={priority}
    />
  );
}
