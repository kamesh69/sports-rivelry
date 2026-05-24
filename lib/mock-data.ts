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
import { SITE_NAME } from "@/lib/site-config";
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
    slug: "cricket",
    name: "Cricket",
    description: "India’s biggest rivalries, leagues, and dressing-room turns.",
    accent: "#9c1d22",
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
    slug: "ipl",
    name: "IPL",
    sportSlug: "cricket",
    seasonLabel: "2026 Season",
    description: "Franchise form, tactical tweaks, and title-race swings.",
  },
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
];

export const authors: AuthorProfile[] = [
  {
    id: "author-1",
    slug: "anay-mehra",
    name: "Anay Mehra",
    role: "Senior Cricket Writer",
    beat: "Cricket",
    bio: "Anay tracks franchise strategy, selection pressure, and the cultural force of Indian cricket.",
    expertise:
      "Specialises in squad building, matchups, and the storylines that connect IPL form to national-team pressure.",
    avatar: {
      src: "/images/authors/anay.svg",
      alt: "Portrait illustration of Anay Mehra",
      width: 720,
      height: 720,
    },
    socials: [
      { platform: "X", label: "@anaywrites", url: "https://x.com/anaywrites" },
      {
        platform: "Instagram",
        label: "@anay.mehra",
        url: "https://instagram.com/anay.mehra",
      },
    ],
    seo: {
      title: `Anay Mehra | ${SITE_NAME}`,
      description: "Senior Cricket Writer at Sports Rivalry.",
      canonicalPath: "/authors/anay-mehra",
    },
  },
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
      description: "Football Features Editor at Sports Rivalry.",
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
      description: "Olympics & Badminton Correspondent at Sports Rivalry.",
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
      description: "Combat & Kabaddi Reporter at Sports Rivalry.",
      canonicalPath: "/authors/veer-chaudhary",
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
    id: "article-1",
    slug: "mi-trust-their-middle-overs-machine-as-ipl-pressure-rises",
    sportSlug: "cricket",
    leagueSlug: "ipl",
    authorSlugs: ["anay-mehra"],
    publishedAt: hoursAgo(2),
    updatedAt: hoursAgo(1),
    readTime: 5,
    title: "MI trust their middle-overs machine as IPL pressure rises",
    excerpt: "Mumbai’s gamble is no longer about star power. It is about owning the innings after the powerplay.",
    deck: "Mumbai’s recent surge has come from slowing the game down exactly where rivals want to accelerate.",
    bodyHtml:
      "<p>Mumbai Indians have rebuilt control around the least glamorous stretch of a T20 innings. Instead of chasing powerplay fireworks alone, they are squeezing opponents through the middle overs with deeper bowling matchups and calmer batting roles.</p><p>The shift matters because title contenders are no longer separating themselves only by explosive openings. They are winning the seven-over wrestling match in the middle, where risk, spin, and tempo all collide.</p><p>That gives MI an advantage in high-pressure games: their best cricket now looks repeatable rather than streaky.</p>",
    featuredImage: {
      src: "/images/articles/cricket-pulse.svg",
      alt: "Stylized cricket stadium with red scoreboard tones",
      width: 1600,
      height: 900,
    },
    topicSlugs: ["rivalries", "ipl-2026"],
    tags: ["IPL", "Mumbai Indians", "T20 tactics"],
    relatedStorySlugs: [
      "rcb-need-a-calmer-finish-to-turn-hype-into-ipl-points",
      "ipl-2026-title-race-has-already-became-a-battle-of-bench-depth",
    ],
    trendingScore: 95,
    isBreaking: true,
    isEditorsPick: true,
  },
  {
    id: "article-2",
    slug: "rcb-need-a-calmer-finish-to-turn-hype-into-ipl-points",
    sportSlug: "cricket",
    leagueSlug: "ipl",
    authorSlugs: ["anay-mehra"],
    publishedAt: hoursAgo(6),
    updatedAt: hoursAgo(5),
    readTime: 4,
    title: "RCB need a calmer finish to turn hype into IPL points",
    excerpt: "The problem is not talent. It is the last five overs feeling louder than the first fifteen.",
    deck: "Bengaluru’s margin for error keeps shrinking because the endgame still looks emotional instead of methodical.",
    bodyHtml:
      "<p>Royal Challengers Bengaluru are creating enough moments to stay relevant, but title-chasing teams need closing patterns, not just crowd surges. Their batting is still too vulnerable to a single collapse point in the 16th or 17th over.</p><p>If they fix the tempo of the finish, they can turn dramatic nights into a more stable run of results.</p>",
    featuredImage: {
      src: "/images/articles/cricket-control.svg",
      alt: "Cricket field with tactical markings and scoreboard elements",
      width: 1600,
      height: 900,
    },
    topicSlugs: ["rivalries", "ipl-2026"],
    tags: ["RCB", "IPL", "batting strategy"],
    relatedStorySlugs: ["mi-trust-their-middle-overs-machine-as-ipl-pressure-rises"],
    trendingScore: 82,
    isEditorsPick: true,
  },
  {
    id: "article-3",
    slug: "ipl-2026-title-race-has-already-became-a-battle-of-bench-depth",
    sportSlug: "cricket",
    leagueSlug: "ipl",
    authorSlugs: ["anay-mehra"],
    publishedAt: hoursAgo(12),
    updatedAt: hoursAgo(10),
    readTime: 6,
    title: "IPL 2026 title race has already become a battle of bench depth",
    excerpt: "The best squads are not just surviving absences. They are making depth feel like a tactical weapon.",
    deck: "In a long league, the contenders are showing that squad architecture matters as much as star ceilings.",
    bodyHtml:
      "<p>Injuries, workload management, and matchup-based rotation are redefining what a strong IPL campaign looks like. The best teams are no longer clinging to a fixed eleven; they are using the squad like a toolkit.</p><p>That gives coaches the confidence to adapt to venue, spin profile, or left-right combinations without losing shape.</p>",
    featuredImage: {
      src: "/images/articles/cricket-bench.svg",
      alt: "Cricket bench and tactical notes in a red-toned abstract illustration",
      width: 1600,
      height: 900,
    },
    topicSlugs: ["ipl-2026"],
    tags: ["IPL", "team building", "franchise strategy"],
    relatedStorySlugs: ["mi-trust-their-middle-overs-machine-as-ipl-pressure-rises"],
    trendingScore: 77,
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

export const articles: Article[] = rawArticles.map((entry) => {
  const sport = sportBySlug(entry.sportSlug);
  const league = entry.leagueSlug ? leagueBySlug(entry.leagueSlug) : undefined;

  return {
    id: entry.id,
    slug: entry.slug,
    title: entry.title,
    excerpt: entry.excerpt,
    deck: entry.deck,
    bodyHtml: entry.bodyHtml,
    featuredImage: entry.featuredImage,
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
    seo: {
      title: `${sport.name} News | ${SITE_NAME}`,
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
    slug: "ipl-2026",
    title: "IPL 2026",
    description: "News, strategy, and title-race turns from the 2026 IPL season.",
    articleSlugs: articles.filter((article) => article.topicSlugs.includes("ipl-2026")).map((article) => article.slug),
    seo: {
      title: `IPL 2026 | ${SITE_NAME}`,
      description: "IPL 2026 news, form, and franchise storylines.",
      canonicalPath: "/topics/ipl-2026",
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
    slug: "the-morning-huddle",
    title: "The Morning Huddle",
    description: "A quick-hit briefing on what changed overnight and what matters next across Indian and global sport.",
    heroCopy:
      "Every morning, Sports Rivalry lines up the biggest rivalry, sharpest turn, and smartest context before the day gets noisy.",
    schedule: "Delivered Monday to Saturday at 8:00 AM IST",
    ctaLabel: "Join the list",
    highlightedArticleSlugs: [
      "mi-trust-their-middle-overs-machine-as-ipl-pressure-rises",
      "mohun-bagan-look-built-for-control-not-chaos-in-the-isl-run-in",
      "road-to-la-2028-is-already-shaping-how-indian-athletes-plan-their-seasons",
    ],
    seo: {
      title: `The Morning Huddle | ${SITE_NAME}`,
      description: "Sports Rivalry’s flagship newsletter for fast, sharp sports context.",
      canonicalPath: "/newsletters/the-morning-huddle",
    },
  },
];

export const landingPages: LandingPage[] = [
  {
    slug: "ipl-2026",
    title: "IPL 2026: News, Schedule, Results, and Title-Race Storylines",
    kicker: "Event Hub",
    description: "An evergreen IPL hub designed for search, fast updates, and deep franchise context.",
    heroArticleSlug: "mi-trust-their-middle-overs-machine-as-ipl-pressure-rises",
    articleSlugs: articles
      .filter((article) => article.league?.slug === "ipl")
      .map((article) => article.slug),
    seo: {
      title: `IPL 2026 Hub | ${SITE_NAME}`,
      description: "Latest IPL 2026 news, features, and franchise analysis.",
      canonicalPath: "/ipl-2026",
    },
  },
];

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
  title: "IPL middle-overs week: Anay Mehra’s quick hits",
  selectionMode: "manual",
  featuredArticleSlug: "mi-trust-their-middle-overs-machine-as-ipl-pressure-rises",
  secondaryArticleSlugs: [
    "rcb-need-a-calmer-finish-to-turn-hype-into-ipl-points",
    "ipl-2026-title-race-has-already-became-a-battle-of-bench-depth",
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
  const latestArticles = getLatestArticles(12);
  const breakingNews = latestArticles.filter((article) => article.isBreaking).slice(0, 4);
  const heroArticle = latestArticles[0];
  const heroSecondary = latestArticles.slice(1, 4);
  const sportRails = sports.map((sport) => ({
    sport,
    articles: latestArticles.filter((article) => article.sport.slug === sport.slug).slice(0, 4),
  }));
  const editorsPicks = latestArticles.filter((article) => article.isEditorsPick).slice(0, 4);

  return {
    breakingNews,
    heroArticle,
    heroSecondary,
    latestArticles,
    quickHits: resolveQuickHits(quickHitsConfig),
    sportRails,
    trendingArticles: getTrendingArticles(),
    editorsPicks,
    newsletter: newsletters[0],
    featuredAuthors: authors,
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
