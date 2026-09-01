import type { FooterLinkGroup, NavItem } from "@/lib/types";

export const SITE_NAME = "The Sports Rivalry";
export const SITE_TAGLINE = "Rivalry-first coverage for the games fans carry all week.";
export const SITE_DESCRIPTION =
  "The Sports Rivalry is a rivalry-driven sports newsroom built around marquee matchups, fast-moving headlines, and fan-heavy editorial presentation.";
export const SITE_LOGO_PATH = "/images/brand/tsr-logo.png";
export const SITE_LOGO_CIRCLE_PATH = "/images/brand/tsr-logo-circle.png";
export const SITE_LOGO_WIDTH = 819;
export const SITE_LOGO_HEIGHT = 1024;
export const SITE_LOGO_CIRCLE_SIZE = 818;
export const SITE_DOMAIN =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://thesportsrivalry.com";

export const VISIBLE_SPORT_SLUGS = ["mlb"] as const;

export function isVisibleSport(slug: string) {
  return (VISIBLE_SPORT_SLUGS as readonly string[]).includes(slug);
}

export const SPORTS_NAV: NavItem[] = [
  { slug: "mlb", label: "MLB", href: "/mlb" },
];

export const HOMEPAGE_SPORTS = ["mlb"] as const;

/** One lead story plus four list items in each homepage sport rail. */
export const SPORT_RAIL_ARTICLE_COUNT = 5;

export const HOMEPAGE_CATEGORY_STRIP: NavItem[] = [
  { slug: "mlb", label: "MLB", href: "/mlb" },
];

export const SOCIAL_LINKS = [
  {
    platform: "x",
    label: "Follow The Sports Rivalry on X",
    url: "https://x.com/sportsrivalry",
  },
  {
    platform: "instagram",
    label: "Follow The Sports Rivalry on Instagram",
    url: "https://instagram.com/sportsrivalry",
  },
  {
    platform: "youtube",
    label: "Follow The Sports Rivalry on YouTube",
    url: "https://youtube.com/@sportsrivalry",
  },
  {
    platform: "facebook",
    label: "Follow The Sports Rivalry on Facebook",
    url: "https://facebook.com/sportsrivalry",
  },
  {
    platform: "linkedin",
    label: "Follow The Sports Rivalry on LinkedIn",
    url: "https://linkedin.com/company/sportsrivalry",
  },
];

export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/advertise", label: "Advertise" },
      { href: "/authors", label: "Authors" },
      { href: "/editorial-team", label: "Editorial Team" },
      { href: "/editorial-guidelines", label: "Editorial Policies" },
      { href: "/contact", label: "Contact Us" },
      { href: "/faqs", label: "FAQs" },
    ],
  },
  {
    title: "Policies",
    links: [
      { href: "/take-down-policy", label: "Take Down Policy" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-of-use", label: "Terms of Use" },
      { href: "/fact-checking-policy", label: "Fact Checking Policy" },
      { href: "/corrections", label: "Correction Policy" },
    ],
  },
];

export const DEFAULT_REVALIDATE_SECONDS = 60;
