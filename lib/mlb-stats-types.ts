export interface PitchingRow {
  rk: number;
  name: string;
  team: string;
  pos: string;
  gp: number;
  gs: number;
  qs: number;
  era: string;
  w: number;
  l: number;
  sv: number;
  hld: number;
  ip: string;
  h: number;
  er: number;
  hr: number;
  bb: number;
  k: number;
  k9: string;
  war: string;
  whip: string;
}

export interface BattingRow {
  rk: number;
  name: string;
  team: string;
  pos: string;
  g: number;
  ab: number;
  r: number;
  h: number;
  doubles: number;
  triples: number;
  hr: number;
  rbi: number;
  sb: number;
  bb: number;
  so: number;
  avg: string;
  obp: string;
  slg: string;
  ops: string;
  war: string;
}

export interface FieldingRow {
  rk: number;
  name: string;
  team: string;
  pos: string;
  g: number;
  gs: number;
  inn: string;
  tc: number;
  po: number;
  a: number;
  e: number;
  dp: number;
  fldPct: string;
  rfg: string;
  rf9: string;
  drs: number;
  oaa: number;
}

export interface MlbStatsTables {
  seasonLabel: string;
  batting: BattingRow[];
  pitching: PitchingRow[];
  fielding: FieldingRow[];
}
