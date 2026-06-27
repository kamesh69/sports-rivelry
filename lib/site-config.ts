import type { FooterLinkGroup, NavItem } from "@/lib/types";

export const SITE_NAME = "Sports Rivalry";
export const SITE_TAGLINE = "Rivalry-first coverage for the games fans carry all week.";
export const SITE_DESCRIPTION =
  "Sports Rivalry is a rivalry-driven sports newsroom built around marquee matchups, fast-moving headlines, and fan-heavy editorial presentation.";
export const SITE_DOMAIN =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://thesportsrivalry.com";

export const SPORTS_NAV: NavItem[] = [
  { slug: "mlb", label: "MLB", href: "/mlb" },
  { slug: "basketball", label: "Basketball", href: "/basketball" },
  { slug: "golf", label: "Golf", href: "/golf" },
  { slug: "nascar", label: "NASCAR", href: "/nascar" },
  { slug: "football", label: "Football", href: "/football" },
];

export const HOMEPAGE_SPORTS = ["mlb", "golf", "basketball", "nascar", "football"] as const;

/** One lead story plus four list items in each homepage sport rail. */
export const SPORT_RAIL_ARTICLE_COUNT = 5;

export const HOMEPAGE_CATEGORY_STRIP: NavItem[] = [
  { slug: "mlb", label: "MLB", href: "/mlb" },
  { slug: "golf", label: "Golf", href: "/golf" },
  { slug: "college-sports", label: "College Sports", disabled: true },
  { slug: "nba", label: "NBA", href: "/basketball" },
  { slug: "nascar", label: "NASCAR", href: "/nascar" },
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
