import type {
  Article,
  AuthorProfile,
  HomePageData,
  LandingPage,
  LeagueHub,
  LeagueSummary,
  NewsletterIssue,
  QuickHitsBlock,
  QuickHitsConfig,
  SearchResult,
  SportHub,
  SportSummary,
  TopicHub,
} from "@/lib/types";
import {
  HOMEPAGE_CATEGORY_STRIP,
  HOMEPAGE_SPORTS,
  SITE_NAME,
  SPORT_RAIL_ARTICLE_COUNT,
} from "@/lib/site-config";
import { dedupeByKey, sortByPublishedAt } from "@/lib/utils";

const now = new Date();

function hoursAgo(hours: number) {
  return new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();
}

function daysAgo(days: number) {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
}

export const sports: SportSummary[] = [
  {
    slug: "mlb",
    name: "MLB",
    description: "Franchise heat, clubhouse drama, and division races that turn into grudges.",
    accent: "#b42318",
    featuredTeams: [
      {
        name: "New York Yankees",
        shortName: "NYY",
        primaryColor: "#132448",
        accentColor: "#e5e7eb",
      },
      {
        name: "Los Angeles Dodgers",
        shortName: "LAD",
        primaryColor: "#005a9c",
        accentColor: "#ffffff",
      },
      {
        name: "New York Mets",
        shortName: "NYM",
        primaryColor: "#002d72",
        accentColor: "#f97316",
      },
      {
        name: "Chicago Cubs",
        shortName: "CHC",
        primaryColor: "#0e3386",
        accentColor: "#cc3433",
      },
    ],
  },
  {
    slug: "basketball",
    name: "Basketball",
    description: "NBA and WNBA pressure points, star rivalries, and postseason obsession.",
    accent: "#ea580c",
    featuredTeams: [
      {
        name: "Boston Celtics",
        shortName: "BOS",
        primaryColor: "#007a33",
        accentColor: "#ffffff",
      },
      {
        name: "New York Knicks",
        shortName: "NYK",
        primaryColor: "#0f4c81",
        accentColor: "#f97316",
      },
      {
        name: "Las Vegas Aces",
        shortName: "LVA",
        primaryColor: "#111111",
        accentColor: "#d4af37",
      },
      {
        name: "Indiana Fever",
        shortName: "IND",
        primaryColor: "#0e4b8f",
        accentColor: "#fcb040",
      },
    ],
  },
  {
    slug: "golf",
    name: "Golf",
    description: "Majors, money lists, and the rivalries that follow every Sunday back nine.",
    accent: "#166534",
    featuredTeams: [
      {
        name: "PGA Tour",
        shortName: "PGA",
        primaryColor: "#0a4a8a",
        accentColor: "#ffffff",
      },
      {
        name: "LIV Golf",
        shortName: "LIV",
        primaryColor: "#335c1e",
        accentColor: "#d9f99d",
      },
      {
        name: "U.S. Open",
        shortName: "USO",
        primaryColor: "#14532d",
        accentColor: "#ffffff",
      },
      {
        name: "LPGA",
        shortName: "LPGA",
        primaryColor: "#7c2d12",
        accentColor: "#ffedd5",
      },
    ],
  },
  {
    slug: "nascar",
    name: "NASCAR",
    description: "Cup Series feuds, pit-road gambles, and speedway politics under pressure.",
    accent: "#111827",
    featuredTeams: [
      {
        name: "Hendrick Motorsports",
        shortName: "HMS",
        primaryColor: "#111827",
        accentColor: "#60a5fa",
      },
      {
        name: "Joe Gibbs Racing",
        shortName: "JGR",
        primaryColor: "#991b1b",
        accentColor: "#ffffff",
      },
      {
        name: "Team Penske",
        shortName: "PEN",
        primaryColor: "#1d4ed8",
        accentColor: "#ffffff",
      },
      {
        name: "23XI Racing",
        shortName: "23XI",
        primaryColor: "#111111",
        accentColor: "#facc15",
      },
    ],
  },
  {
    slug: "football",
    name: "Football",
    description: "Transfers, title races, Indian football growth, and global matchweek drama.",
    accent: "#065f46",
  },
  {
    slug: "badminton",
    name: "Badminton",
    description: "Tour coverage with an India-first lens on elite singles and doubles stories.",
    accent: "#8b5cf6",
  },
  {
    slug: "kabaddi",
    name: "Kabaddi",
    description: "PKL narratives, tactical evolutions, and franchise rivalries.",
    accent: "#ea580c",
  },
  {
    slug: "wrestling",
    name: "Wrestling",
    description: "From Indian wrestling pathways to the spectacle and politics around the mat.",
    accent: "#1d4ed8",
  },
  {
    slug: "olympics",
    name: "Olympics",
    description: "Road-to-LA coverage built around medal contenders and qualification pressure.",
    accent: "#b45309",
  },
];

export const leagues: LeagueSummary[] = [
  {
    slug: "isl",
    name: "ISL",
    sportSlug: "football",
    seasonLabel: "2025-26 Season",
    description: "Indian football’s marquee league with club-building and matchweek reactions.",
  },
  {
    slug: "premier-league",
    name: "Premier League",
    sportSlug: "football",
    seasonLabel: "2025-26 Season",
    description: "Big-six pressure, title momentum, and transfer edges.",
  },
  {
    slug: "pkl",
    name: "PKL",
    sportSlug: "kabaddi",
    seasonLabel: "Season 13",
    description: "Franchise raids, defensive systems, and title-defining runs.",
  },
  {
    slug: "mlb",
    name: "MLB",
    sportSlug: "mlb",
    seasonLabel: "2026 Season",
    description: "Pennant-chase chaos, clubhouse turns, and rivalry heat around the division table.",
  },
  {
    slug: "nba",
    name: "NBA",
    sportSlug: "basketball",
    seasonLabel: "2025-26 Season",
    description: "Superstar leverage, playoff grudges, and the nightly race for seeding.",
  },
  {
    slug: "wnba",
    name: "WNBA",
    sportSlug: "basketball",
    seasonLabel: "2026 Season",
    description: "Title pressure, generational stars, and every sharp edge around the contender class.",
  },
  {
    slug: "pga-tour",
    name: "PGA Tour",
    sportSlug: "golf",
    seasonLabel: "2026 Season",
    description: "Major week pressure, FedExCup momentum, and the leverage of elite Sundays.",
  },
  {
    slug: "cup-series",
    name: "Cup Series",
    sportSlug: "nascar",
    seasonLabel: "2026 Season",
    description: "Pit strategy, aero chess, and the rivalries that spill from radio to track.",
  },
];

export const authors: AuthorProfile[] = [
  {
    id: "author-2",
    slug: "sana-qureshi",
    name: "Sana Qureshi",
    role: "Football Features Editor",
    beat: "Football",
    bio: "Sana covers the tactical and emotional center of football, from ISL projects to Europe’s elite storylines.",
    expertise:
      "Focuses on coaching shifts, transfer windows, and identity-building clubs that shape modern football fandom.",
    avatar: {
      src: "/images/authors/sana.svg",
      alt: "Portrait illustration of Sana Qureshi",
      width: 720,
      height: 720,
    },
    socials: [{ platform: "X", label: "@sanaq", url: "https://x.com/sanaq" }],
    seo: {
      title: `Sana Qureshi | ${SITE_NAME}`,
      description: "Football Features Editor at The Sports Rivalry.",
      canonicalPath: "/authors/sana-qureshi",
    },
  },
  {
    id: "author-3",
    slug: "riya-narayan",
    name: "Riya Narayan",
    role: "Olympics & Badminton Correspondent",
    beat: "Olympics",
    bio: "Riya follows Indian medal hopefuls, qualification routes, and the pressure cycles of global competition.",
    expertise:
      "Bridges tournament reporting with athlete development, performance trends, and the stakes around Olympic qualification.",
    avatar: {
      src: "/images/authors/riya.svg",
      alt: "Portrait illustration of Riya Narayan",
      width: 720,
      height: 720,
    },
    socials: [{ platform: "X", label: "@riyanarayan", url: "https://x.com/riyanarayan" }],
    seo: {
      title: `Riya Narayan | ${SITE_NAME}`,
      description: "Olympics & Badminton Correspondent at The Sports Rivalry.",
      canonicalPath: "/authors/riya-narayan",
    },
  },
  {
    id: "author-4",
    slug: "veer-chaudhary",
    name: "Veer Chaudhary",
    role: "Combat & Kabaddi Reporter",
    beat: "Kabaddi",
    bio: "Veer reports where spectacle, tactics, and identity collide across kabaddi and wrestling.",
    expertise:
      "Known for breaking down raids, mat psychology, and the momentum swings that change a rivalry.",
    avatar: {
      src: "/images/authors/veer.svg",
      alt: "Portrait illustration of Veer Chaudhary",
      width: 720,
      height: 720,
    },
    socials: [{ platform: "X", label: "@veerreports", url: "https://x.com/veerreports" }],
    seo: {
      title: `Veer Chaudhary | ${SITE_NAME}`,
      description: "Combat & Kabaddi Reporter at The Sports Rivalry.",
      canonicalPath: "/authors/veer-chaudhary",
    },
  },
  {
    id: "author-5",
    slug: "miles-donovan",
    name: "Miles Donovan",
    role: "MLB Senior Writer",
    beat: "MLB",
    bio: "Miles follows pennant-race momentum, roster friction, and the clubs that treat every series like a referendum.",
    expertise:
      "Known for translating bullpen usage, lineup tension, and inter-division hate into clean rivalry narratives.",
    avatar: {
      src: "/images/authors/riya.svg",
      alt: "Portrait illustration of Miles Donovan",
      width: 720,
      height: 720,
    },
    socials: [{ platform: "X", label: "@milesdonovan", url: "https://x.com/milesdonovan" }],
    seo: {
      title: `Miles Donovan | ${SITE_NAME}`,
      description: "MLB Senior Writer at The Sports Rivalry.",
      canonicalPath: "/authors/miles-donovan",
    },
  },
  {
    id: "author-6",
    slug: "tessa-cole",
    name: "Tessa Cole",
    role: "Basketball Features Editor",
    beat: "Basketball",
    bio: "Tessa covers the leverage moments that bind NBA and WNBA fandom: stars, grudges, and playoff pace.",
    expertise:
      "Specialises in rivalry framing, star hierarchy, and the emotional math of title windows across both leagues.",
    avatar: {
      src: "/images/authors/sana.svg",
      alt: "Portrait illustration of Tessa Cole",
      width: 720,
      height: 720,
    },
    socials: [{ platform: "X", label: "@tessacole", url: "https://x.com/tessacole" }],
    seo: {
      title: `Tessa Cole | ${SITE_NAME}`,
      description: "Basketball Features Editor at The Sports Rivalry.",
      canonicalPath: "/authors/tessa-cole",
    },
  },
  {
    id: "author-7",
    slug: "reese-mercer",
    name: "Reese Mercer",
    role: "Golf Correspondent",
    beat: "Golf",
    bio: "Reese tracks how majors are shaped by money, ego, and the last three holes on Sunday.",
    expertise:
      "Focuses on tournament psychology, tour politics, and the personalities that turn leaderboards into rivalries.",
    avatar: {
      src: "/images/authors/riya.svg",
      alt: "Portrait illustration of Reese Mercer",
      width: 720,
      height: 720,
    },
    socials: [{ platform: "X", label: "@reesemercer", url: "https://x.com/reesemercer" }],
    seo: {
      title: `Reese Mercer | ${SITE_NAME}`,
      description: "Golf Correspondent at The Sports Rivalry.",
      canonicalPath: "/authors/reese-mercer",
    },
  },
  {
    id: "author-8",
    slug: "chase-holloway",
    name: "Chase Holloway",
    role: "Motorsports Reporter",
    beat: "NASCAR",
    bio: "Chase writes where pit calls, radio shots, and garage politics turn races into feuds.",
    expertise:
      "Covers Cup Series strategy, team identities, and the recurring grudges that keep NASCAR feeling personal.",
    avatar: {
      src: "/images/authors/veer.svg",
      alt: "Portrait illustration of Chase Holloway",
      width: 720,
      height: 720,
    },
    socials: [{ platform: "X", label: "@chaseholloway", url: "https://x.com/chaseholloway" }],
    seo: {
      title: `Chase Holloway | ${SITE_NAME}`,
      description: "Motorsports Reporter at The Sports Rivalry.",
      canonicalPath: "/authors/chase-holloway",
    },
  },
];

function sportBySlug(slug: string) {
  const sport = sports.find((entry) => entry.slug === slug);

  if (!sport) {
    throw new Error(`Unknown sport: ${slug}`);
  }

  return sport;
}

function leagueBySlug(slug: string) {
  return leagues.find((entry) => entry.slug === slug);
}

function authorBySlug(slug: string) {
  const author = authors.find((entry) => entry.slug === slug);

  if (!author) {
    throw new Error(`Unknown author: ${slug}`);
  }

  return author;
}

function articleSeo(sportSlug: string, slug: string, title: string, description: string) {
  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    canonicalPath: `/${sportSlug}/${slug}`,
  };
}

const rawArticles = [
  {
    id: "article-100",
    slug: "yankees-red-sox-rivalry-feels-mean-again-because-both-dugouts-need-it",
    sportSlug: "mlb",
    leagueSlug: "mlb",
    authorSlugs: ["miles-donovan"],
    publishedAt: hoursAgo(0.5),
    updatedAt: hoursAgo(0.25),
    readTime: 5,
    title: "Yankees-Red Sox feels mean again because both dugouts need it",
    excerpt: "The talent matters, but the tone of the series is what turned this back into required viewing.",
    deck: "Boston and New York have stopped treating the rivalry like nostalgia and started using it like leverage.",
    bodyHtml:
      "<p>The Yankees and Red Sox are interesting again for the right reason: both sides finally have something to prove at the same time. One dugout is trying to protect its authority, the other is trying to steal it.</p><p>That changes how every bullpen call lands and how every star at-bat feels. Rivalry baseball gets louder when both clubs believe the next three days can reshape the month.</p><h2>Why it travels</h2><p>The best version of this feud is not about history alone. It is about pressure living in every inning, from the starter's tempo to the way a manager deploys his final leverage arm.</p>",
    featuredImage: {
      src: "/images/articles/mlb-clubhouse.svg",
      alt: "Abstract baseball diamond with rivalry scoreboards and dugout lighting",
      width: 1600,
      height: 900,
      credit: "Illustration by The Sports Rivalry Studio",
    },
    topicSlugs: ["rivalries"],
    tags: ["MLB", "Yankees", "Red Sox"],
    relatedStorySlugs: [
      "dodgers-padres-have-found-the-perfect-october-hate-cycle",
      "mets-braves-keep-punishing-any-team-that-blinks-first",
    ],
    trendingScore: 99,
    isBreaking: true,
    isEditorsPick: true,
  },
  {
    id: "article-101",
    slug: "caitlin-clark-vs-liberty-pressure-is-turning-fever-games-into-national-events",
    sportSlug: "basketball",
    leagueSlug: "wnba",
    authorSlugs: ["tessa-cole"],
    publishedAt: hoursAgo(1),
    updatedAt: hoursAgo(0.6),
    readTime: 4,
    title: "Fever vs Liberty pressure is turning every Caitlin Clark game into an event",
    excerpt: "Indiana-New York is starting to feel less like a schedule quirk and more like a referendum on the league’s hierarchy.",
    deck: "The Liberty still own the title pressure, but the Fever now bring the loudest audience and the fastest emotional swings.",
    bodyHtml:
      "<p>The Liberty are trying to defend status. The Fever are trying to seize it. That is why this matchup keeps escalating past ordinary regular-season noise.</p><p>Every possession feels like it is doing two jobs at once: deciding a game and measuring whether the league's old order still holds.</p><h2>What makes it sticky</h2><p>Star power alone does not create a rivalry. Shared stakes do, and the Fever now arrive with enough talent and spotlight to make every Liberty meeting feel political.</p>",
    featuredImage: {
      src: "/images/articles/basketball-rivals.svg",
      alt: "Stylized basketball court with orange and navy rivalry graphics",
      width: 1600,
      height: 900,
      credit: "Illustration by The Sports Rivalry Studio",
    },
    topicSlugs: ["rivalries"],
    tags: ["WNBA", "Indiana Fever", "New York Liberty"],
    relatedStorySlugs: [
      "celtics-knicks-is-becoming-the-east-rivalry-that-actually-travels",
      "aces-liberty-still-own-the-wnba-ego-war-even-when-the-scoreboard-flips",
    ],
    trendingScore: 97,
    isBreaking: true,
    isEditorsPick: true,
  },
  {
    id: "article-102",
    slug: "scheffler-vs-mcilroy-is-now-a-rivalry-about-control-not-just-trophies",
    sportSlug: "golf",
    leagueSlug: "pga-tour",
    authorSlugs: ["reese-mercer"],
    publishedAt: hoursAgo(1.5),
    updatedAt: hoursAgo(1.1),
    readTime: 5,
    title: "Scheffler vs McIlroy is now a rivalry about control, not just trophies",
    excerpt: "The leaderboard battle is only half the story. The real tension is whose version of elite golf keeps proving sustainable.",
    deck: "Scheffler’s calm and McIlroy’s volatility have turned every major Sunday into a referendum on what winning golf should look like.",
    bodyHtml:
      "<p>Scottie Scheffler and Rory McIlroy are no longer simply the two most familiar names near the top of the board. They represent competing ways to dominate a season.</p><p>One side wins through repeatable control, the other through ceiling and aura. When they share a weekend, the rivalry writes itself.</p><h2>Beyond the shot chart</h2><p>The reason it sticks is that fans are really choosing between identities: machine-like reliability or the thrill of a run that can still overwhelm everyone in sight.</p>",
    featuredImage: {
      src: "/images/articles/golf-major.svg",
      alt: "Graphic golf fairway with trophy outlines and scoreboard accents",
      width: 1600,
      height: 900,
      credit: "Illustration by The Sports Rivalry Studio",
    },
    topicSlugs: ["rivalries"],
    tags: ["Golf", "Scottie Scheffler", "Rory McIlroy"],
    relatedStorySlugs: [
      "us-open-week-has-become-a-betting-war-between-discipline-and-chaos",
      "liv-vs-pga-tour-is-still-the-background-noise-behind-every-major",
    ],
    trendingScore: 96,
    isEditorsPick: true,
  },
  {
    id: "article-103",
    slug: "elliott-vs-larson-keeps-feeling-like-nascars-cleanest-modern-feud",
    sportSlug: "nascar",
    leagueSlug: "cup-series",
    authorSlugs: ["chase-holloway"],
    publishedAt: hoursAgo(2),
    updatedAt: hoursAgo(1.4),
    readTime: 4,
    title: "Elliott vs Larson still feels like NASCAR’s cleanest modern feud",
    excerpt: "It is not built on screaming alone. It works because both drivers keep colliding in the exact races that define the season.",
    deck: "When Chase Elliott and Kyle Larson arrive with speed on the same weekend, the garage starts reading every pit call like a provocation.",
    bodyHtml:
      "<p>Some rivalries are loud because the personalities demand it. Elliott-Larson is different. It feels real because both camps keep showing up in the same decisive moments.</p><p>That overlap makes every restart, qualifying lap, and crew-chief gamble feel a little more loaded than usual.</p><h2>Where it sharpens</h2><p>The best NASCAR feuds survive because they can live on three levels at once: driver ego, team identity, and the scoreboard. This one checks all three boxes.</p>",
    featuredImage: {
      src: "/images/articles/nascar-speed.svg",
      alt: "High-speed stock car illustration with track markings and dark gradients",
      width: 1600,
      height: 900,
      credit: "Illustration by The Sports Rivalry Studio",
    },
    topicSlugs: ["rivalries"],
    tags: ["NASCAR", "Chase Elliott", "Kyle Larson"],
    relatedStorySlugs: [
      "hamlin-vs-everybody-has-become-nascars-most-bankable-energy-source",
      "team-penske-and-hendrick-keep-making-pit-road-feel-like-the-real-race",
    ],
    trendingScore: 95,
    isBreaking: true,
    isEditorsPick: true,
  },
  {
    id: "article-104",
    slug: "dodgers-padres-have-found-the-perfect-october-hate-cycle",
    sportSlug: "mlb",
    leagueSlug: "mlb",
    authorSlugs: ["miles-donovan"],
    publishedAt: hoursAgo(2.5),
    updatedAt: hoursAgo(2),
    readTime: 4,
    title: "Dodgers-Padres have found the perfect October hate cycle",
    excerpt: "Talent is everywhere in this matchup, but the real appeal is how quickly confidence turns into insult.",
    deck: "Los Angeles and San Diego now play like two clubs that no longer need a postseason prompt to remember the score.",
    bodyHtml:
      "<p>The Dodgers still carry the larger machinery, but the Padres have learned how to make the matchup personal enough to flatten the gap. That is why the tone changes the moment the series begins.</p><p>Every confrontation now carries playoff memory, even in June.</p>",
    featuredImage: {
      src: "/images/articles/mlb-clubhouse.svg",
      alt: "Abstract baseball diamond with rivalry scoreboards and dugout lighting",
      width: 1600,
      height: 900,
      credit: "Illustration by The Sports Rivalry Studio",
    },
    topicSlugs: ["rivalries"],
    tags: ["MLB", "Dodgers", "Padres"],
    relatedStorySlugs: [
      "yankees-red-sox-rivalry-feels-mean-again-because-both-dugouts-need-it",
      "mets-braves-keep-punishing-any-team-that-blinks-first",
    ],
    trendingScore: 93,
    isEditorsPick: true,
  },
  {
    id: "article-105",
    slug: "celtics-knicks-is-becoming-the-east-rivalry-that-actually-travels",
    sportSlug: "basketball",
    leagueSlug: "nba",
    authorSlugs: ["tessa-cole"],
    publishedAt: hoursAgo(3),
    updatedAt: hoursAgo(2.6),
    readTime: 5,
    title: "Celtics-Knicks is becoming the East rivalry that actually travels",
    excerpt: "Boston owns the ring standard, but New York has built enough swagger to make the matchup feel national.",
    deck: "Every time these teams meet, the conversation shifts from standings to identity and who gets to frame the East.",
    bodyHtml:
      "<p>The Celtics still define the conference ceiling, but the Knicks have become too visible and too emotionally loud to be treated like a supporting act. That tension makes the matchup bigger than the standings.</p><p>It feels like both fan bases think they are arguing over the same throne.</p><h2>1. Develop a Go-To Scoring Move</h2><p>Every contender needs a sequence opponents cannot take away. Boston has several; New York is still building the one that travels in May.</p><h2>2. Improve Offensive Consistency</h2><p>When the Knicks shoot well, the crowd noise becomes part of the game plan. When they do not, the rivalry still feels loud but less convincing.</p><h2>3. Take Ownership in Big Moments</h2><p>Playoff basketball rewards the team willing to absorb the hit and answer anyway. That is the standard both sides are measuring each other against.</p>",
    essentials: [
      "Boston still sets the East ceiling, but New York has built enough swagger to make the matchup feel national.",
      "The Knicks need a go-to scoring sequence that holds up when the crowd and stakes are highest.",
      "This rivalry now travels because both fan bases believe they are arguing over the same throne.",
    ],
    featuredImage: {
      src: "/images/articles/basketball-rivals.svg",
      alt: "Stylized basketball court with orange and navy rivalry graphics",
      width: 1600,
      height: 900,
      credit: "John Doe / The Sports Rivalry",
    },
    topicSlugs: ["rivalries"],
    tags: ["NBA", "Boston Celtics", "New York Knicks"],
    relatedStorySlugs: [
      "caitlin-clark-vs-liberty-pressure-is-turning-fever-games-into-national-events",
      "aces-liberty-still-own-the-wnba-ego-war-even-when-the-scoreboard-flips",
    ],
    trendingScore: 94,
    isEditorsPick: true,
  },
  {
    id: "article-106",
    slug: "us-open-week-has-become-a-betting-war-between-discipline-and-chaos",
    sportSlug: "golf",
    leagueSlug: "pga-tour",
    authorSlugs: ["reese-mercer"],
    publishedAt: hoursAgo(3.5),
    updatedAt: hoursAgo(3),
    readTime: 4,
    title: "U.S. Open week has become a betting war between discipline and chaos",
    excerpt: "The event now asks one clean question: who can survive the version of golf that refuses to be polite?",
    deck: "Every U.S. Open build-up eventually turns into a referendum on whether patience or brute confidence should be favored.",
    bodyHtml:
      "<p>The U.S. Open is golf's most ruthless personality test. That is why it naturally creates rivalries between player types even before the tee times are announced.</p><p>Fans end up betting on philosophies as much as players: accuracy versus force, patience versus panic.</p>",
    featuredImage: {
      src: "/images/articles/golf-major.svg",
      alt: "Graphic golf fairway with trophy outlines and scoreboard accents",
      width: 1600,
      height: 900,
      credit: "Illustration by The Sports Rivalry Studio",
    },
    topicSlugs: ["rivalries"],
    tags: ["Golf", "U.S. Open", "Majors"],
    relatedStorySlugs: [
      "scheffler-vs-mcilroy-is-now-a-rivalry-about-control-not-just-trophies",
      "liv-vs-pga-tour-is-still-the-background-noise-behind-every-major",
    ],
    trendingScore: 92,
    isEditorsPick: true,
  },
  {
    id: "article-107",
    slug: "hamlin-vs-everybody-has-become-nascars-most-bankable-energy-source",
    sportSlug: "nascar",
    leagueSlug: "cup-series",
    authorSlugs: ["chase-holloway"],
    publishedAt: hoursAgo(4),
    updatedAt: hoursAgo(3.4),
    readTime: 4,
    title: "Hamlin vs everybody has become NASCAR’s most bankable energy source",
    excerpt: "No driver absorbs more boos and no team benefits more from that tension staying active.",
    deck: "Denny Hamlin keeps walking into races as both contender and antagonist, which gives NASCAR a reliable emotional center.",
    bodyHtml:
      "<p>The reason the Hamlin dynamic works is simple: people arrive already opinionated. That saves the sport from needing an inciting incident every week.</p><p>When he has speed, the crowd gets louder. When he wins, the reaction becomes part of the show.</p>",
    featuredImage: {
      src: "/images/articles/nascar-speed.svg",
      alt: "High-speed stock car illustration with track markings and dark gradients",
      width: 1600,
      height: 900,
      credit: "Illustration by The Sports Rivalry Studio",
    },
    topicSlugs: ["rivalries"],
    tags: ["NASCAR", "Denny Hamlin", "Cup Series"],
    relatedStorySlugs: [
      "elliott-vs-larson-keeps-feeling-like-nascars-cleanest-modern-feud",
      "team-penske-and-hendrick-keep-making-pit-road-feel-like-the-real-race",
    ],
    trendingScore: 91,
    isEditorsPick: true,
  },
  {
    id: "article-108",
    slug: "mets-braves-keep-punishing-any-team-that-blinks-first",
    sportSlug: "mlb",
    leagueSlug: "mlb",
    authorSlugs: ["miles-donovan"],
    publishedAt: hoursAgo(4.5),
    updatedAt: hoursAgo(4.1),
    readTime: 4,
    title: "Mets-Braves keep punishing any team that blinks first",
    excerpt: "This race feels exhausting because both clubs force the other to live without soft innings.",
    deck: "Atlanta and New York have built a divisional feud around pressure tolerance more than aesthetics.",
    bodyHtml:
      "<p>The Mets and Braves are difficult to watch casually because neither side leaves much room for drift. One crooked inning or one bullpen wobble usually changes the series.</p><p>That ruthless pace is why the rivalry stays useful deep into the summer.</p>",
    featuredImage: {
      src: "/images/articles/mlb-clubhouse.svg",
      alt: "Abstract baseball diamond with rivalry scoreboards and dugout lighting",
      width: 1600,
      height: 900,
      credit: "Illustration by The Sports Rivalry Studio",
    },
    topicSlugs: ["rivalries"],
    tags: ["MLB", "Mets", "Braves"],
    relatedStorySlugs: [
      "yankees-red-sox-rivalry-feels-mean-again-because-both-dugouts-need-it",
      "dodgers-padres-have-found-the-perfect-october-hate-cycle",
    ],
    trendingScore: 90,
    isEditorsPick: true,
  },
  {
    id: "article-109",
    slug: "aces-liberty-still-own-the-wnba-ego-war-even-when-the-scoreboard-flips",
    sportSlug: "basketball",
    leagueSlug: "wnba",
    authorSlugs: ["tessa-cole"],
    publishedAt: hoursAgo(5),
    updatedAt: hoursAgo(4.5),
    readTime: 4,
    title: "Aces-Liberty still own the WNBA ego war even when the scoreboard flips",
    excerpt: "No other matchup arrives with the same sense that the league’s self-image is on the line.",
    deck: "Las Vegas and New York keep meeting in games that feel like luxury fights over authority, not just wins.",
    bodyHtml:
      "<p>Aces-Liberty works because both rosters believe they should be the last visual you see in October. That certainty changes every regular-season meeting into something more permanent.</p><p>When both sides are healthy, the game feels like a title defense and a title audition at once.</p>",
    featuredImage: {
      src: "/images/articles/basketball-rivals.svg",
      alt: "Stylized basketball court with orange and navy rivalry graphics",
      width: 1600,
      height: 900,
      credit: "Illustration by The Sports Rivalry Studio",
    },
    topicSlugs: ["rivalries"],
    tags: ["WNBA", "Las Vegas Aces", "New York Liberty"],
    relatedStorySlugs: [
      "caitlin-clark-vs-liberty-pressure-is-turning-fever-games-into-national-events",
      "celtics-knicks-is-becoming-the-east-rivalry-that-actually-travels",
    ],
    trendingScore: 89,
    isEditorsPick: true,
  },
  {
    id: "article-110",
    slug: "liv-vs-pga-tour-is-still-the-background-noise-behind-every-major",
    sportSlug: "golf",
    leagueSlug: "pga-tour",
    authorSlugs: ["reese-mercer"],
    publishedAt: hoursAgo(5.5),
    updatedAt: hoursAgo(5),
    readTime: 5,
    title: "LIV vs PGA Tour is still the background noise behind every major",
    excerpt: "Even when the trophy goes elsewhere, the split still shapes how fans read the field.",
    deck: "Golf has learned that tour politics can shadow a leaderboard long after everyone says they are tired of talking about it.",
    bodyHtml:
      "<p>The split between LIV and the PGA Tour remains the sport's unavoidable rivalry because it keeps reappearing at the exact moments golf wants to talk about purity instead.</p><p>Every major ends up asking the same question in disguise: whose ecosystem looks more validated today?</p>",
    featuredImage: {
      src: "/images/articles/golf-major.svg",
      alt: "Graphic golf fairway with trophy outlines and scoreboard accents",
      width: 1600,
      height: 900,
      credit: "Illustration by The Sports Rivalry Studio",
    },
    topicSlugs: ["rivalries"],
    tags: ["Golf", "LIV Golf", "PGA Tour"],
    relatedStorySlugs: [
      "scheffler-vs-mcilroy-is-now-a-rivalry-about-control-not-just-trophies",
      "us-open-week-has-become-a-betting-war-between-discipline-and-chaos",
    ],
    trendingScore: 88,
    isEditorsPick: true,
  },
  {
    id: "article-111",
    slug: "team-penske-and-hendrick-keep-making-pit-road-feel-like-the-real-race",
    sportSlug: "nascar",
    leagueSlug: "cup-series",
    authorSlugs: ["chase-holloway"],
    publishedAt: hoursAgo(6),
    updatedAt: hoursAgo(5.4),
    readTime: 4,
    title: "Penske and Hendrick keep making pit road feel like the real race",
    excerpt: "The cars matter, but the rival engineering identities are what make this matchup repeatable.",
    deck: "When Team Penske and Hendrick arrive with equal speed, the duel becomes a test of nerve, sequencing, and crew-chief conviction.",
    bodyHtml:
      "<p>The Penske-Hendrick battle has become one of NASCAR's cleanest team rivalries because the disagreement starts before the green flag. Their approaches to race control feel different, and fans can see it.</p><p>That makes every late caution feel like a strategic referendum.</p>",
    featuredImage: {
      src: "/images/articles/nascar-speed.svg",
      alt: "High-speed stock car illustration with track markings and dark gradients",
      width: 1600,
      height: 900,
      credit: "Illustration by The Sports Rivalry Studio",
    },
    topicSlugs: ["rivalries"],
    tags: ["NASCAR", "Team Penske", "Hendrick Motorsports"],
    relatedStorySlugs: [
      "elliott-vs-larson-keeps-feeling-like-nascars-cleanest-modern-feud",
      "hamlin-vs-everybody-has-become-nascars-most-bankable-energy-source",
    ],
    trendingScore: 87,
    isEditorsPick: true,
  },
  {
    id: "article-112",
    slug: "orioles-blue-jays-keep-building-the-division-race-that-refuses-to-relax",
    sportSlug: "mlb",
    leagueSlug: "mlb",
    authorSlugs: ["miles-donovan"],
    publishedAt: hoursAgo(6.5),
    updatedAt: hoursAgo(6),
    readTime: 3,
    title: "Orioles-Blue Jays keep building the division race that refuses to relax",
    excerpt: "The series feels younger, meaner, and more dangerous every time the standings tighten.",
    deck: "Baltimore and Toronto do not have the oldest feud in baseball, but they might have the most impatient one right now.",
    bodyHtml:
      "<p>Baltimore-Toronto has become a rivalry for people who like their tension a little less ceremonial and a little more immediate. The urgency is the hook.</p><p>Every series feels like it starts with both clubs already annoyed.</p>",
    featuredImage: {
      src: "/images/articles/mlb-clubhouse.svg",
      alt: "Abstract baseball diamond with rivalry scoreboards and dugout lighting",
      width: 1600,
      height: 900,
      credit: "Illustration by The Sports Rivalry Studio",
    },
    topicSlugs: ["rivalries"],
    tags: ["MLB", "Orioles", "Blue Jays"],
    relatedStorySlugs: [
      "mets-braves-keep-punishing-any-team-that-blinks-first",
      "yankees-red-sox-rivalry-feels-mean-again-because-both-dugouts-need-it",
    ],
    trendingScore: 86,
  },
  {
    id: "article-112b",
    slug: "astros-rangers-turned-a-division-race-into-a-contact-sport",
    sportSlug: "mlb",
    leagueSlug: "mlb",
    authorSlugs: ["miles-donovan"],
    publishedAt: hoursAgo(8),
    updatedAt: hoursAgo(7.5),
    readTime: 4,
    title: "Astros-Rangers turned a division race into a contact sport",
    excerpt: "Texas and Houston keep finding new ways to make late-season baseball feel personal.",
    deck: "The rivalry has enough history to matter and enough recent heat to keep every pitch feeling louder than it should.",
    bodyHtml:
      "<p>Houston and Texas do not need a trophy on the line to play like something bigger is at stake. The division math and the recent history do that work for them.</p><p>That is why every series between them feels like it starts one inning too late.</p>",
    featuredImage: {
      src: "/images/articles/mlb-clubhouse.svg",
      alt: "Baseball rivalry illustration with dugout lighting",
      width: 1600,
      height: 900,
    },
    topicSlugs: ["rivalries"],
    tags: ["MLB", "Astros", "Rangers"],
    relatedStorySlugs: ["orioles-blue-jays-keep-building-the-division-race-that-refuses-to-relax"],
    trendingScore: 84,
  },
  {
    id: "article-113",
    slug: "pacers-vs-bucks-is-what-happens-when-disrespect-turns-productive",
    sportSlug: "basketball",
    leagueSlug: "nba",
    authorSlugs: ["tessa-cole"],
    publishedAt: hoursAgo(7),
    updatedAt: hoursAgo(6.6),
    readTime: 4,
    title: "Pacers-Bucks is what happens when disrespect turns productive",
    excerpt: "Not every rivalry needs a ring on the table. Sometimes mutual irritation is enough to change how both teams play.",
    deck: "Indiana and Milwaukee have built a real edge because both sides now expect the other to take things personally.",
    bodyHtml:
      "<p>The Pacers and Bucks have figured out the right amount of annoyance. There is enough history to matter and enough unfinished business to keep the matchup from softening.</p><p>That makes every tactical adjustment feel sharper than usual.</p>",
    featuredImage: {
      src: "/images/articles/basketball-rivals.svg",
      alt: "Stylized basketball court with orange and navy rivalry graphics",
      width: 1600,
      height: 900,
      credit: "Illustration by The Sports Rivalry Studio",
    },
    topicSlugs: ["rivalries"],
    tags: ["NBA", "Indiana Pacers", "Milwaukee Bucks"],
    relatedStorySlugs: [
      "celtics-knicks-is-becoming-the-east-rivalry-that-actually-travels",
      "caitlin-clark-vs-liberty-pressure-is-turning-fever-games-into-national-events",
    ],
    trendingScore: 85,
  },
  {
    id: "article-114",
    slug: "nelly-korda-vs-the-rest-of-the-field-is-golfs-most-suffocating-modern-problem",
    sportSlug: "golf",
    leagueSlug: "pga-tour",
    authorSlugs: ["reese-mercer"],
    publishedAt: hoursAgo(7.5),
    updatedAt: hoursAgo(7.1),
    readTime: 4,
    title: "Nelly Korda vs the field is golf’s most suffocating modern problem",
    excerpt: "The rivalry is asymmetrical, but that is exactly what makes every chase card compelling.",
    deck: "Korda's run has created the kind of pressure where opponents are no longer simply trying to win tournaments, they are trying to interrupt a mood.",
    bodyHtml:
      "<p>Golf does not always produce neat head-to-head rivalries, but it absolutely produces eras where the field begins acting like a coalition against one dominant player. That is where Nelly Korda lives now.</p><p>The tension comes from whether anyone can make her look ordinary for two days straight.</p>",
    featuredImage: {
      src: "/images/articles/golf-major.svg",
      alt: "Graphic golf fairway with trophy outlines and scoreboard accents",
      width: 1600,
      height: 900,
      credit: "Illustration by The Sports Rivalry Studio",
    },
    topicSlugs: ["rivalries"],
    tags: ["Golf", "Nelly Korda", "LPGA"],
    relatedStorySlugs: [
      "scheffler-vs-mcilroy-is-now-a-rivalry-about-control-not-just-trophies",
      "liv-vs-pga-tour-is-still-the-background-noise-behind-every-major",
    ],
    trendingScore: 84,
  },
  {
    id: "article-115",
    slug: "blaney-vs-bell-is-becoming-the-playoff-rivalry-with-the-cleanest-line",
    sportSlug: "nascar",
    leagueSlug: "cup-series",
    authorSlugs: ["chase-holloway"],
    publishedAt: hoursAgo(8),
    updatedAt: hoursAgo(7.5),
    readTime: 4,
    title: "Blaney-Bell is becoming the playoff rivalry with the cleanest line",
    excerpt: "This pairing works because both drivers now feel one disciplined run away from owning the same space.",
    deck: "Ryan Blaney and Christopher Bell keep colliding in the exact kind of late-season races that turn respect into resentment.",
    bodyHtml:
      "<p>Blaney and Bell are building the sort of postseason rivalry NASCAR trusts: serious, fast, and just personal enough to survive multiple rounds.</p><p>When both are alive late in a race, every move starts reading like a preview of November.</p>",
    featuredImage: {
      src: "/images/articles/nascar-speed.svg",
      alt: "High-speed stock car illustration with track markings and dark gradients",
      width: 1600,
      height: 900,
      credit: "Illustration by The Sports Rivalry Studio",
    },
    topicSlugs: ["rivalries"],
    tags: ["NASCAR", "Ryan Blaney", "Christopher Bell"],
    relatedStorySlugs: [
      "team-penske-and-hendrick-keep-making-pit-road-feel-like-the-real-race",
      "elliott-vs-larson-keeps-feeling-like-nascars-cleanest-modern-feud",
    ],
    trendingScore: 83,
  },
  {
    id: "article-4",
    slug: "mohun-bagan-look-built-for-control-not-chaos-in-the-isl-run-in",
    sportSlug: "football",
    leagueSlug: "isl",
    authorSlugs: ["sana-qureshi"],
    publishedAt: hoursAgo(3),
    updatedAt: hoursAgo(2),
    readTime: 5,
    title: "Mohun Bagan look built for control, not chaos, in the ISL run-in",
    excerpt: "The title race often rewards nerves. Mohun Bagan are making it about structure.",
    deck: "Their best trait is not flair; it is how little the game seems to rattle them after the break.",
    bodyHtml:
      "<p>In the final stretch of a title race, control becomes its own form of aggression. Mohun Bagan’s shape allows them to absorb momentum swings and reassert themselves without turning matches into coin flips.</p><p>That is why they feel sustainable in a pressure month: their identity does not depend on a perfect first half.</p>",
    featuredImage: {
      src: "/images/articles/football-control.svg",
      alt: "Football pitch graphic with strategic arrows and emerald accents",
      width: 1600,
      height: 900,
    },
    topicSlugs: ["title-races", "indian-football"],
    tags: ["ISL", "Mohun Bagan", "tactics"],
    relatedStorySlugs: ["isl-needs-more-clubs-willing-to-invest-in-clear-playing-identities"],
    trendingScore: 90,
    isBreaking: true,
    isEditorsPick: true,
  },
  {
    id: "article-5",
    slug: "isl-needs-more-clubs-willing-to-invest-in-clear-playing-identities",
    sportSlug: "football",
    leagueSlug: "isl",
    authorSlugs: ["sana-qureshi"],
    publishedAt: hoursAgo(18),
    updatedAt: hoursAgo(16),
    readTime: 7,
    title: "ISL needs more clubs willing to invest in clear playing identities",
    excerpt: "Recruitment matters, but cohesion arrives only when clubs know what they want to be.",
    deck: "The next leap for Indian football is less about splash and more about repeatable football ideas.",
    bodyHtml:
      "<p>Indian football has reached the point where stability of idea matters as much as recruitment ambition. Clubs that can define their style, coach profile, and squad logic gain a long-term edge over teams built around short-term reactions.</p><p>That is the difference between a decent season and a credible project.</p>",
    featuredImage: {
      src: "/images/articles/football-identity.svg",
      alt: "Abstract football stadium with layered green patterns",
      width: 1600,
      height: 900,
    },
    topicSlugs: ["indian-football"],
    tags: ["ISL", "club building", "Indian football"],
    relatedStorySlugs: ["mohun-bagan-look-built-for-control-not-chaos-in-the-isl-run-in"],
    trendingScore: 70,
  },
  {
    id: "article-6",
    slug: "arsenal-transfer-window-may-depend-on-finding-one-ruthless-finisher",
    sportSlug: "football",
    leagueSlug: "premier-league",
    authorSlugs: ["sana-qureshi"],
    publishedAt: daysAgo(1),
    updatedAt: hoursAgo(20),
    readTime: 4,
    title: "Arsenal’s transfer window may depend on finding one ruthless finisher",
    excerpt: "The structure is there. The next jump may require less buildup and more certainty in the box.",
    deck: "The squad looks close enough that one profile could change the tone of the title chase.",
    bodyHtml:
      "<p>Arsenal do not look far from a title-winning shape, but tight matches still ask for a cleaner final action. The next transfer window may be defined by their willingness to prioritize finishing certainty over another all-purpose attacker.</p>",
    featuredImage: {
      src: "/images/articles/football-window.svg",
      alt: "Transfer-themed football illustration with spotlight and tactical notes",
      width: 1600,
      height: 900,
    },
    topicSlugs: ["transfer-watch", "title-races"],
    tags: ["Premier League", "Arsenal", "transfers"],
    relatedStorySlugs: [],
    trendingScore: 66,
  },
  {
    id: "article-7",
    slug: "pv-sindhu-is-chasing-rhythm-again-not-just-results",
    sportSlug: "badminton",
    authorSlugs: ["riya-narayan"],
    publishedAt: hoursAgo(4),
    updatedAt: hoursAgo(3),
    readTime: 5,
    title: "PV Sindhu is chasing rhythm again, not just results",
    excerpt: "The scoreboard matters, but the larger story is about restoring conviction between points.",
    deck: "Sindhu’s season feels like a search for repeatable match rhythm against faster, more pressure-proof fields.",
    bodyHtml:
      "<p>When elite players search for form, the public tends to watch results first. But Sindhu’s recent weeks suggest a subtler challenge: regaining the in-rally confidence and transition speed that make her game look inevitable.</p><p>That is why the signs of progress matter even before trophies return.</p>",
    featuredImage: {
      src: "/images/articles/badminton-rhythm.svg",
      alt: "Badminton court illustration with bold purple and amber lines",
      width: 1600,
      height: 900,
    },
    topicSlugs: ["road-to-la-2028"],
    tags: ["PV Sindhu", "Badminton", "India"],
    relatedStorySlugs: ["lakshya-sen-needs-longer-patches-of-control-to-convert-big-weeks"],
    trendingScore: 88,
    isBreaking: true,
  },
  {
    id: "article-8",
    slug: "lakshya-sen-needs-longer-patches-of-control-to-convert-big-weeks",
    sportSlug: "badminton",
    authorSlugs: ["riya-narayan"],
    publishedAt: hoursAgo(14),
    updatedAt: hoursAgo(12),
    readTime: 4,
    title: "Lakshya Sen needs longer patches of control to convert big weeks",
    excerpt: "The peaks are real. The next step is making them last across an entire tournament.",
    deck: "His best badminton is already world-class; the challenge is extending it through pressure swings.",
    bodyHtml:
      "<p>Lakshya Sen has shown enough ceiling to belong against the world’s elite. What keeps the conversation open is not whether he can reach that level, but how often he can hold it when matches twist deep into deciding games.</p>",
    featuredImage: {
      src: "/images/articles/badminton-control.svg",
      alt: "Badminton shuttle and score graphics in motion",
      width: 1600,
      height: 900,
    },
    topicSlugs: ["road-to-la-2028"],
    tags: ["Lakshya Sen", "Badminton", "BWF Tour"],
    relatedStorySlugs: ["pv-sindhu-is-chasing-rhythm-again-not-just-results"],
    trendingScore: 68,
  },
  {
    id: "article-9",
    slug: "jaipur-pink-panthers-have-turned-patience-into-their-best-raid-weapon",
    sportSlug: "kabaddi",
    leagueSlug: "pkl",
    authorSlugs: ["veer-chaudhary"],
    publishedAt: hoursAgo(9),
    updatedAt: hoursAgo(8),
    readTime: 5,
    title: "Jaipur Pink Panthers have turned patience into their best raid weapon",
    excerpt: "They are slowing defenders into mistakes before the scoreboard notices.",
    deck: "Kabaddi’s sharpest franchises are proving that tempo manipulation can be more dangerous than frantic aggression.",
    bodyHtml:
      "<p>The Pink Panthers are using patience as pressure. Instead of forcing every raid into a highlight, they are asking defenders to carry the anxiety of waiting, then punishing shape breaks with clean, disciplined decision-making.</p>",
    featuredImage: {
      src: "/images/articles/kabaddi-patience.svg",
      alt: "Kabaddi mat illustration with orange tactical markers",
      width: 1600,
      height: 900,
    },
    topicSlugs: ["rivalries"],
    tags: ["PKL", "Jaipur Pink Panthers", "kabaddi tactics"],
    relatedStorySlugs: ["pkl-title-race-could-belong-to-the-best-defensive-pairing"],
    trendingScore: 73,
    isEditorsPick: true,
  },
  {
    id: "article-10",
    slug: "pkl-title-race-could-belong-to-the-best-defensive-pairing",
    sportSlug: "kabaddi",
    leagueSlug: "pkl",
    authorSlugs: ["veer-chaudhary"],
    publishedAt: daysAgo(1),
    updatedAt: hoursAgo(24),
    readTime: 4,
    title: "PKL title race could belong to the best defensive pairing",
    excerpt: "Raiders grab headlines, but the championship math may point elsewhere.",
    deck: "Late-season kabaddi often bends toward teams that can deny momentum in two positions at once.",
    bodyHtml:
      "<p>As playoff intensity grows, the cost of one mistimed tackle rises dramatically. That is why defensive pairings, not just superstar raiders, may decide the league’s balance of power.</p>",
    featuredImage: {
      src: "/images/articles/kabaddi-defense.svg",
      alt: "Kabaddi defenders in a stylized orange and charcoal composition",
      width: 1600,
      height: 900,
    },
    topicSlugs: ["rivalries"],
    tags: ["PKL", "defense", "kabaddi"],
    relatedStorySlugs: ["jaipur-pink-panthers-have-turned-patience-into-their-best-raid-weapon"],
    trendingScore: 61,
  },
  {
    id: "article-11",
    slug: "indian-wrestling-needs-clearer-pathways-between-junior-success-and-senior-stability",
    sportSlug: "wrestling",
    authorSlugs: ["veer-chaudhary"],
    publishedAt: hoursAgo(15),
    updatedAt: hoursAgo(13),
    readTime: 6,
    title: "Indian wrestling needs clearer pathways between junior success and senior stability",
    excerpt: "Talent is surfacing. The bridge to sustained senior performance still feels too fragile.",
    deck: "The next step for the sport is reducing the drop-off between promising bursts and durable careers.",
    bodyHtml:
      "<p>India’s wrestling pipeline continues to produce talent, but the transition from youth promise to senior certainty remains uneven. Better support structures, competition planning, and long-term coaching continuity would make those leaps less volatile.</p>",
    featuredImage: {
      src: "/images/articles/wrestling-pathway.svg",
      alt: "Wrestling silhouette with blue and steel motion graphics",
      width: 1600,
      height: 900,
    },
    topicSlugs: ["road-to-la-2028", "women-in-sport"],
    tags: ["Wrestling", "India", "development"],
    relatedStorySlugs: [],
    trendingScore: 58,
  },
  {
    id: "article-12",
    slug: "road-to-la-2028-is-already-shaping-how-indian-athletes-plan-their-seasons",
    sportSlug: "olympics",
    authorSlugs: ["riya-narayan"],
    publishedAt: hoursAgo(7),
    updatedAt: hoursAgo(6),
    readTime: 6,
    title: "Road to LA 2028 is already shaping how Indian athletes plan their seasons",
    excerpt: "Qualification is no longer a distant idea. It is changing schedules, recovery, and event choices right now.",
    deck: "Olympic planning starts years before the opening ceremony, and Indian contenders are already living inside that timeline.",
    bodyHtml:
      "<p>Olympic cycles now affect almost every part of elite planning: when athletes peak, which events they enter, and how they balance form against recovery. For Indian contenders, that means the LA 2028 story is already underway.</p>",
    featuredImage: {
      src: "/images/articles/olympics-road.svg",
      alt: "Olympic road map illustration with gold and graphite layers",
      width: 1600,
      height: 900,
    },
    topicSlugs: ["road-to-la-2028"],
    tags: ["Olympics", "India", "qualification"],
    relatedStorySlugs: ["pv-sindhu-is-chasing-rhythm-again-not-just-results"],
    trendingScore: 84,
    isEditorsPick: true,
  },
];

// Realistic sports photography for seeded/demo content so the homepage
// resembles the reference design. Real content is served from WordPress.
const SEED_PHOTO_IDS = [
  "1540747913346-19e32dc3e97e",
  "1521412644187-c49fa049e84d",
  "1546519638-68e109498ffc",
  "1574629810360-7efbbe195018",
  "1579952363873-27f3bade9f55",
  "1551958219-acbc608c6377",
  "1431324155629-1a6deb1dec8d",
  "1517649763962-0c623066013b",
  "1485395037613-e83d5c1f5290",
  "1607627000458-210e8d2bdb1d",
  "1518091043644-c1d4457512c6",
  "1552667466-07770ae110d0",
  "1530549387789-4c1017266635",
  "1471295253337-3ceaaedca402",
  "1599058917212-d750089bc07e",
  "1556056504-5c7696c4c28d",
  "1544025162-d76694265947",
  "1461896836934-ffe607ba8211",
  "1543351611-58f69d7c1781",
  "1526232761682-d26e03ac148e",
  "1487466365202-1afdb86c764e",
  "1593341646782-e0b495cff86d",
];

function seedPhoto(index: number) {
  const id = SEED_PHOTO_IDS[index % SEED_PHOTO_IDS.length];
  return `https://images.unsplash.com/photo-${id}?w=1600&q=70&auto=format&fit=crop`;
}

export const articles: Article[] = rawArticles.map((entry, index) => {
  const sport = sportBySlug(entry.sportSlug);
  const league = entry.leagueSlug ? leagueBySlug(entry.leagueSlug) : undefined;

  return {
    id: entry.id,
    slug: entry.slug,
    title: entry.title,
    excerpt: entry.excerpt,
    deck: entry.deck,
    bodyHtml: entry.bodyHtml,
    featuredImage: {
      ...entry.featuredImage,
      src: seedPhoto(index),
      alt: entry.title,
      width: 1600,
      height: 900,
    },
    sport,
    league:
      league &&
      ({
        slug: league.slug,
        name: league.name,
        sportSlug: league.sportSlug,
        seasonLabel: league.seasonLabel,
        description: league.description,
      } satisfies LeagueSummary),
    authors: entry.authorSlugs.map(authorBySlug),
    publishedAt: entry.publishedAt,
    updatedAt: entry.updatedAt,
    readTime: entry.readTime,
    topicSlugs: entry.topicSlugs,
    tags: entry.tags,
    seo: articleSeo(entry.sportSlug, entry.slug, entry.title, entry.excerpt),
    relatedStorySlugs: entry.relatedStorySlugs,
    trendingScore: entry.trendingScore,
    isBreaking: entry.isBreaking,
    isEditorsPick: entry.isEditorsPick,
    essentials: "essentials" in entry ? entry.essentials : undefined,
  };
});

export const sportHubs: SportHub[] = sports.map((sport) => {
  const sportArticles = articles.filter((article) => article.sport.slug === sport.slug);

  return {
    slug: sport.slug,
    name: sport.name,
    description: sport.description,
    accent: sport.accent,
    heroArticleSlug: sportArticles[0]?.slug || "",
    featuredArticleSlugs: sportArticles.slice(0, 4).map((article) => article.slug),
    editorsPickSlugs: sportArticles
      .filter((article) => article.isEditorsPick)
      .slice(0, 3)
      .map((article) => article.slug),
    leagueSlugs: leagues
      .filter((league) => league.sportSlug === sport.slug)
      .map((league) => league.slug),
    featuredTeams: sport.featuredTeams,
    seo: {
      title: `${sport.name} Rivalries | ${SITE_NAME}`,
      description: sport.description,
      canonicalPath: `/${sport.slug}`,
    },
  };
});

export const leagueHubs: LeagueHub[] = leagues.map((league) => {
  const sport = sportBySlug(league.sportSlug);
  const leagueArticles = articles.filter((article) => article.league?.slug === league.slug);

  return {
    slug: league.slug,
    name: league.name,
    sport,
    seasonLabel: league.seasonLabel,
    description: league.description,
    articleSlugs: leagueArticles.map((article) => article.slug),
    seo: {
      title: `${league.name} ${league.seasonLabel} | ${SITE_NAME}`,
      description: league.description,
      canonicalPath: `/${sport.slug}/${league.slug}`,
    },
  };
});

export const topicHubs: TopicHub[] = [
  {
    slug: "rivalries",
    title: "Rivalries",
    description: "The pressure points, grudges, and emotional edges that make sports feel alive.",
    articleSlugs: articles.filter((article) => article.topicSlugs.includes("rivalries")).map((article) => article.slug),
    seo: {
      title: `Rivalries | ${SITE_NAME}`,
      description: "Sports rivalries and defining pressure points.",
      canonicalPath: "/topics/rivalries",
    },
  },
  {
    slug: "road-to-la-2028",
    title: "Road to LA 2028",
    description: "Tracking the athletes, qualification arcs, and decisions shaping India’s Olympic future.",
    articleSlugs: articles
      .filter((article) => article.topicSlugs.includes("road-to-la-2028"))
      .map((article) => article.slug),
    seo: {
      title: `Road to LA 2028 | ${SITE_NAME}`,
      description: "Olympic qualification, planning, and athlete journeys toward Los Angeles 2028.",
      canonicalPath: "/topics/road-to-la-2028",
    },
  },
  {
    slug: "transfer-watch",
    title: "Transfer Watch",
    description: "Shortlists, leverage moves, and the roster decisions that shape the season ahead.",
    articleSlugs: articles.filter((article) => article.topicSlugs.includes("transfer-watch")).map((article) => article.slug),
    seo: {
      title: `Transfer Watch | ${SITE_NAME}`,
      description: "Transfer analysis and roster moves across football.",
      canonicalPath: "/topics/transfer-watch",
    },
  },
];

export const newsletters: NewsletterIssue[] = [
  {
    slug: "fan-zone-weekly",
    title: "Fan Zone Weekly",
    description: "A rivalry-first weekly briefing built for fans who want the loudest storylines without the fluff.",
    heroCopy:
      "Join the fan zone for one sharp weekly pass through the grudges, title races, and superstar pressure points driving the week.",
    schedule: "Delivered every Friday at 8:00 AM ET",
    ctaLabel: "Join the fan zone",
    highlightedArticleSlugs: [
      "yankees-red-sox-rivalry-feels-mean-again-because-both-dugouts-need-it",
      "caitlin-clark-vs-liberty-pressure-is-turning-fever-games-into-national-events",
      "elliott-vs-larson-keeps-feeling-like-nascars-cleanest-modern-feud",
    ],
    seo: {
      title: `Fan Zone Weekly | ${SITE_NAME}`,
      description: "The Sports Rivalry’s rivalry-first fan newsletter.",
      canonicalPath: "/newsletters/fan-zone-weekly",
    },
  },
];

export const landingPages: LandingPage[] = [];

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug) || null;
}

export function getSportHubBySlug(slug: string) {
  return sportHubs.find((sport) => sport.slug === slug) || null;
}

export function getLeagueHubBySportAndSlug(sportSlug: string, leagueSlug: string) {
  return (
    leagueHubs.find(
      (league) => league.slug === leagueSlug && league.sport.slug === sportSlug,
    ) || null
  );
}

export function getTopicBySlug(slug: string) {
  return topicHubs.find((topic) => topic.slug === slug) || null;
}

export function getAuthorBySlug(slug: string) {
  return authors.find((author) => author.slug === slug) || null;
}

export function getNewsletterBySlug(slug: string) {
  return newsletters.find((issue) => issue.slug === slug) || null;
}

export function getLandingPageBySlug(slug: string) {
  return landingPages.find((page) => page.slug === slug) || null;
}

export function resolveSportDetail(sportSlug: string, secondarySlug: string) {
  const league = getLeagueHubBySportAndSlug(sportSlug, secondarySlug);

  if (league) {
    return { type: "league" as const, league };
  }

  const article = articles.find(
    (entry) => entry.sport.slug === sportSlug && entry.slug === secondarySlug,
  );

  if (article) {
    return { type: "article" as const, article };
  }

  return null;
}

export function getArticlesBySlugs(slugs: string[]) {
  return dedupeByKey(
    slugs.map((slug) => getArticleBySlug(slug)).filter(Boolean) as Article[],
    (article) => article.id,
  );
}

export function getRelatedArticles(article: Article) {
  const manual = getArticlesBySlugs(article.relatedStorySlugs);
  const fallback = articles.filter(
    (candidate) =>
      candidate.slug !== article.slug &&
      (candidate.sport.slug === article.sport.slug ||
        candidate.topicSlugs.some((topicSlug) => article.topicSlugs.includes(topicSlug))),
  );

  return dedupeByKey([...manual, ...fallback], (candidate) => candidate.id).slice(0, 4);
}

export function getLatestArticles(limit = 12) {
  return sortByPublishedAt(articles).slice(0, limit);
}

export function getTrendingArticles(limit = 6) {
  return [...articles].sort((left, right) => right.trendingScore - left.trendingScore).slice(0, limit);
}

export const quickHitsConfig: QuickHitsConfig = {
  enabled: true,
  title: "MLB pennant-race week: Miles Donovan’s quick hits",
  selectionMode: "manual",
  featuredArticleSlug: "yankees-red-sox-rivalry-feels-mean-again-because-both-dugouts-need-it",
  secondaryArticleSlugs: [
    "dodgers-padres-have-found-the-perfect-october-hate-cycle",
    "mets-braves-keep-punishing-any-team-that-blinks-first",
  ],
  secondaryCount: 2,
};

function sameCalendarDay(left: string, right: string) {
  return left.slice(0, 10) === right.slice(0, 10);
}

export function resolveQuickHits(config: QuickHitsConfig): QuickHitsBlock | null {
  if (!config.enabled) {
    return null;
  }

  let selected: Article[] = [];

  if (config.selectionMode === "manual") {
    const slugs = [
      config.featuredArticleSlug,
      ...(config.secondaryArticleSlugs || []),
    ].filter((slug): slug is string => Boolean(slug));
    selected = getArticlesBySlugs(slugs);
  }

  if (config.selectionMode === "author_date") {
    const byAuthor = sortByPublishedAt(
      articles.filter((article) =>
        article.authors.some((author) => author.slug === config.authorSlug),
      ),
    );
    const sameDay = config.publishedDate
      ? byAuthor.filter((article) => sameCalendarDay(article.publishedAt, config.publishedDate!))
      : byAuthor;
    const minimumCount = (config.secondaryCount ?? 2) + 1;

    selected = sameDay.length >= minimumCount ? sameDay : byAuthor;
  }

  if (config.selectionMode === "sport_date") {
    const bySport = sortByPublishedAt(
      articles.filter((article) => article.sport.slug === config.sportSlug),
    );
    const sameDay = config.publishedDate
      ? bySport.filter((article) => sameCalendarDay(article.publishedAt, config.publishedDate!))
      : bySport;
    const minimumCount = (config.secondaryCount ?? 2) + 1;

    selected = sameDay.length >= minimumCount ? sameDay : bySport;
  }

  if (!selected.length) {
    return null;
  }

  const featured =
    (config.featuredArticleSlug
      ? selected.find((article) => article.slug === config.featuredArticleSlug)
      : null) || selected[0];
  const secondaryLimit = config.secondaryCount ?? 2;
  const secondary = selected
    .filter((article) => article.id !== featured.id)
    .slice(0, secondaryLimit);

  return {
    config,
    featured,
    secondary,
  };
}

export function getHomePageData(): HomePageData {
  const homepageSports = [...HOMEPAGE_SPORTS];
  const homepageSportSlugs = new Set<string>(HOMEPAGE_SPORTS);
  const homepagePool = sortByPublishedAt(
    articles.filter((article) => homepageSportSlugs.has(article.sport.slug)),
  );
  const topHeadlines = getArticlesBySlugs([
    "yankees-red-sox-rivalry-feels-mean-again-because-both-dugouts-need-it",
    "caitlin-clark-vs-liberty-pressure-is-turning-fever-games-into-national-events",
    "scheffler-vs-mcilroy-is-now-a-rivalry-about-control-not-just-trophies",
    "elliott-vs-larson-keeps-feeling-like-nascars-cleanest-modern-feud",
    "dodgers-padres-have-found-the-perfect-october-hate-cycle",
  ]);
  const breakingNews = homepagePool.filter((article) => article.isBreaking).slice(0, 4);
  const heroSlides = getArticlesBySlugs([
    "yankees-red-sox-rivalry-feels-mean-again-because-both-dugouts-need-it",
    "celtics-knicks-is-becoming-the-east-rivalry-that-actually-travels",
    "us-open-week-has-become-a-betting-war-between-discipline-and-chaos",
    "hamlin-vs-everybody-has-become-nascars-most-bankable-energy-source",
  ]);
  const latestArticles = homepagePool.slice(0, 12);
  const heroArticle = heroSlides[0] || homepagePool[0];
  const heroSecondary = heroSlides.slice(1, 4);
  const sportRails = homepageSports
    .map((slug) => {
      const sport = sports.find((entry) => entry.slug === slug);

      if (!sport) {
        return null;
      }

      return {
        sport,
        articles: homepagePool
          .filter((article) => article.sport.slug === sport.slug)
          .slice(0, SPORT_RAIL_ARTICLE_COUNT),
      };
    })
    .filter(Boolean) as HomePageData["sportRails"];
  const editorsPicks = homepagePool.filter((article) => article.isEditorsPick).slice(0, 4);
  const trendingArticles = [...homepagePool]
    .sort((left, right) => right.trendingScore - left.trendingScore)
    .slice(0, 8);
  const recommendedReads = dedupeByKey(
    [...editorsPicks, ...trendingArticles],
    (article) => article.id,
  ).slice(0, 3);

  return {
    breakingNews,
    topHeadlines,
    heroArticle,
    heroSecondary,
    latestArticles,
    categoryStrip: HOMEPAGE_CATEGORY_STRIP,
    quickHits: null,
    sportRails,
    trendingArticles,
    editorsPicks,
    recommendedReads,
    newsletter: newsletters[0],
    featuredAuthors: authors.filter((author) =>
      ["miles-donovan", "tessa-cole", "reese-mercer", "chase-holloway"].includes(author.slug),
    ),
  };
}

export function searchSite(query: string): SearchResult[] {
  const needle = query.trim().toLowerCase();

  if (!needle) {
    return [];
  }

  const articleResults = articles
    .filter(
      (article) =>
        article.title.toLowerCase().includes(needle) ||
        article.excerpt.toLowerCase().includes(needle) ||
        article.tags.some((tag) => tag.toLowerCase().includes(needle)),
    )
    .map((article) => ({
      type: "article" as const,
      title: article.title,
      href: `/${article.sport.slug}/${article.slug}`,
      summary: article.excerpt,
    }));

  const authorResults = authors
    .filter(
      (author) =>
        author.name.toLowerCase().includes(needle) ||
        author.expertise.toLowerCase().includes(needle),
    )
    .map((author) => ({
      type: "author" as const,
      title: author.name,
      href: `/authors/${author.slug}`,
      summary: author.expertise,
    }));

  const topicResults = topicHubs
    .filter(
      (topic) =>
        topic.title.toLowerCase().includes(needle) ||
        topic.description.toLowerCase().includes(needle),
    )
    .map((topic) => ({
      type: "topic" as const,
      title: topic.title,
      href: `/topics/${topic.slug}`,
      summary: topic.description,
    }));

  const sportResults = sports
    .filter(
      (sport) =>
        sport.name.toLowerCase().includes(needle) ||
        sport.description.toLowerCase().includes(needle),
    )
    .map((sport) => ({
      type: "sport" as const,
      title: sport.name,
      href: `/${sport.slug}`,
      summary: sport.description,
    }));

  const leagueResults = leagueHubs
    .filter(
      (league) =>
        league.name.toLowerCase().includes(needle) ||
        league.description.toLowerCase().includes(needle),
    )
    .map((league) => ({
      type: "league" as const,
      title: league.name,
      href: `/${league.sport.slug}/${league.slug}`,
      summary: league.description,
    }));

  const landingResults = landingPages
    .filter(
      (page) =>
        page.title.toLowerCase().includes(needle) ||
        page.description.toLowerCase().includes(needle),
    )
    .map((page) => ({
      type: "landing" as const,
      title: page.title,
      href: `/${page.slug}`,
      summary: page.description,
    }));

  return dedupeByKey(
    [
      ...articleResults,
      ...authorResults,
      ...topicResults,
      ...sportResults,
      ...leagueResults,
      ...landingResults,
    ],
    (result) => `${result.type}:${result.href}`,
  ).slice(0, 16);
}
