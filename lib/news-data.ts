import type { NewsArticle, NewsCategory } from "@/lib/news-types";

/**
 * Mock data source for the MLB News module.
 *
 * This file is the *only* place that knows the data is currently static.
 * `services/news.service.ts` is the public contract every component talks
 * to — swap the body of this file for real API calls later and nothing
 * downstream needs to change.
 */

export const NEWS_CATEGORIES: NewsCategory[] = [
  { id: "all", label: "All" },
  { id: "mlb", label: "MLB" },
  { id: "trade-news", label: "Trade News" },
  { id: "injuries", label: "Injuries" },
  { id: "analysis", label: "Analysis" },
  { id: "interviews", label: "Interviews" },
  { id: "history", label: "History" },
];

const AUTHORS = ["Karan Sharma", "Rishabh Uniyal", "Sanyam Sachdeva", "Aditya Verma", "Neha Kapoor"];

const TEAMS = [
  "Yankees",
  "Red Sox",
  "Dodgers",
  "Padres",
  "Mets",
  "Braves",
  "Orioles",
  "Blue Jays",
  "Astros",
  "Rangers",
  "Cubs",
  "Giants",
  "Royals",
  "Phillies",
  "Guardians",
  "Brewers",
];

const PLAYERS = [
  "Bryce Harper",
  "Pete Alonso",
  "Aaron Judge",
  "Shohei Ohtani",
  "Juan Soto",
  "Mookie Betts",
  "Freddie Freeman",
  "Gerrit Cole",
  "Corbin Burnes",
  "Ronald Acuña Jr.",
];

const MANAGERS = ["Craig Counsell", "Carlos Mendoza", "Aaron Boone", "Dave Roberts", "Bob Melvin"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function imageFor(seed: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/900/600`;
}

function daysAgo(days: number, hours = 0) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

interface SeedArticle {
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  tags: string[];
  age: { days: number; hours?: number };
  featured?: boolean;
  imageSeed: string;
}

/* ─── Hand-authored lead stories (mirrors the tone of the design reference) ─── */
const CURATED: SeedArticle[] = [
  {
    title: "EXCLUSIVE: Sacramento Mayor Reveals How Temporary Move Paved Way for MLB Bid",
    summary:
      "Amid MLB's expansion push, Sacramento's mayor talks about how a short-term relocation could benefit the city's long-term vision and increase local impact.",
    content:
      "Sacramento's mayor sat down for an exclusive conversation about the ripple effects of hosting a major league franchise, even temporarily. \n\nThe city's investment in infrastructure around Sutter Health Park has already started paying dividends, with local business owners reporting a noticeable uptick in foot traffic on game nights. \n\n\"This was never just about baseball for us,\" the mayor said. \"It's about proving Sacramento can support big-league infrastructure long term.\" League insiders say the arrangement could influence future expansion conversations as MLB weighs its 32-team ambitions.",
    category: "mlb",
    author: "Karan Sharma",
    tags: ["Sacramento", "MLB Expansion", "Athletics"],
    age: { days: 2 },
    featured: true,
    imageSeed: "sacramento-skyline",
  },
  {
    title: "Ex-Mets Pitcher Miraculously Survives After Venezuela Earthquake Strikes Hotel",
    summary:
      "Former Mets right-hander escapes unharmed after a powerful earthquake in Venezuela hits the hotel where his team was staying.",
    content:
      "A frightening night turned into a story of relief for a former Mets right-hander who escaped a collapsing hotel corridor unharmed after a 6.1 magnitude earthquake struck the region. \n\nTeammates described chaotic scenes as guests evacuated in the dark, with aftershocks continuing for hours. \n\nThe pitcher, now playing winter ball, said he was grateful for how quickly hotel staff and teammates organized an evacuation. MLB's players association confirmed it is monitoring the situation for all league-affiliated players currently competing in the region.",
    category: "mlb",
    author: "Karan Sharma",
    tags: ["Mets", "Venezuela", "Winter Ball"],
    age: { days: 1 },
    imageSeed: "mets-pitcher-mound",
  },
  {
    title: '"Really Strange" Yankees Broadcaster Shuts Red Sox Fans Down After Anti-Bronx Chant',
    summary:
      "The Yankees broadcast team wasn't having it after Red Sox fans went too far with their chants against New York — and the mic picked it all up.",
    content:
      "Fenway Park's rivalry energy boiled over Friday night when a section of Red Sox fans launched into a chant the Yankees broadcast crew found impossible to ignore. \n\n\"That's really strange, even for this rivalry,\" one broadcaster said live on air, prompting a wave of reaction on social media. \n\nThe exchange has since been clipped and shared thousands of times, reigniting debate over how far fan chants should go during nationally televised rivalry games.",
    category: "mlb",
    author: "Karan Sharma",
    tags: ["Yankees", "Red Sox", "Broadcast"],
    age: { days: 1 },
    imageSeed: "broadcast-booth",
  },
  {
    title: "Bryce Harper Issues Clarification Over Wild Gesture After Nationals Fans Resort to NSFW Chants",
    summary:
      "Bryce Harper opened up about his intense on-field gesture and addressed the inappropriate chants from Nationals fans during the heated matchup.",
    content:
      "Bryce Harper addressed reporters after Wednesday's game, clarifying the intent behind a gesture that went viral within minutes of the final out. \n\n\"It wasn't personal, it was just emotion,\" Harper explained, while also calling on the league to crack down on the chants directed at him from the visiting section all night. \n\nThe Phillies slugger has a long, complicated history with his former club, and Wednesday's atmosphere was a reminder of just how personal that rivalry remains.",
    category: "interviews",
    author: "Rishabh Uniyal",
    tags: ["Bryce Harper", "Phillies", "Nationals"],
    age: { days: 2 },
    imageSeed: "bryce-harper-bat",
  },
  {
    title: '"Our Fans Deserve Better" – Steve Cohen Sends Blunt Message as Mets Fire Carlos Mendoza',
    summary:
      "Steve Cohen didn't hold back as he addressed the Mets' decision to part ways with Carlos Mendoza, sending a clear message to the fanbase.",
    content:
      "Mets owner Steve Cohen didn't mince words during Thursday's press conference, taking full ownership of a disappointing stretch that ultimately cost Carlos Mendoza his job. \n\n\"Our fans deserve better, and that starts with accountability at every level of this organization,\" Cohen said. \n\nThe front office is already fielding interest from several bench coaches around the league, with a permanent replacement expected before the start of the offseason workout program.",
    category: "trade-news",
    author: "Karan Sharma",
    tags: ["Mets", "Steve Cohen", "Carlos Mendoza"],
    age: { days: 2 },
    imageSeed: "mets-press-conference",
  },
  {
    title: "Giants Player Loses Close Family Member; Royals Coach Holds Back Tears as Venezuela Faces Tragic Loss",
    summary:
      "Baseball world comes together as both San Francisco Giants and Kansas City Royals share emotional moments following the devastating events in Venezuela.",
    content:
      "A somber mood settled over both clubhouses this week as players and coaches from the Giants and Royals processed news of personal loss connected to the disaster in Venezuela. \n\nA Royals coach fought back tears addressing reporters, thanking the organization for immediate support and travel arrangements. \n\nBoth teams wore commemorative patches during Tuesday's series as a show of solidarity with the wider Venezuelan baseball community.",
    category: "mlb",
    author: "Sanyam Sachdeva",
    tags: ["Giants", "Royals", "Venezuela"],
    age: { days: 1 },
    imageSeed: "royals-dugout",
  },
  {
    title: "Craig Counsell Sends Clear Message to Ex-Mets Star After New York Exit",
    summary:
      "After the Cubs take a key series, Craig Counsell shared a firm message for his former star, hinting at a new era for Chicago baseball.",
    content:
      "Craig Counsell wasted no time setting the tone after a series win, using his former player's exit from New York as a talking point for the direction he wants his current roster to take. \n\n\"We're building something different here — accountability first,\" Counsell said. \n\nThe comments come as the Cubs continue to reshape their identity following an active offseason of roster turnover.",
    category: "interviews",
    author: "Karan Sharma",
    tags: ["Craig Counsell", "Cubs", "Mets"],
    age: { days: 1 },
    imageSeed: "counsell-dugout",
  },
  {
    title: "Mets Nation Can't Get Over Pete Alonso Offseason Gamble as Chants Break Out During Cubs Series",
    summary:
      "New York fans let Pete Alonso hear it loud and clear as chants filled the stands during an intense showdown against the Cubs.",
    content:
      "Citi Field turned electric — and occasionally tense — as fans reacted to Pete Alonso's offseason contract gamble with a mix of cheers and pointed chants throughout the series opener against the Cubs. \n\nAlonso addressed the noise postgame, saying he understood fan frustration but remained focused on production on the field. \n\nThe first baseman has quieted some of the doubt with a strong start to the season, but Mets fans clearly haven't forgotten the offseason drama.",
    category: "mlb",
    author: "Sanyam Sachdeva",
    tags: ["Pete Alonso", "Mets", "Cubs"],
    age: { days: 1 },
    imageSeed: "alonso-bat-flip",
  },
];

/* ─── Template pools used to responsibly grow the catalogue for pagination/demo purposes ─── */
const TRADE_TEMPLATES = [
  (a: string, b: string) => `${a} Front Office Explores Blockbuster Trade Framework With ${b}`,
  (a: string, b: string) => `Insiders Say ${a} and ${b} Have Reopened Trade Talks Ahead of Deadline`,
  (a: string, b: string) => `${a} Shopping Bullpen Pieces as ${b} Circle for a Late-Season Deal`,
];

const INJURY_TEMPLATES = [
  (player: string, team: string) => `${team} Provide Update on ${player}'s Recovery Timeline`,
  (player: string, team: string) => `${player} Exits Early as ${team} Brace for IL Stint`,
  (player: string, team: string) => `${team} Manager Addresses Concern Over ${player}'s Setback`,
];

const ANALYSIS_TEMPLATES = [
  (a: string, b: string) => `Why the ${a}-${b} Series Could Decide the Division Race`,
  (a: string, b: string) => `Breaking Down What's Fueling the ${a}'s Second-Half Surge`,
  (a: string, b: string) => `The Numbers Behind ${a}'s Bullpen Turnaround Against ${b}`,
];

const INTERVIEW_TEMPLATES = [
  (manager: string, team: string) => `${manager} Opens Up on What Changed Inside the ${team} Clubhouse`,
  (manager: string, team: string) => `${manager} Reflects on Pressure of Managing the ${team} This Season`,
];

const HISTORY_TEMPLATES = [
  (team: string) => `Revisiting the ${team} Season That Redefined a Franchise`,
  (team: string) => `The Forgotten ${team} Trade That Changed Baseball History`,
];

const MLB_TEMPLATES = [
  (a: string, b: string) => `${a} Rally Late to Steal Series Opener From ${b}`,
  (a: string, b: string) => `${a} and ${b} Set for Statement Series Under the Lights`,
  (a: string, b: string) => `${a} Bullpen Implodes in Costly Loss to ${b}`,
];

function pick<T>(items: T[], index: number): T {
  return items[index % items.length];
}

function buildGenerated(count: number): SeedArticle[] {
  const generated: SeedArticle[] = [];

  for (let i = 0; i < count; i++) {
    const teamA = pick(TEAMS, i);
    const teamB = pick(TEAMS, i + 5);
    const player = pick(PLAYERS, i);
    const manager = pick(MANAGERS, i);
    const author = pick(AUTHORS, i);
    const bucket = i % 6;

    let title = "";
    let category = "mlb";
    let summary = "";

    if (bucket === 0) {
      title = pick(TRADE_TEMPLATES, i)(teamA, teamB);
      category = "trade-news";
      summary = `Front-office chatter around the ${teamA} continues to build as the deadline approaches, with the ${teamB} named as a persistent trade partner in talks league insiders describe as "serious."`;
    } else if (bucket === 1) {
      title = pick(INJURY_TEMPLATES, i)(player, teamA);
      category = "injuries";
      summary = `The ${teamA} medical staff issued an update on ${player} following Tuesday's game, with the training staff monitoring the situation closely over the next 48 hours.`;
    } else if (bucket === 2) {
      title = pick(ANALYSIS_TEMPLATES, i)(teamA, teamB);
      category = "analysis";
      summary = `A closer look at the matchups, bullpen usage, and lineup construction shaping the ${teamA}-${teamB} series — and what it means for the stretch run.`;
    } else if (bucket === 3) {
      title = pick(INTERVIEW_TEMPLATES, i)(manager, teamA);
      category = "interviews";
      summary = `${manager} sat down for a candid conversation about the ${teamA}'s season, clubhouse culture, and what still needs to change down the stretch.`;
    } else if (bucket === 4) {
      title = pick(HISTORY_TEMPLATES, i)(teamA);
      category = "history";
      summary = `A look back at one of the defining chapters in ${teamA} history and the decisions that still shape the organization today.`;
    } else {
      title = pick(MLB_TEMPLATES, i)(teamA, teamB);
      category = "mlb";
      summary = `A back-and-forth affair between the ${teamA} and ${teamB} kept fans on their feet, with both dugouts pointing to bullpen management as the deciding factor.`;
    }

    generated.push({
      title,
      summary,
      content: `${summary} \n\nBoth clubhouses were relatively quiet postgame, but reporters on the scene noted a sense of urgency building around this stretch of the schedule. \n\nExpect this storyline to keep developing as the ${teamA} and ${teamB} continue their season series.`,
      category,
      author,
      tags: [teamA, teamB, category === "mlb" ? "MLB" : category],
      age: { days: 3 + Math.floor(i / 3), hours: (i * 7) % 24 },
      imageSeed: `${slugify(title)}-${i}`,
    });
  }

  return generated;
}

const ALL_SEEDS: SeedArticle[] = [...CURATED, ...buildGenerated(72)];

/** Pure display helper: resolves a category id (e.g. "trade-news") to its label ("Trade News"). */
export function getCategoryLabel(categoryId: string): string {
  return NEWS_CATEGORIES.find((category) => category.id === categoryId)?.label || categoryId;
}

export const NEWS_ARTICLES: NewsArticle[] = ALL_SEEDS.map((seed, index) => {
  const id = `news-${index + 1}`;
  const baseSlug = slugify(seed.title);
  return {
    id,
    slug: `${baseSlug}-${id}`,
    title: seed.title,
    summary: seed.summary,
    content: seed.content,
    author: seed.author,
    publishedAt: daysAgo(seed.age.days, seed.age.hours ?? 0),
    category: seed.category,
    image: imageFor(seed.imageSeed),
    featured: Boolean(seed.featured),
    tags: seed.tags,
  };
});
