import Link from "next/link";
import { BrandLogoImage } from "@/components/brand-logo-image";
import { SITE_NAME } from "@/lib/site-config";

export function Logo() {
  return (
    <Link href="/" className="brand-lockup" aria-label={`${SITE_NAME} home`}>
      <BrandLogoImage variant="header" priority />
      <span className="brand-copy">
        <strong>{SITE_NAME}</strong>
      </span>
    </Link>
  );
}
