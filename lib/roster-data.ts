import type { MLBTeam } from "@/lib/mlb-team-types";
import type { Player, PositionGroup } from "@/lib/player-types";
import { groupForPosition } from "@/lib/player-types";

/* ─────────────────────────────────────────────────────────
   Deterministic mock roster generation.
   Every team gets a stable ~26-man roster derived from a
   seeded PRNG (same team → same roster on every render),
   so it behaves like real data while staying swappable for
   a future API without changing any component code.
───────────────────────────────────────────────────────── */

function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (Math.imul(31, hash) + value.charCodeAt(i)) | 0;
  }
  return hash;
}

const FIRST_NAMES = [
  "Aaron", "Marcus", "Diego", "Kenji", "Jose", "Tyler", "Brandon", "Miguel",
  "Ryan", "Cody", "Ali", "Austin", "Camilo", "Fernando", "Gerrit", "Paul",
  "Yerry", "Brent", "Tim", "Carlos", "Cam", "Will", "David", "Anthony",
  "Ben", "Max", "Amed", "Oswaldo", "Jazz", "Spencer", "Jasson", "Luis",
  "Elly", "Bobby", "Mookie", "Rafael", "Yordan", "Gunnar", "Shohei", "Sandy",
  "Michael", "Zack", "Nathan", "Chase", "Jacob", "Gavin", "Kyle", "Sonny",
  "Andre", "Davis", "Justin", "Foster", "Antonio", "Tomoyuki", "Cristopher",
];

const LAST_NAMES = [
  "Bednar", "Blackburn", "Cole", "Cruz", "De los Santos", "Deval", "Headrick",
  "Hill", "Rodon", "Schlittler", "Warren", "Weathers", "Yarbrough", "Sanchez",
  "Wells", "Caballero", "Cabrera", "Chisholm Jr.", "Goldschmidt", "Rice",
  "Rosario", "Schuemann", "Volpe", "Bellinger", "Dominguez", "Jones",
  "Alvarez", "Henderson", "Witt Jr.", "Betts", "Devers", "Judge", "Arraez",
  "Ohtani", "Skenes", "Ashby", "Gray", "Martin", "Pallante", "Williams",
  "Meyer", "Wrobleski", "Burns", "Misiorowski", "Eovaldi", "Wheeler",
  "Senzatela", "Griffin", "Soroka", "Alcantara", "Soriano", "Sugano",
  "Harrison", "Chapman", "Freeman", "Machado", "Lindor", "Turner", "Baez",
];

const BIRTHPLACES = [
  "Pittsburgh, PA", "Antioch, CA", "Newport Beach, CA", "Bayamon, Puerto Rico",
  "Santa Barbara de Samana, Dominican Republic", "Yamasa, Dominican Republic",
  "Braidwood, IL", "Mission Hills, CA", "Miami, FL", "Weymouth, MA",
  "Brandon, MS", "Loretto, TN", "Austin, TX", "Carora, Venezuela",
  "Scottsdale, AZ", "Las Tablas, Panama", "Guarenas, Venezuela", "Nassau, Bahamas",
  "Wilmington, DE", "Cohasset, MA", "Santo Domingo, Dominican Republic",
  "Kalamazoo, MI", "New York, NY", "Esperanza, Dominican Republic",
  "Encinitas, CA", "San Juan, Puerto Rico", "Maracay, Venezuela", "Los Angeles, CA",
  "Havana, Cuba", "Tokyo, Japan", "Seoul, South Korea", "Toronto, Canada",
  "Vancouver, Canada", "Curacao", "San Pedro de Macoris, Dominican Republic",
  "Managua, Nicaragua", "Chicago, IL", "Houston, TX", "Atlanta, GA", "Denver, CO",
];

interface PositionSpec {
  position: string;
  group: PositionGroup;
}

const ROSTER_BLUEPRINT: PositionSpec[] = [
  ...Array(6).fill({ position: "SP", group: "Pitchers" as PositionGroup }),
  ...Array(6).fill({ position: "RP", group: "Pitchers" as PositionGroup }),
  { position: "CP", group: "Pitchers" },
  { position: "C", group: "Catchers" },
  { position: "C", group: "Catchers" },
  { position: "1B", group: "Infielders" },
  { position: "2B", group: "Infielders" },
  { position: "3B", group: "Infielders" },
  { position: "3B", group: "Infielders" },
  { position: "SS", group: "Infielders" },
  { position: "SS", group: "Infielders" },
  { position: "1B", group: "Infielders" },
  { position: "LF", group: "Outfielders" },
  { position: "CF", group: "Outfielders" },
  { position: "RF", group: "Outfielders" },
];

function shuffled<T>(items: T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Generates a stable, realistic-looking active roster for a given team. */
export function generateRosterForTeam(team: MLBTeam): Player[] {
  const random = mulberry32(seedFromString(team.id));
  const jerseyPool = shuffled(
    Array.from({ length: 100 }, (_, i) => i),
    random
  );
  const firstNames = shuffled(FIRST_NAMES, random);
  const lastNames = shuffled(LAST_NAMES, random);
  const birthplaces = shuffled(BIRTHPLACES, random);

  return ROSTER_BLUEPRINT.map((spec, index) => {
    const first = firstNames[index % firstNames.length];
    const last = lastNames[index % lastNames.length];
    const name = `${first} ${last}`;
    const bats: Player["bat"][] = ["L", "R", "R", "S"];
    const throwsArr: Player["throw"][] = ["L", "R", "R", "R"];

    const heightM = 1.68 + random() * 0.35;
    const weightKg = 75 + Math.round(random() * 40);
    const age = 21 + Math.floor(random() * 17);

    return {
      id: `${team.id}-${index}`,
      teamId: team.id,
      name,
      slug: slugify(`${name}-${team.slug}`),
      jerseyNumber: jerseyPool[index % jerseyPool.length],
      position: spec.position,
      bat: bats[Math.floor(random() * bats.length)],
      throw: throwsArr[Math.floor(random() * throwsArr.length)],
      age,
      height: `${heightM.toFixed(2)} m`,
      weight: `${weightKg} kg`,
      birthPlace: birthplaces[index % birthplaces.length],
      image: `https://picsum.photos/seed/${team.id}-player-${index}/160/160`,
      group: groupForPosition(spec.position),
    } satisfies Player;
  });
}

/** Real-world-flavored manager names keyed by team id — swap for an API later. */
export const TEAM_MANAGERS: Record<string, string> = {
  bal: "Brandon Hyde",
  bos: "Alex Cora",
  nyy: "Aaron Boone",
  tb: "Kevin Cash",
  tor: "John Schneider",
  cws: "Will Venable",
  cle: "Stephen Vogt",
  det: "A.J. Hinch",
  kc: "Matt Quatraro",
  min: "Rocco Baldelli",
  hou: "Joe Espada",
  laa: "Ron Washington",
  oak: "Mark Kotsay",
  sea: "Dan Wilson",
  tex: "Bruce Bochy",
  atl: "Brian Snitker",
  mia: "Skip Schumaker",
  nym: "Carlos Mendoza",
  phi: "Rob Thomson",
  was: "Davey Martinez",
  chc: "Craig Counsell",
  cin: "Terry Francona",
  mil: "Pat Murphy",
  pit: "Derek Shelton",
  stl: "Oliver Marmol",
  ari: "Torey Lovullo",
  col: "Warren Schaeffer",
  lad: "Dave Roberts",
  sd: "Mike Shildt",
  sf: "Bob Melvin",
};

export function getManagerForTeam(team: MLBTeam): string {
  return team.manager ?? TEAM_MANAGERS[team.id] ?? "Manager TBD";
}

/** Simple, dependency-free monogram "crest" used until real team logos are wired up. */
export function getTeamLogo(team: MLBTeam): string {
  return team.logo ?? team.shortName;
}

export function getTeamBanner(team: MLBTeam): string {
  return team.bannerImage ?? team.stadiumImage;
}
