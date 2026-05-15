export const SITE_NAME = "Sports Rivelry";
export const SITE_TAGLINE = "India-first sports news, analysis, and rivalries that travel.";
export const SITE_DESCRIPTION =
  "Sports Rivelry is a headless sports newsroom built for fast-moving coverage, rivalry-driven storytelling, and search-ready editorial publishing.";
export const SITE_DOMAIN =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://sportsrivelry.com";

export const SPORTS_NAV = [
  { slug: "cricket", label: "Cricket" },
  { slug: "football", label: "Football" },
  { slug: "badminton", label: "Badminton" },
  { slug: "kabaddi", label: "Kabaddi" },
  { slug: "wrestling", label: "Wrestling" },
  { slug: "olympics", label: "Olympics" },
];

export const TRUST_LINKS = [
  { href: "/about", label: "About" },
  { href: "/editorial-guidelines", label: "Editorial Guidelines" },
  { href: "/corrections", label: "Corrections" },
  { href: "/contact", label: "Contact" },
  { href: "/authors", label: "Authors" },
];

export const DEFAULT_REVALIDATE_SECONDS = 60;
