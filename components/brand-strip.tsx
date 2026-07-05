import Link from "next/link";
import { BrandLogoImage } from "@/components/brand-logo-image";
import { SITE_NAME } from "@/lib/site-config";

export function BrandStrip() {
  return (
    <div className="brand-strip">
      <Link href="/" className="brand-strip__lockup" aria-label={`${SITE_NAME} home`}>
        <BrandLogoImage variant="strip" />
        <span className="brand-strip__name">{SITE_NAME}</span>
      </Link>
    </div>
  );
}
