import type {
  Championship,
  College,
  CollegeSpotlightArticle,
  Conference,
  NcaaHeroContent,
  NcaaNewsArticle,
  RankingGroup,
  Sport,
  SportIconLink,
  Video,
} from "@/lib/ncaa-types";

/**
 * Mock dataset backing the NCAA module. This is the single place that will
 * need to change when the module is wired up to a real API/CMS — every
 * `services/ncaa*.service.ts` function reads from here, and every component
 * only ever talks to the service layer.
 */

export const NCAA_HERO_CONTENT: NcaaHeroContent = {
  eyebrow: "2025-26 Season",
  headline: "Champions Are Built Here",
  description:
    "From iconic rivalries to unforgettable moments, this is where every sport, every athlete, and every story comes to life.",
  ctaLabel: "Read Story",
  ctaHref: "/ncaa/news/rising-stars-and-new-rivals-define-the-championship-chase",
  image: {
    src: "https://picsum.photos/seed/ncaa-hero/1800/1000",
    alt: "College athletes competing across NCAA sports",
    width: 1800,
    height: 1000,
  },
  stats: [
    { label: "Sports", value: "28" },
    { label: "Schools", value: "1,200+" },
    { label: "Student Athletes", value: "500K+" },
  ],
  seasonLabel: "2024-25 SEASON",
  tagline: "UNITED BY PASSION. DRIVEN BY EXCELLENCE.",
};

export const NCAA_SPORTS: Sport[] = [
  { id: "football", slug: "football", name: "Football", image: "https://picsum.photos/seed/ncaa-football/640/480", storyCount: 1850, isLive: true },
  { id: "mens-basketball", slug: "mens-basketball", name: "Men's Basketball", image: "https://picsum.photos/seed/ncaa-mbb/640/480", storyCount: 1430, isLive: true },
  { id: "womens-basketball", slug: "womens-basketball", name: "Women's Basketball", image: "https://picsum.photos/seed/ncaa-wbb/640/480", storyCount: 980, isLive: true },
  { id: "baseball", slug: "baseball", name: "Baseball", image: "https://picsum.photos/seed/ncaa-baseball/640/480", storyCount: 750, isLive: true },
  { id: "softball", slug: "softball", name: "Softball", image: "https://picsum.photos/seed/ncaa-softball/640/480", storyCount: 620, isLive: true },
  { id: "volleyball", slug: "volleyball", name: "Volleyball", image: "https://picsum.photos/seed/ncaa-volleyball/640/480", storyCount: 450, isLive: true },
  { id: "wrestling", slug: "wrestling", name: "Wrestling", image: "https://picsum.photos/seed/ncaa-wrestling/640/480", storyCount: 380, isLive: true },
  { id: "hockey", slug: "hockey", name: "Hockey", image: "https://picsum.photos/seed/ncaa-hockey/640/480", storyCount: 290, isLive: true },
];

export const NCAA_SPORT_ICON_LINKS: SportIconLink[] = [
  { id: "soccer", slug: "soccer", name: "Soccer" },
  { id: "lacrosse", slug: "lacrosse", name: "Lacrosse" },
  { id: "gymnastics", slug: "gymnastics", name: "Gymnastics" },
  { id: "track-field", slug: "track-field", name: "Track & Field" },
  { id: "swimming-diving", slug: "swimming-diving", name: "Swimming & Diving" },
  { id: "tennis", slug: "tennis", name: "Tennis" },
  { id: "golf", slug: "golf", name: "Golf" },
  { id: "cross-country", slug: "cross-country", name: "Cross Country" },
];

export const NCAA_CHAMPIONSHIPS: Championship[] = [
  { id: "football-championship", slug: "football-championship", name: "Football Championship", logoVariant: "football", daysRemaining: 152, subtitle: "Until Kickoff", accentColor: "#5eb8ff" },
  { id: "march-madness", slug: "march-madness", name: "March Madness", logoVariant: "march-madness", daysRemaining: 23, subtitle: "Until Tip-Off" },
  { id: "final-four", slug: "final-four", name: "Final Four", logoVariant: "final-four", daysRemaining: 45, subtitle: "Until First Four" },
  { id: "college-world-series", slug: "college-world-series", name: "College World Series", logoVariant: "college-world-series", daysRemaining: 67, subtitle: "Until First Pitch" },
  { id: "di-baseball", slug: "di-baseball-championship", name: "DI Baseball Championship", logoVariant: "di-baseball", daysRemaining: 75, subtitle: "Until Championship" },
  { id: "track-field-championships", slug: "track-field-championships", name: "Track & Field Championships", logoVariant: "track-field", daysRemaining: 81, subtitle: "Until Championships" },
  { id: "softball-world-series", slug: "softball-world-series", name: "Softball World Series", logoVariant: "softball", daysRemaining: 97, subtitle: "Until First Pitch" },
  { id: "frozen-four", slug: "frozen-four", name: "Frozen Four", logoVariant: "frozen-four", daysRemaining: 110, subtitle: "Until Championship" },
];

const STORY_BODY = (summary: string) => `${summary}

Coaches, scouts, and fans across the country are watching closely as the storyline develops over the coming weeks. Programs with the depth and discipline to adapt are best positioned to carry this momentum into their next matchup.

The Sports Rivalry will keep tracking every angle of this story as new developments break, including reaction from players, coaching staff, and conference officials.`;

export const NCAA_NEWS_ARTICLES: NcaaNewsArticle[] = [
  {
    id: "story-1",
    slug: "rising-stars-and-new-rivals-define-the-championship-chase",
    title: "Rising Stars and New Rivals Define This Season's Championship Chase",
    summary:
      "As the new season heats up, emerging talent and renewed rivalries are setting the stage for an unforgettable run toward the title.",
    content: STORY_BODY(
      "As the new season heats up, emerging talent and renewed rivalries are setting the stage for an unforgettable run toward the title.",
    ),
    author: "Alex Morgan",
    publishedAt: "2026-05-24T09:00:00.000Z",
    category: "Football",
    image: {
      src: "https://picsum.photos/seed/ncaa-feature-main/1200/800",
      alt: "A college football quarterback pointing downfield during a game",
      width: 1200,
      height: 800,
    },
    featured: true,
  },
  {
    id: "story-2",
    slug: "top-25-takeaways-whos-climbing-the-rankings",
    title: "Top 25 Takeaways: Who's Climbing the Rankings?",
    summary: "Breaking down every riser and faller from this week's top 25 poll.",
    content: STORY_BODY("Breaking down every riser and faller from this week's top 25 poll."),
    author: "Jordan Lee",
    publishedAt: "2026-05-23T14:00:00.000Z",
    category: "Basketball",
    image: {
      src: "https://picsum.photos/seed/ncaa-feature-2/480/320",
      alt: "A college basketball player driving to the basket",
      width: 480,
      height: 320,
    },
    featured: true,
  },
  {
    id: "story-3",
    slug: "mlb-draft-prospects-to-watch-in-college-baseball",
    title: "MLB Draft Prospects to Watch in College Baseball",
    summary: "Scouts are circling these college arms and bats ahead of draft season.",
    content: STORY_BODY("Scouts are circling these college arms and bats ahead of draft season."),
    author: "Chris Vaughn",
    publishedAt: "2026-05-22T14:00:00.000Z",
    category: "Baseball",
    image: {
      src: "https://picsum.photos/seed/ncaa-feature-3/480/320",
      alt: "A college baseball pitcher mid wind-up",
      width: 480,
      height: 320,
    },
    featured: true,
  },
  {
    id: "story-4",
    slug: "name-image-likeness-the-new-era-explained",
    title: "Name, Image, Likeness: The New Era Explained",
    summary: "What every fan needs to know about how NIL is reshaping college sports.",
    content: STORY_BODY("What every fan needs to know about how NIL is reshaping college sports."),
    author: "Taylor Smith",
    publishedAt: "2026-05-21T14:00:00.000Z",
    category: "NIL",
    image: {
      src: "https://picsum.photos/seed/ncaa-feature-4/480/320",
      alt: "A student-athlete signing an autograph for fans",
      width: 480,
      height: 320,
    },
    featured: true,
  },
  {
    id: "story-5",
    slug: "frozen-four-preview-teams-with-a-shot-at-history",
    title: "Frozen Four Preview: Teams With a Shot at History",
    summary: "Four programs, one trophy — here's who has the edge heading into the Frozen Four.",
    content: STORY_BODY(
      "Four programs, one trophy — here's who has the edge heading into the Frozen Four.",
    ),
    author: "Ben Collins",
    publishedAt: "2026-05-20T14:00:00.000Z",
    category: "Hockey",
    image: {
      src: "https://picsum.photos/seed/ncaa-feature-5/480/320",
      alt: "A college hockey goalie making a diving save",
      width: 480,
      height: 320,
    },
    featured: true,
  },
  {
    id: "story-6",
    slug: "conference-realignment-rumors-heat-up-expansion-discussions",
    title: "Conference realignment rumors heat up expansion discussions",
    summary: "Multiple conferences are reportedly exploring new membership as media deals loom.",
    content: STORY_BODY(
      "Multiple conferences are reportedly exploring new membership as media deals loom.",
    ),
    author: "Sam Rivera",
    publishedAt: "2026-07-05T04:00:00.000Z",
    category: "Conferences",
    image: {
      src: "https://picsum.photos/seed/ncaa-news-1/320/240",
      alt: "A conference commissioner speaking at a podium",
      width: 320,
      height: 240,
    },
  },
  {
    id: "story-7",
    slug: "injury-updates-key-players-out-ahead-of-rivalry-weekend",
    title: "Injury updates: Key players out ahead of rivalry weekend",
    summary: "A look at who's questionable, doubtful, and out for the marquee matchups.",
    content: STORY_BODY("A look at who's questionable, doubtful, and out for the marquee matchups."),
    author: "Priya Nair",
    publishedAt: "2026-07-05T02:00:00.000Z",
    category: "Football",
    image: {
      src: "https://picsum.photos/seed/ncaa-news-2/320/240",
      alt: "An athletic trainer checking on a player on the sideline",
      width: 320,
      height: 240,
    },
  },
  {
    id: "story-8",
    slug: "transfer-portal-tracker-top-commitments-of-the-week",
    title: "Transfer portal tracker: Top commitments of the week",
    summary: "Every notable name who entered or committed through the portal this week.",
    content: STORY_BODY("Every notable name who entered or committed through the portal this week."),
    author: "Marcus Webb",
    publishedAt: "2026-07-04T23:00:00.000Z",
    category: "Recruiting",
    image: {
      src: "https://picsum.photos/seed/ncaa-news-3/320/240",
      alt: "A player packing up equipment in a locker room",
      width: 320,
      height: 240,
    },
  },
  {
    id: "story-9",
    slug: "how-coaching-changes-could-impact-the-playoff-picture",
    title: "How coaching changes could impact the playoff picture",
    summary: "New hires and surprise exits are reshaping the path to the postseason.",
    content: STORY_BODY("New hires and surprise exits are reshaping the path to the postseason."),
    author: "Dana Ruiz",
    publishedAt: "2026-07-04T19:00:00.000Z",
    category: "Coaching",
    image: {
      src: "https://picsum.photos/seed/ncaa-news-4/320/240",
      alt: "A head coach directing players from the sideline",
      width: 320,
      height: 240,
    },
  },
  {
    id: "story-10",
    slug: "womens-sports-viewership-hits-record-numbers-in-2026",
    title: "Women's sports viewership hits record numbers in 2026",
    summary: "Ratings across women's basketball, softball, and volleyball are up sharply this year.",
    content: STORY_BODY(
      "Ratings across women's basketball, softball, and volleyball are up sharply this year.",
    ),
    author: "Elena Fischer",
    publishedAt: "2026-07-03T19:00:00.000Z",
    category: "Culture",
    image: {
      src: "https://picsum.photos/seed/ncaa-news-5/320/240",
      alt: "A packed arena during a women's college basketball game",
      width: 320,
      height: 240,
    },
  },
  {
    id: "story-11",
    slug: "balancing-books-and-big-goals",
    title: "Balancing Books and Big Goals",
    summary: "How today's student-athletes juggle a full course load with championship ambitions.",
    content: STORY_BODY(
      "How today's student-athletes juggle a full course load with championship ambitions.",
    ),
    author: "Nina Alvarez",
    publishedAt: "2026-06-18T14:00:00.000Z",
    category: "Student-Athlete Life",
    image: {
      src: "https://picsum.photos/seed/ncaa-spotlight-1/480/320",
      alt: "A student-athlete studying with a backpack and a ball nearby",
      width: 480,
      height: 320,
    },
  },
  {
    id: "story-12",
    slug: "top-recruits-making-big-moves",
    title: "Top Recruits Making Big Moves",
    summary: "The nation's top-ranked recruits are shaking up next year's outlook.",
    content: STORY_BODY("The nation's top-ranked recruits are shaking up next year's outlook."),
    author: "Devon Carter",
    publishedAt: "2026-06-15T14:00:00.000Z",
    category: "Recruiting",
    image: {
      src: "https://picsum.photos/seed/ncaa-spotlight-2/480/320",
      alt: "A top high school recruit signing a letter of intent",
      width: 480,
      height: 320,
    },
  },
  {
    id: "story-13",
    slug: "nil-deals-changing-the-game",
    title: "NIL Deals Changing the Game",
    summary: "Name, image, and likeness money is reshaping recruiting and roster building.",
    content: STORY_BODY(
      "Name, image, and likeness money is reshaping recruiting and roster building.",
    ),
    author: "Taylor Smith",
    publishedAt: "2026-06-10T14:00:00.000Z",
    category: "NIL",
    image: {
      src: "https://picsum.photos/seed/ncaa-spotlight-3/480/320",
      alt: "A student-athlete filming a sponsorship advertisement",
      width: 480,
      height: 320,
    },
  },
  {
    id: "story-14",
    slug: "new-hires-big-expectations",
    title: "New Hires, Big Expectations",
    summary: "A wave of coaching changes brings fresh energy — and pressure — to campus.",
    content: STORY_BODY(
      "A wave of coaching changes brings fresh energy — and pressure — to campus.",
    ),
    author: "Ben Collins",
    publishedAt: "2026-06-05T14:00:00.000Z",
    category: "Coaching",
    image: {
      src: "https://picsum.photos/seed/ncaa-spotlight-4/480/320",
      alt: "A newly hired head coach addressing the media",
      width: 480,
      height: 320,
    },
  },
];

export const NCAA_RANKINGS: RankingGroup[] = [
  {
    id: "football",
    sportSlug: "football",
    sportName: "Football",
    pollLabel: "AP Top 25",
    entries: [
      { rank: 1, team: "Valley State", trend: "flat" },
      { rank: 2, team: "Lakeside University", trend: "up", trendAmount: 1 },
      { rank: 3, team: "Metro State", trend: "down", trendAmount: 1 },
      { rank: 4, team: "Coastal Tech", trend: "up", trendAmount: 2 },
      { rank: 5, team: "Northview University", trend: "flat" },
    ],
  },
  {
    id: "mens-basketball",
    sportSlug: "mens-basketball",
    sportName: "Men's Basketball",
    pollLabel: "AP Top 25",
    entries: [
      { rank: 1, team: "Blue Ridge College", trend: "flat" },
      { rank: 2, team: "Pinecrest University", trend: "up", trendAmount: 1 },
      { rank: 3, team: "Eastwood University", trend: "down", trendAmount: 1 },
      { rank: 4, team: "Ironclad U", trend: "flat" },
      { rank: 5, team: "Highland Institute", trend: "up", trendAmount: 2 },
    ],
  },
  {
    id: "womens-basketball",
    sportSlug: "womens-basketball",
    sportName: "Women's Basketball",
    pollLabel: "AP Top 25",
    entries: [
      { rank: 1, team: "Lakeside University", trend: "flat" },
      { rank: 2, team: "Metro State", trend: "up", trendAmount: 1 },
      { rank: 3, team: "Coastal Tech", trend: "down", trendAmount: 2 },
      { rank: 4, team: "Valley State", trend: "flat" },
      { rank: 5, team: "Northview University", trend: "down", trendAmount: 1 },
    ],
  },
  {
    id: "baseball",
    sportSlug: "baseball",
    sportName: "Baseball",
    pollLabel: "D1Baseball Top 25",
    entries: [
      { rank: 1, team: "Pinecrest University", trend: "flat" },
      { rank: 2, team: "Ironclad U", trend: "up", trendAmount: 1 },
      { rank: 3, team: "Blue Ridge College", trend: "down", trendAmount: 1 },
      { rank: 4, team: "Eastwood University", trend: "flat" },
      { rank: 5, team: "Highland Institute", trend: "up", trendAmount: 1 },
    ],
  },
  {
    id: "softball",
    sportSlug: "softball",
    sportName: "Softball",
    pollLabel: "USA Today Coaches",
    entries: [
      { rank: 1, team: "Metro State", trend: "flat" },
      { rank: 2, team: "Coastal Tech", trend: "down", trendAmount: 1 },
      { rank: 3, team: "Valley State", trend: "up", trendAmount: 2 },
      { rank: 4, team: "Lakeside University", trend: "flat" },
      { rank: 5, team: "Northview University", trend: "down", trendAmount: 1 },
    ],
  },
  {
    id: "wrestling",
    sportSlug: "wrestling",
    sportName: "Wrestling",
    pollLabel: "NWCA Coaches",
    entries: [
      { rank: 1, team: "Ironclad U", trend: "flat" },
      { rank: 2, team: "Highland Institute", trend: "up", trendAmount: 1 },
      { rank: 3, team: "Blue Ridge College", trend: "flat" },
      { rank: 4, team: "Pinecrest University", trend: "down", trendAmount: 2 },
      { rank: 5, team: "Eastwood University", trend: "up", trendAmount: 1 },
    ],
  },
];

export const NCAA_COLLEGES: College[] = [
  { id: "pinecrest", slug: "pinecrest-university", name: "Pinecrest University", logo: "P", accent: "#1e7a45", conference: "acc" },
  { id: "blue-ridge", slug: "blue-ridge-college", name: "Blue Ridge College", logo: "BR", accent: "#1e3a8a", conference: "big-ten" },
  { id: "metro-state", slug: "metro-state-university", name: "Metro State University", logo: "MS", accent: "#0f4c3a", conference: "sec" },
  { id: "lakeside", slug: "lakeside-university", name: "Lakeside University", logo: "LU", accent: "#2c2c54", conference: "big-12" },
  { id: "northview", slug: "northview-university", name: "Northview University", logo: "NV", accent: "#8a5a00", conference: "pac-12" },
  { id: "coastal-tech", slug: "coastal-tech", name: "Coastal Tech", logo: "CT", accent: "#a91d23", conference: "aac" },
  { id: "eastwood", slug: "eastwood-university", name: "Eastwood University", logo: "EU", accent: "#5c2d91", conference: "acc" },
  { id: "ironclad", slug: "ironclad-university", name: "Ironclad U", logo: "IU", accent: "#1a2744", conference: "big-ten" },
  { id: "highland", slug: "highland-institute", name: "Highland Institute", logo: "HI", accent: "#7f1016", conference: "sec" },
  { id: "valley-state", slug: "valley-state", name: "Valley State", logo: "VS", accent: "#003087", conference: "big-12" },
];

const SPOTLIGHT_SLUGS = [
  "balancing-books-and-big-goals",
  "top-recruits-making-big-moves",
  "nil-deals-changing-the-game",
  "new-hires-big-expectations",
];

const SPOTLIGHT_META: Record<string, { ctaLabel: string }> = {
  "balancing-books-and-big-goals": { ctaLabel: "Read More" },
  "top-recruits-making-big-moves": { ctaLabel: "View Recruits" },
  "nil-deals-changing-the-game": { ctaLabel: "Explore Deals" },
  "new-hires-big-expectations": { ctaLabel: "Meet the Staff" },
};

/** Spotlight cards are sourced from the same news dataset (so every card resolves to a real `/ncaa/news/:slug` article) rather than a hand-duplicated list. */
export const NCAA_COLLEGE_SPOTLIGHT_ARTICLES: CollegeSpotlightArticle[] = SPOTLIGHT_SLUGS.map(
  (slug) => {
    const article = NCAA_NEWS_ARTICLES.find((item) => item.slug === slug)!;
    const meta = SPOTLIGHT_META[slug];
    return {
      id: article.id,
      slug: article.slug,
      category: article.category,
      title: article.title,
      summary: article.summary,
      image: article.image,
      href: `/ncaa/news/${article.slug}`,
      ctaLabel: meta?.ctaLabel ?? "Read More",
    };
  },
);

export const NCAA_CONFERENCES: Conference[] = [
  { id: "acc", slug: "acc", name: "Atlantic Coast Conference", shortName: "ACC", accent: "#003087" },
  { id: "big-ten", slug: "big-ten", name: "Big Ten Conference", shortName: "Big Ten", accent: "#0a1e63" },
  { id: "sec", slug: "sec", name: "Southeastern Conference", shortName: "SEC", accent: "#a91d23" },
  { id: "big-12", slug: "big-12", name: "Big 12 Conference", shortName: "Big 12", accent: "#1a1a1a" },
  { id: "pac-12", slug: "pac-12", name: "Pac-12 Conference", shortName: "Pac-12", accent: "#004a7f" },
  { id: "aac", slug: "aac", name: "American Athletic Conference", shortName: "AAC", accent: "#00293f" },
  { id: "c-usa", slug: "c-usa", name: "Conference USA", shortName: "C-USA", accent: "#8a5a00" },
  { id: "maac", slug: "maac", name: "Metro Atlantic Athletic Conference", shortName: "MAAC", accent: "#5c2d91" },
  { id: "mvc", slug: "mvc", name: "Missouri Valley Conference", shortName: "MVC", accent: "#0f4c3a" },
  { id: "wcc", slug: "wcc", name: "West Coast Conference", shortName: "WCC", accent: "#003c5a" },
  { id: "atlantic-10", slug: "atlantic-10", name: "Atlantic 10 Conference", shortName: "Atlantic 10", accent: "#7f1016" },
  { id: "sun-belt", slug: "sun-belt", name: "Sun Belt Conference", shortName: "Sun Belt", accent: "#c25400" },
  { id: "american-east", slug: "american-east", name: "America East Conference", shortName: "America East", accent: "#2c2c54" },
];

export const NCAA_VIDEOS: Video[] = [
  {
    id: "video-1",
    slug: "top-10-plays-of-the-week",
    title: "Top 10 Plays of the Week",
    summary: "The most jaw-dropping moments from across every NCAA sport this week.",
    duration: "6:12",
    thumbnail: {
      src: "https://picsum.photos/seed/ncaa-video-1/640/360",
      alt: "Highlight reel thumbnail of the week's top plays",
      width: 640,
      height: 360,
    },
    href: "/ncaa/videos/top-10-plays-of-the-week",
  },
  {
    id: "video-2",
    slug: "buzzer-beaters-that-stunned-fans",
    title: "Buzzer Beaters That Stunned Fans",
    duration: "4:08",
    summary: "Relive the wildest last-second shots from men's and women's basketball.",
    thumbnail: {
      src: "https://picsum.photos/seed/ncaa-video-2/640/360",
      alt: "A basketball player releasing a last-second shot",
      width: 640,
      height: 360,
    },
    href: "/ncaa/videos/buzzer-beaters-that-stunned-fans",
  },
  {
    id: "video-3",
    slug: "walk-off-wins-you-have-to-see",
    title: "Walk-Off Wins You Have to See",
    duration: "3:45",
    summary: "The most dramatic endings from college baseball diamonds nationwide.",
    thumbnail: {
      src: "https://picsum.photos/seed/ncaa-video-3/640/360",
      alt: "A baseball team celebrating a walk-off hit at home plate",
      width: 640,
      height: 360,
    },
    href: "/ncaa/videos/walk-off-wins-you-have-to-see",
  },
  {
    id: "video-4",
    slug: "top-dunks-of-the-month",
    title: "Top Dunks of the Month",
    duration: "5:20",
    summary: "Poster slams and high-flying finishes from the past month of hoops.",
    thumbnail: {
      src: "https://picsum.photos/seed/ncaa-video-4/640/360",
      alt: "A basketball player dunking over a defender",
      width: 640,
      height: 360,
    },
    href: "/ncaa/videos/top-dunks-of-the-month",
  },
  {
    id: "video-5",
    slug: "goalie-saves-that-defied-physics",
    title: "Goalie Saves That Defied Physics",
    duration: "2:58",
    summary: "Incredible stops from hockey goalies that left crowds speechless.",
    thumbnail: {
      src: "https://picsum.photos/seed/ncaa-video-5/640/360",
      alt: "A hockey goalie making a diving glove save",
      width: 640,
      height: 360,
    },
    href: "/ncaa/videos/goalie-saves-that-defied-physics",
  },
];
