export interface SportsWeekBadge {
  label: string;
  href: string;
  background: string;
  color: string;
}

export interface SportsWeekItem {
  slug: string;
  sportLabel: string;
  badges: SportsWeekBadge[];
}

/** EssentiallySports-style sports week lineup — links ready for dedicated hub pages. */
export const SPORTS_WEEK_ITEMS: SportsWeekItem[] = [
  {
    slug: "nascar",
    sportLabel: "NASCAR",
    badges: [
      {
        label: "Lucky Dog on Track",
        href: "/sports-week/nascar",
        background: "#facc15",
        color: "#111111",
      },
    ],
  },
  {
    slug: "golf",
    sportLabel: "Golf",
    badges: [
      {
        label: "Essentially Golf",
        href: "/sports-week/golf",
        background: "#15803d",
        color: "#ffffff",
      },
    ],
  },
  {
    slug: "wnba",
    sportLabel: "WNBA",
    badges: [
      {
        label: "She Got Game",
        href: "/sports-week/wnba",
        background: "#ea580c",
        color: "#ffffff",
      },
    ],
  },
  {
    slug: "nba",
    sportLabel: "NBA",
    badges: [
      {
        label: "Essentially Dunk",
        href: "/sports-week/nba",
        background: "#1e3a8a",
        color: "#ffffff",
      },
    ],
  },
  {
    slug: "college-football",
    sportLabel: "College Football",
    badges: [
      {
        label: "Essentially CFB",
        href: "/sports-week/college-football",
        background: "#78350f",
        color: "#fef3c7",
      },
    ],
  },
  {
    slug: "tennis",
    sportLabel: "Tennis",
    badges: [
      {
        label: "Break Point",
        href: "/sports-week/tennis",
        background: "#1e3a8a",
        color: "#bef264",
      },
    ],
  },
  {
    slug: "nfl",
    sportLabel: "NFL",
    badges: [
      {
        label: "The Huddle",
        href: "/sports-week/nfl/the-huddle",
        background: "#1e3a8a",
        color: "#ffffff",
      },
      {
        label: "Chiefs Huddle",
        href: "/sports-week/nfl/chiefs-huddle",
        background: "#b91c1c",
        color: "#ffffff",
      },
      {
        label: "Cowboys Huddle",
        href: "/sports-week/nfl/cowboys-huddle",
        background: "#1e40af",
        color: "#cbd5e1",
      },
      {
        label: "Steelers Huddle",
        href: "/sports-week/nfl/steelers-huddle",
        background: "#111111",
        color: "#facc15",
      },
    ],
  },
];
