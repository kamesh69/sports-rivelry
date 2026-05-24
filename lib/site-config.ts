export const SITE_NAME = "Sports Rivalry";
export const SITE_TAGLINE = "India-first sports news, analysis, and rivalries that travel.";
export const SITE_DESCRIPTION =
  "Sports Rivalry is a headless sports newsroom built for fast-moving coverage, rivalry-driven storytelling, and search-ready editorial publishing.";
export const SITE_DOMAIN =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://thesportsrivalry.com";

export const SPORTS_NAV = [
  { slug: "cricket", label: "Cricket" },
  { slug: "football", label: "Football" },
  { slug: "badminton", label: "Badminton" },
  { slug: "kabaddi", label: "Kabaddi" },
  { slug: "wrestling", label: "Wrestling" },
  { slug: "olympics", label: "Olympics" },
];

export const SOCIAL_LINKS = [
  {
    platform: "x",
    label: "Follow Sports Rivalry on X",
    url: "https://x.com/sportsrivalry",
  },
  {
    platform: "instagram",
    label: "Follow Sports Rivalry on Instagram",
    url: "https://instagram.com/sportsrivalry",
  },
  {
    platform: "youtube",
    label: "Follow Sports Rivalry on YouTube",
    url: "https://youtube.com/@sportsrivalry",
  },
  {
    platform: "facebook",
    label: "Follow Sports Rivalry on Facebook",
    url: "https://facebook.com/sportsrivalry",
  },
  {
    platform: "linkedin",
    label: "Follow Sports Rivalry on LinkedIn",
    url: "https://linkedin.com/company/sportsrivalry",
  },
];

export const TRUST_LINKS = [
  { href: "/about", label: "About" },
  { href: "/editorial-guidelines", label: "Editorial Guidelines" },
  { href: "/corrections", label: "Corrections" },
  { href: "/contact", label: "Contact" },
  { href: "/authors", label: "Authors" },
];

export const DEFAULT_REVALIDATE_SECONDS = 60;
