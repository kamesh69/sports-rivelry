export type PlayerBat = "L" | "R" | "S";
export type PlayerThrow = "L" | "R";

/** Roster position group. Kept as a union (not a free string) so tables stay predictable. */
export type PositionGroup = "Pitchers" | "Catchers" | "Infielders" | "Outfielders";

export interface Player {
  id: string;
  teamId: string;
  name: string;
  slug: string;
  jerseyNumber: number;
  position: string;
  bat: PlayerBat;
  throw: PlayerThrow;
  age: number;
  height: string;
  weight: string;
  birthPlace: string;
  image: string;
  group: PositionGroup;
}

/** Canonical display order for grouped roster sections. */
export const POSITION_GROUP_ORDER: PositionGroup[] = [
  "Pitchers",
  "Catchers",
  "Infielders",
  "Outfielders",
];

const POSITION_TO_GROUP: Record<string, PositionGroup> = {
  P: "Pitchers",
  SP: "Pitchers",
  RP: "Pitchers",
  CP: "Pitchers",
  C: "Catchers",
  "1B": "Infielders",
  "2B": "Infielders",
  "3B": "Infielders",
  SS: "Infielders",
  IF: "Infielders",
  LF: "Outfielders",
  CF: "Outfielders",
  RF: "Outfielders",
  OF: "Outfielders",
};

/** Dynamically derives a player's section from their raw position code — never hardcoded per-team. */
export function groupForPosition(position: string): PositionGroup {
  return POSITION_TO_GROUP[position.toUpperCase()] ?? "Infielders";
}
