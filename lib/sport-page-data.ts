import type { SportPageData, TeamIdentity } from "@/lib/types";

function team(
  name: string,
  shortName: string,
  primaryColor: string,
  accentColor: string,
  textColor = "#ffffff",
): TeamIdentity {
  return { name, shortName, primaryColor, accentColor, textColor };
}

function video(id: string, title: string, duration: string, featured = false) {
  return {
    title,
    duration,
    featured,
    image: {
      src: `https://images.unsplash.com/photo-${id}?w=1200&q=70&auto=format&fit=crop`,
      alt: title,
      width: 1200,
      height: 675,
    },
  };
}

function img(id: string, alt: string, width = 1600) {
  return {
    src: `https://images.unsplash.com/photo-${id}?w=${width}&q=72&auto=format&fit=crop`,
    alt,
    width,
    height: Math.round((width * 9) / 16),
  };
}

function opinion(id: string, title: string, author: string, category: string) {
  return {
    title,
    author,
    category,
    image: {
      src: `https://images.unsplash.com/photo-${id}?w=480&q=70&auto=format&fit=crop`,
      alt: title,
      width: 480,
      height: 320,
    },
  };
}

const basketball: SportPageData = {
  navConfig: {
    mark: "SR",
    wordmark: "Sports Rivalry",
    tabs: [
      { label: "NBA", href: "/basketball", active: true },
      { label: "NCAA", href: "/basketball" },
      { label: "WNBA", href: "/basketball" },
      { label: "International", href: "/basketball" },
      { label: "Teams", href: "/basketball" },
      { label: "Rankings", href: "/basketball" },
      { label: "Schedule", href: "/basketball" },
      { label: "Standings", href: "/basketball" },
      { label: "Trade Center", href: "/basketball" },
      { label: "Draft", href: "/basketball" },
      { label: "Fantasy", href: "/basketball" },
      { label: "Videos", href: "/basketball" },
      { label: "Podcasts", href: "/basketball" },
    ],
  },
  hero: {
    pillPrimary: "Breaking News",
    pillSecondary: "NBA Playoffs",
    headline: "Thunder Take Control in Game 4 Thriller",
    deck: "Shai Gilgeous-Alexander drops 36 as Oklahoma City takes a 3-1 lead over the Nuggets behind a massive fourth quarter run at Paycom Center.",
    author: "Jason Whitlock",
    date: "May 13, 2025",
    readTime: 6,
    href: "/basketball",
    image: {
      src: "/images/sport/basketball-arena.png",
      alt: "Basketball arena under stadium lights",
      width: 736,
      height: 736,
    },
  },
  liveGame: {
    status: "LIVE",
    isLive: true,
    clock: "Q4 2:36",
    away: { ...team("Denver Nuggets", "DEN", "#0e2240", "#fec524"), score: 102, isWinner: false },
    home: { ...team("Oklahoma City Thunder", "OKC", "#007ac1", "#ef3b24"), score: 118 },
    note: "OKC leads series 3-1",
  },
  playerSpotlight: {
    player: "Shai Gilgeous-Alexander",
    meta: "OKC · Guard",
    monogram: "SGA",
    stats: [
      { label: "PTS", value: "36" },
      { label: "REB", value: "7" },
      { label: "AST", value: "8" },
      { label: "STL", value: "3" },
    ],
    footnote: "Tonight vs DEN",
  },
  scoreboardLabel: "Around the League",
  scoreboard: [
    {
      status: "FINAL",
      away: { ...team("Boston Celtics", "BOS", "#007a33", "#ffffff"), score: 112 },
      home: { ...team("Cleveland Cavaliers", "CLE", "#860038", "#fdbb30"), score: 105, isWinner: false },
    },
    {
      status: "FINAL",
      away: { ...team("New York Knicks", "NYK", "#0f4c81", "#f97316"), score: 121 },
      home: { ...team("Indiana Pacers", "IND", "#002d62", "#fdbb30"), score: 117 },
    },
    {
      status: "FINAL",
      away: { ...team("Golden State Warriors", "GSW", "#1d428a", "#ffc72c"), score: 98 },
      home: { ...team("Los Angeles Lakers", "LAL", "#552583", "#fdb927"), score: 90 },
    },
    {
      status: "10:30 PM ET",
      away: team("Miami Heat", "MIA", "#98002e", "#f9a01b"),
      home: team("Phoenix Suns", "PHX", "#1d1160", "#e56020"),
      detail: "TNT",
    },
    {
      status: "10:30 PM ET",
      away: team("Dallas Mavericks", "DAL", "#00538c", "#b8c4ca"),
      home: team("Sacramento Kings", "SAC", "#5a2d81", "#63727a"),
      detail: "ESPN",
    },
  ],
  teamHub: {
    tabs: ["NBA", "NCAA (M)", "NCAA (W)", "WNBA"],
    teams: [
      {
        team: team("Boston Celtics", "BOS", "#007a33", "#ffffff"),
        meta: "64-18 · 1st East",
        form: ["W", "W", "L", "W", "W"],
      },
      {
        team: team("Oklahoma City Thunder", "OKC", "#007ac1", "#ef3b24"),
        meta: "57-25 · 1st West",
        form: ["W", "W", "W", "W", "L"],
      },
      {
        team: team("Cleveland Cavaliers", "CLE", "#860038", "#fdbb30"),
        meta: "60-22 · 2nd East",
        form: ["W", "L", "W", "W", "W"],
      },
      {
        team: team("Minnesota Timberwolves", "MIN", "#0c2340", "#78be20"),
        meta: "56-26 · 3rd West",
        form: ["L", "W", "W", "L", "W"],
      },
      {
        team: team("New York Knicks", "NYK", "#0f4c81", "#f97316"),
        meta: "51-31 · 3rd East",
        form: ["W", "W", "L", "L", "W"],
      },
      {
        team: team("Denver Nuggets", "DEN", "#0e2240", "#fec524"),
        meta: "57-25 · 2nd West",
        form: ["L", "W", "W", "W", "L"],
      },
    ],
  },
  matchupsLabel: "Featured Matchups",
  matchups: [
    {
      status: "LIVE",
      isLive: true,
      clock: "Q4 2:38",
      teams: [
        { ...team("Denver Nuggets", "DEN", "#0e2240", "#fec524"), score: 102 },
        { ...team("Oklahoma City Thunder", "OKC", "#007ac1", "#ef3b24"), score: 118 },
      ],
      seriesNote: "Game 4 · OKC Leads 3-1",
      venue: "Paycom Center",
    },
    {
      status: "7:30 PM ET",
      teams: [
        team("Los Angeles Lakers", "LAL", "#552583", "#fdb927"),
        team("Dallas Mavericks", "DAL", "#00538c", "#b8c4ca"),
      ],
      venue: "Crypto.com Arena",
      network: "TNT",
      spread: "LAL -5.5",
      overUnder: "O/U 228.5",
    },
    {
      status: "10:00 PM ET",
      teams: [
        team("New York Knicks", "NYK", "#0f4c81", "#f97316"),
        team("Phoenix Suns", "PHX", "#1d1160", "#e56020"),
      ],
      venue: "Footprint Center",
      network: "TNT",
      spread: "NYK -2.5",
      overUnder: "O/U 221.0",
    },
  ],
  rankingsLabel: "Power Rankings",
  rankingsColumns: ["OFF RTG", "DEF RTG"],
  rankings: [
    { rank: 1, team: team("Boston Celtics", "BOS", "#007a33", "#ffffff"), record: "64-18", trend: "flat", trendLabel: "—", statA: "119.0", statB: "108.6" },
    { rank: 2, team: team("Oklahoma City Thunder", "OKC", "#007ac1", "#ef3b24"), record: "57-25", trend: "up", trendLabel: "+2", statA: "117.8", statB: "110.2" },
    { rank: 3, team: team("Cleveland Cavaliers", "CLE", "#860038", "#fdbb30"), record: "60-22", trend: "down", trendLabel: "-1", statA: "118.2", statB: "111.8" },
    { rank: 4, team: team("Minnesota Timberwolves", "MIN", "#0c2340", "#78be20"), record: "56-26", trend: "up", trendLabel: "+1", statA: "116.7", statB: "109.1" },
    { rank: 5, team: team("New York Knicks", "NYK", "#0f4c81", "#f97316"), record: "51-31", trend: "down", trendLabel: "-2", statA: "117.3", statB: "112.9" },
  ],
  analyticsLabel: "Basketball Analytics",
  statLeaders: [
    { category: "Points", player: "L. Doncic", monogram: "LD", value: "33.9", team: "DAL", slug: "luka-doncic" },
    { category: "Rebounds", player: "D. Sabonis", monogram: "DS", value: "12.4", team: "SAC", slug: "domantas-sabonis" },
    { category: "Assists", player: "N. Jokic", monogram: "NJ", value: "9.8", team: "DEN", slug: "nikola-jokic" },
    { category: "Steals", player: "S. Gilgeous-Alexander", monogram: "SGA", value: "2.1", team: "OKC", slug: "shai-gilgeous-alexander" },
    { category: "Blocks", player: "V. Wembanyama", monogram: "VW", value: "3.6", team: "SAS", slug: "victor-wembanyama" },
    { category: "3P%", player: "S. Curry", monogram: "SC", value: "43.7%", team: "GSW", slug: "stephen-curry" },
    { category: "PER", player: "N. Jokic", monogram: "NJ", value: "32.1", team: "DEN", slug: "nikola-jokic" },
  ],
  videoHighlights: [
    video("1546519638-68e109498ffc", "SGA explodes for 36 in Game 4 win", "2:14", true),
    video("1574629810360-7efbbe195018", "Celtics close out Cavaliers in Game 5", "1:48"),
    video("1504450758481-7338eba7524a", "Top 10 plays of the night", "3:02"),
  ],
  opinions: [
    opinion(
      "1546519638-68e109498ffc",
      "Why the Pacers' offense is the NBA's most efficient",
      "Tessa Cole",
      "Film Room",
    ),
    opinion(
      "1579952363873-27f3bade9f55",
      "2025 NBA Draft big board: the 30 prospects ranked",
      "Tessa Cole",
      "Draft Analysis",
    ),
    opinion(
      "1551958219-acbc608c6377",
      "The evolution of the point guard: from magic to modern day",
      "Selena Smith",
      "Long Read",
    ),
  ],
  newsletter: {
    heading: "Get the best of basketball delivered to your inbox",
    subheading: "Expert analysis, rankings, and news around the world.",
  },
};

const mlb: SportPageData = {
  navConfig: {
    mark: "SR",
    wordmark: "Sports Rivalry",
    tabs: [
      { label: "MLB", href: "/mlb", active: true },
      { label: "AL", href: "/mlb" },
      { label: "NL", href: "/mlb" },
      { label: "Teams", href: "/mlb" },
      { label: "Standings", href: "/mlb" },
      { label: "Schedule", href: "/mlb" },
      { label: "Stats", href: "/mlb" },
      { label: "Trade Center", href: "/mlb" },
      { label: "Draft", href: "/mlb" },
      { label: "Fantasy", href: "/mlb" },
      { label: "Videos", href: "/mlb" },
      { label: "Podcasts", href: "/mlb" },
    ],
  },
  hero: {
    pillPrimary: "Breaking News",
    pillSecondary: "Pennant Race",
    headline: "Red Sox Walk Off Yankees in Ninth-Inning Classic",
    deck: "Boston stuns New York with a two-run rally in the bottom of the ninth to stretch their AL East lead to two games at Fenway Park.",
    author: "Miles Donovan",
    date: "Jun 21, 2026",
    readTime: 5,
    href: "/mlb",
    image: img("1508344928928-7165b67de128", "Baseball stadium under the lights"),
  },
  liveGame: {
    status: "LIVE",
    isLive: true,
    clock: "Bot 8th",
    away: { ...team("New York Yankees", "NYY", "#132448", "#e5e7eb"), score: 4 },
    home: { ...team("Boston Red Sox", "BOS", "#bd3039", "#0c2340"), score: 5 },
    note: "BOS leads AL East by 2",
  },
  playerSpotlight: {
    player: "Aaron Judge",
    meta: "NYY · RF",
    monogram: "AJ",
    stats: [
      { label: "AB", value: "4" },
      { label: "H", value: "3" },
      { label: "HR", value: "2" },
      { label: "RBI", value: "5" },
    ],
    footnote: "Tonight vs BOS",
  },
  scoreboardLabel: "Around the League",
  scoreboard: [
    { status: "FINAL", away: { ...team("Los Angeles Dodgers", "LAD", "#005a9c", "#ffffff"), score: 6 }, home: { ...team("San Diego Padres", "SD", "#2f241d", "#ffc425"), score: 3 } },
    { status: "FINAL", away: { ...team("Atlanta Braves", "ATL", "#13274f", "#ce1141"), score: 2 }, home: { ...team("New York Mets", "NYM", "#002d72", "#f97316"), score: 5 } },
    { status: "FINAL", away: { ...team("Houston Astros", "HOU", "#002d62", "#eb6e1f"), score: 7 }, home: { ...team("Texas Rangers", "TEX", "#003278", "#c0111f"), score: 4 } },
    { status: "8:10 PM ET", away: team("Chicago Cubs", "CHC", "#0e3386", "#cc3433"), home: team("St. Louis Cardinals", "STL", "#c41e3a", "#0c2340"), detail: "FS1" },
    { status: "9:40 PM ET", away: team("Seattle Mariners", "SEA", "#0c2c56", "#005c5c"), home: team("Los Angeles Angels", "LAA", "#ba0021", "#003263"), detail: "MLBN" },
  ],
  teamHub: {
    tabs: ["AL East", "AL Central", "AL West", "NL East"],
    teams: [
      { team: team("Boston Red Sox", "BOS", "#bd3039", "#0c2340"), meta: "58-39 · 1st AL East", form: ["W", "W", "L", "W", "W"] },
      { team: team("New York Yankees", "NYY", "#132448", "#e5e7eb"), meta: "56-41 · 2nd AL East", form: ["L", "W", "W", "L", "W"] },
      { team: team("Los Angeles Dodgers", "LAD", "#005a9c", "#ffffff"), meta: "61-36 · 1st NL West", form: ["W", "W", "W", "L", "W"] },
      { team: team("Atlanta Braves", "ATL", "#13274f", "#ce1141"), meta: "57-40 · 1st NL East", form: ["W", "L", "W", "W", "L"] },
      { team: team("Houston Astros", "HOU", "#002d62", "#eb6e1f"), meta: "55-42 · 1st AL West", form: ["W", "W", "L", "W", "L"] },
      { team: team("Baltimore Orioles", "BAL", "#df4601", "#000000"), meta: "54-43 · 3rd AL East", form: ["L", "W", "L", "W", "W"] },
    ],
  },
  matchupsLabel: "Featured Matchups",
  matchups: [
    {
      status: "LIVE",
      isLive: true,
      clock: "Bot 8th",
      teams: [
        { ...team("New York Yankees", "NYY", "#132448", "#e5e7eb"), score: 4 },
        { ...team("Boston Red Sox", "BOS", "#bd3039", "#0c2340"), score: 5 },
      ],
      venue: "Fenway Park",
      network: "ESPN",
    },
    {
      status: "8:10 PM ET",
      teams: [
        team("Los Angeles Dodgers", "LAD", "#005a9c", "#ffffff"),
        team("San Francisco Giants", "SF", "#27251f", "#fd5a1e"),
      ],
      venue: "Oracle Park",
      network: "FOX",
      spread: "LAD -1.5",
      overUnder: "O/U 8.5",
    },
    {
      status: "9:40 PM ET",
      teams: [
        team("New York Mets", "NYM", "#002d72", "#f97316"),
        team("Arizona D-backs", "ARI", "#a71930", "#e3d4ad"),
      ],
      venue: "Chase Field",
      network: "FS1",
      spread: "NYM -2.5",
      overUnder: "O/U 9.0",
    },
  ],
  rankingsLabel: "Power Rankings",
  rankingsColumns: ["RUN DIFF", "WIN%"],
  rankings: [
    { rank: 1, team: team("Los Angeles Dodgers", "LAD", "#005a9c", "#ffffff"), record: "61-36", trend: "flat", trendLabel: "—", statA: "+128", statB: ".629" },
    { rank: 2, team: team("Boston Red Sox", "BOS", "#bd3039", "#0c2340"), record: "58-39", trend: "up", trendLabel: "+3", statA: "+96", statB: ".598" },
    { rank: 3, team: team("Atlanta Braves", "ATL", "#13274f", "#ce1141"), record: "57-40", trend: "down", trendLabel: "-1", statA: "+88", statB: ".588" },
    { rank: 4, team: team("New York Yankees", "NYY", "#132448", "#e5e7eb"), record: "56-41", trend: "up", trendLabel: "+1", statA: "+74", statB: ".577" },
    { rank: 5, team: team("Houston Astros", "HOU", "#002d62", "#eb6e1f"), record: "55-42", trend: "down", trendLabel: "-2", statA: "+61", statB: ".567" },
  ],
  analyticsLabel: "Baseball Analytics",
  statLeaders: [
    { category: "AVG", player: "L. Arraez", monogram: "LA", value: ".342", team: "SD", slug: "luis-arraez" },
    { category: "HR", player: "A. Judge", monogram: "AJ", value: "41", team: "NYY", slug: "aaron-judge" },
    { category: "RBI", player: "R. Devers", monogram: "RD", value: "98", team: "BOS", slug: "rafael-devers" },
    { category: "OPS", player: "S. Ohtani", monogram: "SO", value: "1.044", team: "LAD", slug: "shohei-ohtani" },
    { category: "SB", player: "E. De La Cruz", monogram: "ED", value: "52", team: "CIN", slug: "elly-de-la-cruz" },
    { category: "ERA", player: "T. Skubal", monogram: "TS", value: "2.18", team: "DET", slug: "tarik-skubal" },
    { category: "WAR", player: "A. Judge", monogram: "AJ", value: "8.4", team: "NYY", slug: "aaron-judge" },
  ],
  videoHighlights: [
    video("1508344928928-7165b67de128", "Judge launches two homers in Fenway thriller", "2:05", true),
    video("1471295253337-3ceaaedca402", "Walk-off wins from around the league", "1:52"),
    video("1566577739112-5180d4bf9390", "Top defensive plays of the week", "2:40"),
  ],
  opinions: [
    opinion(
      "1508344928928-7165b67de128",
      "Why the Dodgers' rotation is built for October",
      "Miles Donovan",
      "Film Room",
    ),
    opinion(
      "1471295253337-3ceaaedca402",
      "2026 trade deadline: ten names that could move",
      "Miles Donovan",
      "Trade Desk",
    ),
    opinion(
      "1566577739112-5180d4bf9390",
      "The case for a shift back to small-ball baseball",
      "Selena Smith",
      "Long Read",
    ),
  ],
  newsletter: {
    heading: "Get the best of baseball delivered to your inbox",
    subheading: "Standings, trades, and pennant-race analysis every morning.",
  },
};

const golf: SportPageData = {
  navConfig: {
    mark: "SR",
    wordmark: "Sports Rivalry",
    tabs: [
      { label: "PGA Tour", href: "/golf", active: true },
      { label: "LPGA", href: "/golf" },
      { label: "LIV", href: "/golf" },
      { label: "Players", href: "/golf" },
      { label: "Leaderboard", href: "/golf" },
      { label: "Schedule", href: "/golf" },
      { label: "Rankings", href: "/golf" },
      { label: "FedExCup", href: "/golf" },
      { label: "Majors", href: "/golf" },
      { label: "Videos", href: "/golf" },
      { label: "Podcasts", href: "/golf" },
    ],
  },
  hero: {
    pillPrimary: "Breaking News",
    pillSecondary: "U.S. Open",
    headline: "Scheffler Edges McIlroy Into the Final Round",
    deck: "Scottie Scheffler carries a one-shot lead over Rory McIlroy into Sunday at the U.S. Open as the rivalry tightens around control and nerve.",
    author: "Reese Mercer",
    date: "Jun 15, 2026",
    readTime: 5,
    href: "/golf",
    image: img("1587174486073-ae5e5cff23aa", "Golf course fairway at sunset"),
  },
  liveGame: {
    status: "LIVE · R4",
    isLive: true,
    clock: "Thru 14",
    away: { ...team("Scottie Scheffler", "SS", "#14532d", "#ffffff"), score: -8 },
    home: { ...team("Rory McIlroy", "RM", "#0a4a8a", "#d9f99d"), score: -7 },
    note: "Scheffler leads by 1",
  },
  playerSpotlight: {
    player: "Scottie Scheffler",
    meta: "USA · R4 leader",
    monogram: "SS",
    stats: [
      { label: "TODAY", value: "-3" },
      { label: "TOT", value: "-8" },
      { label: "THRU", value: "14" },
      { label: "FIR%", value: "86" },
    ],
    footnote: "Round 4 · U.S. Open",
  },
  scoreboardLabel: "On The Leaderboard",
  scoreboard: [
    { status: "T1", away: { ...team("Scottie Scheffler", "SS", "#14532d", "#ffffff"), score: -8 }, home: { ...team("Thru", "14", "#1c1f27", "#9aa0aa"), score: undefined }, detail: "-8" },
    { status: "2", away: { ...team("Rory McIlroy", "RM", "#0a4a8a", "#d9f99d"), score: -7 }, home: { ...team("Thru", "15", "#1c1f27", "#9aa0aa"), score: undefined }, detail: "-7" },
    { status: "T3", away: { ...team("Xander Schauffele", "XS", "#7c2d12", "#ffedd5"), score: -5 }, home: { ...team("Thru", "13", "#1c1f27", "#9aa0aa"), score: undefined }, detail: "-5" },
    { status: "T3", away: { ...team("Ludvig Aberg", "LA", "#335c1e", "#d9f99d"), score: -5 }, home: { ...team("Thru", "16", "#1c1f27", "#9aa0aa"), score: undefined }, detail: "-5" },
    { status: "5", away: { ...team("Collin Morikawa", "CM", "#991b1b", "#ffffff"), score: -4 }, home: { ...team("Thru", "12", "#1c1f27", "#9aa0aa"), score: undefined }, detail: "-4" },
  ],
  teamHub: {
    tabs: ["PGA Tour", "LPGA", "LIV", "DP World"],
    teams: [
      { team: team("Scottie Scheffler", "SS", "#14532d", "#ffffff"), meta: "World No. 1", form: ["W", "W", "W", "L", "W"] },
      { team: team("Rory McIlroy", "RM", "#0a4a8a", "#d9f99d"), meta: "World No. 2", form: ["W", "L", "W", "W", "L"] },
      { team: team("Xander Schauffele", "XS", "#7c2d12", "#ffedd5"), meta: "World No. 3", form: ["L", "W", "W", "W", "W"] },
      { team: team("Ludvig Aberg", "LA", "#335c1e", "#d9f99d"), meta: "World No. 5", form: ["W", "W", "L", "W", "W"] },
      { team: team("Nelly Korda", "NK", "#be185d", "#ffffff"), meta: "LPGA No. 1", form: ["W", "W", "W", "W", "L"] },
      { team: team("Collin Morikawa", "CM", "#991b1b", "#ffffff"), meta: "World No. 4", form: ["W", "L", "L", "W", "W"] },
    ],
  },
  matchupsLabel: "Featured Groups",
  matchups: [
    {
      status: "LIVE",
      isLive: true,
      clock: "Thru 14",
      teams: [
        { ...team("Scottie Scheffler", "SS", "#14532d", "#ffffff"), score: -8 },
        { ...team("Rory McIlroy", "RM", "#0a4a8a", "#d9f99d"), score: -7 },
      ],
      seriesNote: "Final pairing · Hole 14",
      venue: "Pinehurst No. 2",
    },
    {
      status: "2:40 PM",
      teams: [
        team("Xander Schauffele", "XS", "#7c2d12", "#ffedd5"),
        team("Ludvig Aberg", "LA", "#335c1e", "#d9f99d"),
      ],
      venue: "Tee 1",
      network: "NBC",
    },
    {
      status: "2:28 PM",
      teams: [
        team("Collin Morikawa", "CM", "#991b1b", "#ffffff"),
        team("Viktor Hovland", "VH", "#1d4ed8", "#ffffff"),
      ],
      venue: "Tee 1",
      network: "NBC",
    },
  ],
  rankingsLabel: "World Rankings",
  rankingsColumns: ["AVG PTS", "EVENTS"],
  rankings: [
    { rank: 1, team: team("Scottie Scheffler", "SS", "#14532d", "#ffffff"), record: "USA", trend: "flat", trendLabel: "—", statA: "13.42", statB: "21" },
    { rank: 2, team: team("Rory McIlroy", "RM", "#0a4a8a", "#d9f99d"), record: "NIR", trend: "up", trendLabel: "+1", statA: "8.91", statB: "19" },
    { rank: 3, team: team("Xander Schauffele", "XS", "#7c2d12", "#ffedd5"), record: "USA", trend: "down", trendLabel: "-1", statA: "7.65", statB: "20" },
    { rank: 4, team: team("Collin Morikawa", "CM", "#991b1b", "#ffffff"), record: "USA", trend: "flat", trendLabel: "—", statA: "6.88", statB: "22" },
    { rank: 5, team: team("Ludvig Aberg", "LA", "#335c1e", "#d9f99d"), record: "SWE", trend: "up", trendLabel: "+2", statA: "6.12", statB: "18" },
  ],
  analyticsLabel: "Golf Analytics",
  statLeaders: [
    { category: "SG: Total", player: "S. Scheffler", monogram: "SS", value: "2.81", team: "USA" },
    { category: "Driving", player: "R. McIlroy", monogram: "RM", value: "326.4", team: "NIR" },
    { category: "GIR%", player: "C. Morikawa", monogram: "CM", value: "74.1", team: "USA" },
    { category: "Putting", player: "D. Thompson", monogram: "DT", value: "+0.92", team: "USA" },
    { category: "Scoring", player: "S. Scheffler", monogram: "SS", value: "68.4", team: "USA" },
    { category: "Birdies", player: "L. Aberg", monogram: "LA", value: "4.9", team: "SWE" },
    { category: "FedExCup", player: "S. Scheffler", monogram: "SS", value: "3,940", team: "USA" },
  ],
  videoHighlights: [
    video("1535131749006-b7f58c99034b", "Scheffler's clutch eagle on the 13th", "1:36", true),
    video("1587174486073-ae5e5cff23aa", "Best shots from Sunday at the U.S. Open", "2:22"),
    video("1592919505780-303950717480", "How Rory rebuilt his short game", "3:10"),
  ],
  opinions: [
    opinion(
      "1535131749006-b7f58c99034b",
      "Why Scheffler's consistency is rewriting the record books",
      "Reese Mercer",
      "Analysis",
    ),
    opinion(
      "1587174486073-ae5e5cff23aa",
      "LIV vs PGA: where the truce actually stands",
      "Reese Mercer",
      "Long Read",
    ),
    opinion(
      "1592919505780-303950717480",
      "The next generation of major contenders",
      "Selena Smith",
      "Draft Watch",
    ),
  ],
  newsletter: {
    heading: "Get the best of golf delivered to your inbox",
    subheading: "Leaderboards, rankings, and major-week analysis.",
  },
};

const nascar: SportPageData = {
  navConfig: {
    mark: "SR",
    wordmark: "Sports Rivalry",
    tabs: [
      { label: "Cup Series", href: "/nascar", active: true },
      { label: "Xfinity", href: "/nascar" },
      { label: "Trucks", href: "/nascar" },
      { label: "Drivers", href: "/nascar" },
      { label: "Standings", href: "/nascar" },
      { label: "Schedule", href: "/nascar" },
      { label: "Results", href: "/nascar" },
      { label: "Teams", href: "/nascar" },
      { label: "Playoffs", href: "/nascar" },
      { label: "Videos", href: "/nascar" },
      { label: "Podcasts", href: "/nascar" },
    ],
  },
  hero: {
    pillPrimary: "Breaking News",
    pillSecondary: "Cup Series",
    headline: "Larson Holds Off Elliott in Bristol Showdown",
    deck: "Kyle Larson leads a Hendrick charge at Bristol as Chase Elliott shadows him through the final runs of a playoff-defining night.",
    author: "Chase Holloway",
    date: "Jun 14, 2026",
    readTime: 4,
    href: "/nascar",
    image: img("1530549387789-4c1017266635", "Stock cars racing on the speedway"),
  },
  liveGame: {
    status: "LIVE · Lap 188",
    isLive: true,
    clock: "of 267",
    away: { ...team("Kyle Larson", "5", "#111827", "#60a5fa"), score: 1 },
    home: { ...team("Chase Elliott", "9", "#1d4ed8", "#ffffff"), score: 2 },
    note: "Larson leads by 1.4s",
  },
  playerSpotlight: {
    player: "Kyle Larson",
    meta: "Hendrick · No. 5",
    monogram: "KL",
    stats: [
      { label: "POS", value: "1" },
      { label: "LED", value: "94" },
      { label: "BEST", value: "28.4" },
      { label: "PTS", value: "44" },
    ],
    footnote: "Today at Bristol",
  },
  scoreboardLabel: "Running Order",
  scoreboard: [
    { status: "P1", away: { ...team("Kyle Larson", "5", "#111827", "#60a5fa"), score: undefined }, home: { ...team("Laps Led", "94", "#1c1f27", "#9aa0aa"), score: undefined }, detail: "Leader" },
    { status: "P2", away: { ...team("Chase Elliott", "9", "#1d4ed8", "#ffffff"), score: undefined }, home: { ...team("Gap", "1.4s", "#1c1f27", "#9aa0aa"), score: undefined }, detail: "-1.4s" },
    { status: "P3", away: { ...team("Denny Hamlin", "11", "#991b1b", "#ffffff"), score: undefined }, home: { ...team("Gap", "3.1s", "#1c1f27", "#9aa0aa"), score: undefined }, detail: "-3.1s" },
    { status: "P4", away: { ...team("Ryan Blaney", "12", "#1d4ed8", "#ffffff"), score: undefined }, home: { ...team("Gap", "4.8s", "#1c1f27", "#9aa0aa"), score: undefined }, detail: "-4.8s" },
    { status: "P5", away: { ...team("Christopher Bell", "20", "#facc15", "#111111", "#111111"), score: undefined }, home: { ...team("Gap", "6.2s", "#1c1f27", "#9aa0aa"), score: undefined }, detail: "-6.2s" },
  ],
  teamHub: {
    tabs: ["Cup Series", "Xfinity", "Trucks", "Teams"],
    teams: [
      { team: team("Kyle Larson", "5", "#111827", "#60a5fa"), meta: "1st · 612 pts", form: ["W", "W", "L", "W", "W"] },
      { team: team("Chase Elliott", "9", "#1d4ed8", "#ffffff"), meta: "2nd · 598 pts", form: ["W", "L", "W", "W", "L"] },
      { team: team("Denny Hamlin", "11", "#991b1b", "#ffffff"), meta: "3rd · 571 pts", form: ["L", "W", "W", "L", "W"] },
      { team: team("Ryan Blaney", "12", "#1d4ed8", "#ffffff"), meta: "4th · 560 pts", form: ["W", "W", "L", "W", "L"] },
      { team: team("Christopher Bell", "20", "#facc15", "#111111", "#111111"), meta: "5th · 549 pts", form: ["L", "W", "W", "W", "W"] },
      { team: team("William Byron", "24", "#0ea5e9", "#ffffff"), meta: "6th · 538 pts", form: ["W", "L", "L", "W", "W"] },
    ],
  },
  matchupsLabel: "Upcoming Races",
  matchups: [
    {
      status: "LIVE",
      isLive: true,
      clock: "Lap 188",
      teams: [
        { ...team("Kyle Larson", "5", "#111827", "#60a5fa"), score: 1 },
        { ...team("Chase Elliott", "9", "#1d4ed8", "#ffffff"), score: 2 },
      ],
      seriesNote: "Bristol Night Race",
      venue: "Bristol Motor Speedway",
    },
    {
      status: "SUN 3:00",
      teams: [
        team("Sonoma Raceway", "SON", "#166534", "#ffffff"),
        team("Road Course", "RC", "#1c1f27", "#9aa0aa"),
      ],
      venue: "Sonoma Raceway",
      network: "FOX",
    },
    {
      status: "SUN 2:30",
      teams: [
        team("Pocono Raceway", "POC", "#2563eb", "#ffffff"),
        team("The Tricky Triangle", "TT", "#1c1f27", "#9aa0aa"),
      ],
      venue: "Pocono Raceway",
      network: "USA",
    },
  ],
  rankingsLabel: "Cup Standings",
  rankingsColumns: ["WINS", "PLAYOFF"],
  rankings: [
    { rank: 1, team: team("Kyle Larson", "5", "#111827", "#60a5fa"), record: "612", trend: "flat", trendLabel: "—", statA: "4", statB: "+62" },
    { rank: 2, team: team("Chase Elliott", "9", "#1d4ed8", "#ffffff"), record: "598", trend: "up", trendLabel: "+1", statA: "2", statB: "+48" },
    { rank: 3, team: team("Denny Hamlin", "11", "#991b1b", "#ffffff"), record: "571", trend: "down", trendLabel: "-1", statA: "3", statB: "+33" },
    { rank: 4, team: team("Ryan Blaney", "12", "#1d4ed8", "#ffffff"), record: "560", trend: "up", trendLabel: "+2", statA: "2", statB: "+21" },
    { rank: 5, team: team("Christopher Bell", "20", "#facc15", "#111111", "#111111"), record: "549", trend: "down", trendLabel: "-1", statA: "1", statB: "+12" },
  ],
  analyticsLabel: "NASCAR Analytics",
  statLeaders: [
    { category: "Wins", player: "K. Larson", monogram: "KL", value: "4", team: "HMS" },
    { category: "Top 5s", player: "C. Elliott", monogram: "CE", value: "11", team: "HMS" },
    { category: "Top 10s", player: "D. Hamlin", monogram: "DH", value: "15", team: "JGR" },
    { category: "Laps Led", player: "K. Larson", monogram: "KL", value: "842", team: "HMS" },
    { category: "Avg Finish", player: "R. Blaney", monogram: "RB", value: "9.8", team: "PEN" },
    { category: "Stage Wins", player: "C. Bell", monogram: "CB", value: "7", team: "JGR" },
    { category: "Poles", player: "W. Byron", monogram: "WB", value: "3", team: "HMS" },
  ],
  videoHighlights: [
    video("1530549387789-4c1017266635", "Larson holds off Elliott in Bristol thriller", "2:11", true),
    video("1552519507-da3b142c6e3d", "Best overtakes from the weekend", "1:58"),
    video("1583121274602-3e2820c69888", "Pit-road strategy that won the race", "2:46"),
  ],
  opinions: [
    opinion(
      "1530549387789-4c1017266635",
      "Why Hendrick's pit crews keep winning the race off pit road",
      "Chase Holloway",
      "Film Room",
    ),
    opinion(
      "1552519507-da3b142c6e3d",
      "Playoff picture: who's locked in and who's sweating",
      "Chase Holloway",
      "Analysis",
    ),
    opinion(
      "1583121274602-3e2820c69888",
      "The aero package debate that won't go away",
      "Selena Smith",
      "Long Read",
    ),
  ],
  newsletter: {
    heading: "Get the best of NASCAR delivered to your inbox",
    subheading: "Standings, race results, and playoff analysis.",
  },
};

const football: SportPageData = {
  navConfig: {
    mark: "SR",
    wordmark: "Sports Rivalry",
    tabs: [
      { label: "Premier League", href: "/football", active: true },
      { label: "ISL", href: "/football" },
      { label: "La Liga", href: "/football" },
      { label: "Champions League", href: "/football" },
      { label: "Clubs", href: "/football" },
      { label: "Table", href: "/football" },
      { label: "Fixtures", href: "/football" },
      { label: "Transfers", href: "/football" },
      { label: "Stats", href: "/football" },
      { label: "Videos", href: "/football" },
      { label: "Podcasts", href: "/football" },
    ],
  },
  hero: {
    pillPrimary: "Breaking News",
    pillSecondary: "Premier League",
    headline: "Saka Strikes Late as Arsenal and City Trade Blows",
    deck: "Bukayo Saka's late equaliser keeps the title race level on points with two games to go after a frantic afternoon at the Emirates.",
    author: "Sana Qureshi",
    date: "May 4, 2026",
    readTime: 5,
    href: "/football",
    image: img("1574629810360-7efbbe195018", "Football stadium under floodlights"),
  },
  liveGame: {
    status: "LIVE",
    isLive: true,
    clock: "78'",
    away: { ...team("Arsenal", "ARS", "#ef0107", "#ffffff"), score: 2 },
    home: { ...team("Manchester City", "MCI", "#6cabdd", "#1c2c5b"), score: 2 },
    note: "Title race level on points",
  },
  playerSpotlight: {
    player: "Bukayo Saka",
    meta: "Arsenal · RW",
    monogram: "BS",
    stats: [
      { label: "G", value: "1" },
      { label: "A", value: "1" },
      { label: "SHOTS", value: "4" },
      { label: "RAT", value: "8.6" },
    ],
    footnote: "Today vs MCI",
  },
  scoreboardLabel: "Matchday Scores",
  scoreboard: [
    { status: "FT", away: { ...team("Liverpool", "LIV", "#c8102e", "#ffffff"), score: 3 }, home: { ...team("Chelsea", "CHE", "#034694", "#ffffff"), score: 1 } },
    { status: "FT", away: { ...team("Tottenham", "TOT", "#132257", "#ffffff"), score: 2 }, home: { ...team("Newcastle", "NEW", "#241f20", "#ffffff"), score: 2 } },
    { status: "FT", away: { ...team("Aston Villa", "AVL", "#670e36", "#95bfe5"), score: 0 }, home: { ...team("Man United", "MUN", "#da291c", "#fbe122"), score: 1 } },
    { status: "12:30 BST", away: team("Brighton", "BHA", "#0057b8", "#ffffff"), home: team("West Ham", "WHU", "#7a263a", "#1bb1e7"), detail: "Sky" },
    { status: "15:00 BST", away: team("Everton", "EVE", "#003399", "#ffffff"), home: team("Brentford", "BRE", "#e30613", "#ffffff"), detail: "TNT" },
  ],
  teamHub: {
    tabs: ["Premier League", "ISL", "La Liga", "Serie A"],
    teams: [
      { team: team("Arsenal", "ARS", "#ef0107", "#ffffff"), meta: "1st · 78 pts", form: ["W", "D", "W", "W", "L"] },
      { team: team("Manchester City", "MCI", "#6cabdd", "#1c2c5b"), meta: "2nd · 78 pts", form: ["W", "W", "D", "W", "W"] },
      { team: team("Liverpool", "LIV", "#c8102e", "#ffffff"), meta: "3rd · 71 pts", form: ["W", "W", "L", "W", "W"] },
      { team: team("Mohun Bagan", "MBG", "#13642b", "#a01b1b"), meta: "1st · ISL", form: ["W", "W", "W", "D", "W"] },
      { team: team("Chelsea", "CHE", "#034694", "#ffffff"), meta: "4th · 66 pts", form: ["L", "W", "W", "L", "W"] },
      { team: team("Tottenham", "TOT", "#132257", "#ffffff"), meta: "5th · 61 pts", form: ["D", "L", "W", "W", "D"] },
    ],
  },
  matchupsLabel: "Featured Fixtures",
  matchups: [
    {
      status: "LIVE",
      isLive: true,
      clock: "78'",
      teams: [
        { ...team("Arsenal", "ARS", "#ef0107", "#ffffff"), score: 2 },
        { ...team("Manchester City", "MCI", "#6cabdd", "#1c2c5b"), score: 2 },
      ],
      venue: "Emirates Stadium",
      network: "Sky Sports",
    },
    {
      status: "SUN 16:30",
      teams: [
        team("Liverpool", "LIV", "#c8102e", "#ffffff"),
        team("Man United", "MUN", "#da291c", "#fbe122"),
      ],
      venue: "Anfield",
      network: "Sky Sports",
      spread: "LIV -1.5",
      overUnder: "O/U 2.5",
    },
    {
      status: "SUN 19:45",
      teams: [
        team("Mohun Bagan", "MBG", "#13642b", "#a01b1b"),
        team("Bengaluru FC", "BFC", "#1d4ed8", "#ffffff"),
      ],
      venue: "Salt Lake Stadium",
      network: "Star Sports",
    },
  ],
  rankingsLabel: "League Table",
  rankingsColumns: ["GD", "PTS"],
  rankings: [
    { rank: 1, team: team("Arsenal", "ARS", "#ef0107", "#ffffff"), record: "36 GP", trend: "up", trendLabel: "+1", statA: "+58", statB: "78" },
    { rank: 2, team: team("Manchester City", "MCI", "#6cabdd", "#1c2c5b"), record: "36 GP", trend: "down", trendLabel: "-1", statA: "+61", statB: "78" },
    { rank: 3, team: team("Liverpool", "LIV", "#c8102e", "#ffffff"), record: "36 GP", trend: "flat", trendLabel: "—", statA: "+44", statB: "71" },
    { rank: 4, team: team("Chelsea", "CHE", "#034694", "#ffffff"), record: "36 GP", trend: "up", trendLabel: "+2", statA: "+27", statB: "66" },
    { rank: 5, team: team("Tottenham", "TOT", "#132257", "#ffffff"), record: "36 GP", trend: "down", trendLabel: "-1", statA: "+19", statB: "61" },
  ],
  analyticsLabel: "Football Analytics",
  statLeaders: [
    { category: "Goals", player: "E. Haaland", monogram: "EH", value: "27", team: "MCI" },
    { category: "Assists", player: "B. Saka", monogram: "BS", value: "14", team: "ARS" },
    { category: "xG", player: "E. Haaland", monogram: "EH", value: "24.8", team: "MCI" },
    { category: "Clean Sheets", player: "D. Raya", monogram: "DR", value: "15", team: "ARS" },
    { category: "Passes", player: "Rodri", monogram: "RO", value: "92%", team: "MCI" },
    { category: "Tackles", player: "M. Caicedo", monogram: "MC", value: "3.4", team: "CHE" },
    { category: "Rating", player: "M. Salah", monogram: "MS", value: "7.9", team: "LIV" },
  ],
  videoHighlights: [
    video("1574629810360-7efbbe195018", "Saka brace rescues a point at the Emirates", "2:08", true),
    video("1518091043644-c1d4457512c6", "Best goals from the Premier League weekend", "2:34"),
    video("1551958219-acbc608c6377", "Mohun Bagan march into the ISL final", "1:49"),
  ],
  opinions: [
    opinion(
      "1574629810360-7efbbe195018",
      "Why the title race is the tightest in a decade",
      "Sana Qureshi",
      "Analysis",
    ),
    opinion(
      "1431324155629-1a6deb1dec8d",
      "ISL is building genuine playing identities at last",
      "Sana Qureshi",
      "Long Read",
    ),
    opinion(
      "1518091043644-c1d4457512c6",
      "The transfer window that could redraw the top four",
      "Selena Smith",
      "Transfer Desk",
    ),
  ],
  newsletter: {
    heading: "Get the best of football delivered to your inbox",
    subheading: "Tables, fixtures, and transfer analysis worldwide.",
  },
};

export const SPORT_PAGE_DATA: Record<string, SportPageData> = {
  basketball,
  mlb,
  golf,
  nascar,
  football,
};

export function getSportPageDataBySlug(slug: string): SportPageData | null {
  return SPORT_PAGE_DATA[slug] || null;
}
