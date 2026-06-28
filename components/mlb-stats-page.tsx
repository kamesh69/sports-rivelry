"use client";

import { useState } from "react";
import Link from "next/link";
import { nameToSlug } from "@/lib/player-data";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface PitchingRow {
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

interface BattingRow {
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

interface FieldingRow {
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

type Tab = "batting" | "pitching" | "fielding";

/* ─────────────────────────────────────────────
   Data — Pitching
───────────────────────────────────────────── */
const PITCHING: PitchingRow[] = [
  { rk: 1,  name: "Aaron Ashby",        team: "MIL", pos: "RP", gp: 37, gs: 1,  qs: 0,  era: "3.17", w: 10, l: 0, sv: 4,  hld: 8,  ip: "48.1",  h: 40,  er: 17, hr: 4,  bb: 24, k: 66,  k9: "12.3", war: "0.7", whip: "1.32" },
  { rk: 2,  name: "Sonny Gray",         team: "STL", pos: "SP", gp: 14, gs: 14, qs: 9,  era: "2.95", w: 9,  l: 1, sv: 0,  hld: 0,  ip: "76.1",  h: 71,  er: 25, hr: 9,  bb: 20, k: 66,  k9: "7.8",  war: "1.9", whip: "1.19" },
  { rk: 3,  name: "Cristopher Sanchez", team: "PHI", pos: "SP", gp: 17, gs: 17, qs: 12, era: "2.13", w: 9,  l: 3, sv: 0,  hld: 0,  ip: "110.0", h: 101, er: 26, hr: 8,  bb: 21, k: 127, k9: "10.4", war: "5.2", whip: "1.11" },
  { rk: 4,  name: "Davis Martin",       team: "CHW", pos: "SP", gp: 16, gs: 16, qs: 8,  era: "3.00", w: 8,  l: 3, sv: 0,  hld: 0,  ip: "93.0",  h: 86,  er: 31, hr: 6,  bb: 24, k: 90,  k9: "8.7",  war: "2.8", whip: "1.18" },
  { rk: 5,  name: "Andre Pallante",     team: "STL", pos: "SP", gp: 16, gs: 16, qs: 6,  era: "3.83", w: 5,  l: 5, sv: 0,  hld: 0,  ip: "89.1",  h: 84,  er: 38, hr: 9,  bb: 26, k: 68,  k9: "6.9",  war: "1.4", whip: "1.23" },
  { rk: 6,  name: "Gavin Williams",     team: "CLE", pos: "SP", gp: 16, gs: 16, qs: 6,  era: "3.82", w: 4,  l: 0, sv: 0,  hld: 0,  ip: "96.2",  h: 79,  er: 41, hr: 15, bb: 31, k: 111, k9: "10.3", war: "1.4", whip: "1.14" },
  { rk: 7,  name: "Max Meyer",          team: "MIA", pos: "SP", gp: 17, gs: 17, qs: 7,  era: "2.60", w: 8,  l: 0, sv: 0,  hld: 0,  ip: "97.0",  h: 72,  er: 28, hr: 8,  bb: 36, k: 107, k9: "9.9",  war: "3.1", whip: "1.11" },
  { rk: 8,  name: "Justin Wrobleski",   team: "LAD", pos: "SP", gp: 14, gs: 13, qs: 8,  era: "2.71", w: 9,  l: 2, sv: 0,  hld: 0,  ip: "86.1",  h: 69,  er: 26, hr: 7,  bb: 18, k: 63,  k9: "6.5",  war: "1.9", whip: "1.01" },
  { rk: 9,  name: "Chase Burns",        team: "CIN", pos: "SP", gp: 16, gs: 16, qs: 8,  era: "2.36", w: 9,  l: 3, sv: 0,  hld: 0,  ip: "91.2",  h: 70,  er: 24, hr: 11, bb: 29, k: 112, k9: "11.0", war: "4.2", whip: "1.08" },
  { rk: 10, name: "Jacob Misiorowski",  team: "MIL", pos: "SP", gp: 16, gs: 16, qs: 11, era: "1.45", w: 9,  l: 3, sv: 0,  hld: 0,  ip: "99.0",  h: 49,  er: 16, hr: 5,  bb: 27, k: 146, k9: "13.3", war: "4.6", whip: "0.77" },
  { rk: 11, name: "Gerrit Cole",        team: "NYY", pos: "SP", gp: 5,  gs: 5,  qs: 4,  era: "3.12", w: 2,  l: 1, sv: 0,  hld: 0,  ip: "31.2",  h: 24,  er: 11, hr: 3,  bb: 14, k: 38,  k9: "10.8", war: "1.2", whip: "1.20" },
  { rk: 12, name: "Nathan Eovaldi",     team: "TEX", pos: "SP", gp: 16, gs: 16, qs: 9,  era: "3.95", w: 8,  l: 7, sv: 0,  hld: 0,  ip: "100.1", h: 93,  er: 44, hr: 17, bb: 23, k: 101, k9: "9.1",  war: "1.1", whip: "1.16" },
  { rk: 13, name: "Zack Wheeler",       team: "PHI", pos: "SP", gp: 12, gs: 12, qs: 9,  era: "2.03", w: 8,  l: 1, sv: 0,  hld: 0,  ip: "75.1",  h: 46,  er: 17, hr: 8,  bb: 19, k: 74,  k9: "8.8",  war: "3.9", whip: "0.86" },
  { rk: 14, name: "Antonio Senzatela",  team: "COL", pos: "RP", gp: 24, gs: 0,  qs: 0,  era: "2.28", w: 8,  l: 0, sv: 3,  hld: 2,  ip: "43.1",  h: 33,  er: 11, hr: 3,  bb: 13, k: 36,  k9: "7.5",  war: "1.9", whip: "1.06" },
  { rk: 15, name: "Foster Griffin",     team: "WSH", pos: "RP", gp: 17, gs: 0,  qs: 0,  era: "2.93", w: 8,  l: 2, sv: 0,  hld: 2,  ip: "98.1",  h: 77,  er: 32, hr: 16, bb: 25, k: 98,  k9: "9.0",  war: "2.2", whip: "1.04" },
  { rk: 16, name: "Michael Soroka",     team: "ARI", pos: "SP", gp: 15, gs: 15, qs: 7,  era: "3.07", w: 8,  l: 3, sv: 0,  hld: 0,  ip: "82.0",  h: 72,  er: 28, hr: 6,  bb: 17, k: 79,  k9: "8.7",  war: "2.1", whip: "1.09" },
  { rk: 17, name: "Sandy Alcantara",    team: "MIA", pos: "SP", gp: 17, gs: 17, qs: 12, era: "4.01", w: 8,  l: 4, sv: 0,  hld: 0,  ip: "110.0", h: 109, er: 49, hr: 12, bb: 27, k: 81,  k9: "6.6",  war: "1.3", whip: "1.24" },
  { rk: 18, name: "Shohei Ohtani",      team: "LAD", pos: "DH", gp: 13, gs: 13, qs: 11, era: "1.58", w: 2,  l: 2, sv: 0,  hld: 0,  ip: "79.2",  h: 48,  er: 14, hr: 3,  bb: 24, k: 86,  k9: "9.7",  war: "2.5", whip: "0.90" },
  { rk: 19, name: "Jose Soriano",       team: "LAA", pos: "SP", gp: 17, gs: 17, qs: 6,  era: "3.41", w: 8,  l: 4, sv: 0,  hld: 0,  ip: "95.0",  h: 77,  er: 36, hr: 12, bb: 48, k: 102, k9: "9.7",  war: "2.0", whip: "1.32" },
  { rk: 20, name: "Tomoyuki Sugano",    team: "COL", pos: "SP", gp: 16, gs: 16, qs: 4,  era: "4.80", w: 4,  l: 4, sv: 0,  hld: 0,  ip: "84.1",  h: 88,  er: 45, hr: 16, bb: 23, k: 48,  k9: "5.1",  war: "1.0", whip: "1.32" },
  { rk: 21, name: "Kyle Harrison",      team: "MIL", pos: "SP", gp: 15, gs: 15, qs: 6,  era: "2.57", w: 8,  l: 1, sv: 0,  hld: 0,  ip: "77.0",  h: 68,  er: 25, hr: 9,  bb: 19, k: 96,  k9: "11.2", war: "2.6", whip: "1.04" },
  { rk: 22, name: "Cam Schlitter",      team: "NYY", pos: "SP", gp: 17, gs: 17, qs: 10, era: "1.62", w: 8,  l: 4, sv: 0,  hld: 0,  ip: "100.0", h: 72,  er: 18, hr: 6,  bb: 20, k: 118, k9: "10.6", war: "4.1", whip: "0.92" },
];

/* ─────────────────────────────────────────────
   Data — Batting
───────────────────────────────────────────── */
const BATTING: BattingRow[] = [
  { rk: 1,  name: "Luis Arraez",        team: "SD",  pos: "2B", g: 97,  ab: 371, r: 52,  h: 127, doubles: 22, triples: 2, hr: 4,  rbi: 42,  sb: 6,  bb: 38, so: 21,  avg: ".342", obp: ".405", slg: ".449", ops: ".854", war: "4.2" },
  { rk: 2,  name: "Aaron Judge",        team: "NYY", pos: "CF", g: 94,  ab: 330, r: 78,  h: 103, doubles: 18, triples: 1, hr: 41, rbi: 89,  sb: 5,  bb: 61, so: 88,  avg: ".312", obp: ".427", slg: ".703", ops: "1.130", war: "8.4" },
  { rk: 3,  name: "Shohei Ohtani",      team: "LAD", pos: "DH", g: 95,  ab: 356, r: 77,  h: 111, doubles: 21, triples: 3, hr: 38, rbi: 91,  sb: 18, bb: 55, so: 96,  avg: ".312", obp: ".403", slg: ".699", ops: "1.102", war: "7.8" },
  { rk: 4,  name: "Rafael Devers",      team: "BOS", pos: "1B", g: 96,  ab: 360, r: 65,  h: 105, doubles: 26, triples: 1, hr: 27, rbi: 98,  sb: 2,  bb: 44, so: 85,  avg: ".292", obp: ".371", slg: ".597", ops: ".968", war: "4.9" },
  { rk: 5,  name: "Elly De La Cruz",    team: "CIN", pos: "SS", g: 98,  ab: 372, r: 72,  h: 104, doubles: 19, triples: 8, hr: 22, rbi: 64,  sb: 52, bb: 38, so: 121, avg: ".280", obp: ".347", slg: ".534", ops: ".881", war: "5.3" },
  { rk: 6,  name: "Yordan Alvarez",     team: "HOU", pos: "DH", g: 91,  ab: 333, r: 58,  h: 97,  doubles: 24, triples: 0, hr: 29, rbi: 76,  sb: 0,  bb: 52, so: 78,  avg: ".291", obp: ".389", slg: ".601", ops: ".990", war: "4.6" },
  { rk: 7,  name: "Gunnar Henderson",   team: "BAL", pos: "SS", g: 96,  ab: 358, r: 70,  h: 101, doubles: 23, triples: 3, hr: 31, rbi: 77,  sb: 9,  bb: 48, so: 102, avg: ".282", obp: ".372", slg: ".579", ops: ".951", war: "5.8" },
  { rk: 8,  name: "Bobby Witt Jr.",     team: "KC",  pos: "SS", g: 99,  ab: 393, r: 74,  h: 115, doubles: 28, triples: 7, hr: 24, rbi: 73,  sb: 28, bb: 31, so: 89,  avg: ".293", obp: ".344", slg: ".541", ops: ".885", war: "5.1" },
  { rk: 9,  name: "Mookie Betts",       team: "LAD", pos: "SS", g: 88,  ab: 328, r: 62,  h: 99,  doubles: 21, triples: 2, hr: 20, rbi: 61,  sb: 14, bb: 47, so: 59,  avg: ".302", obp: ".393", slg: ".543", ops: ".936", war: "4.8" },
  { rk: 10, name: "Paul Skenes",        team: "PIT", pos: "SP", g: 17,  ab: 0,   r: 0,   h: 0,   doubles: 0,  triples: 0, hr: 0,  rbi: 0,   sb: 0,  bb: 0,  so: 0,   avg: "—",    obp: "—",    slg: "—",    ops: "—",    war: "4.1" },
  { rk: 11, name: "Fernando Tatis Jr.", team: "SD",  pos: "RF", g: 93,  ab: 351, r: 64,  h: 98,  doubles: 20, triples: 4, hr: 26, rbi: 68,  sb: 21, bb: 38, so: 108, avg: ".279", obp: ".349", slg: ".533", ops: ".882", war: "4.0" },
  { rk: 12, name: "Freddie Freeman",    team: "LAD", pos: "1B", g: 94,  ab: 355, r: 61,  h: 104, doubles: 29, triples: 1, hr: 18, rbi: 70,  sb: 3,  bb: 48, so: 64,  avg: ".293", obp: ".380", slg: ".507", ops: ".887", war: "3.7" },
  { rk: 13, name: "Julio Rodriguez",    team: "SEA", pos: "CF", g: 97,  ab: 378, r: 66,  h: 104, doubles: 22, triples: 5, hr: 23, rbi: 65,  sb: 31, bb: 37, so: 112, avg: ".275", obp: ".338", slg: ".506", ops: ".844", war: "4.4" },
  { rk: 14, name: "Vladimir Guerrero",  team: "TOR", pos: "1B", g: 93,  ab: 353, r: 55,  h: 101, doubles: 25, triples: 0, hr: 22, rbi: 72,  sb: 2,  bb: 41, so: 61,  avg: ".286", obp: ".363", slg: ".497", ops: ".860", war: "3.3" },
  { rk: 15, name: "Ronald Acuna Jr.",   team: "ATL", pos: "RF", g: 89,  ab: 343, r: 67,  h: 98,  doubles: 19, triples: 3, hr: 20, rbi: 58,  sb: 34, bb: 45, so: 91,  avg: ".286", obp: ".370", slg: ".510", ops: ".880", war: "4.7" },
  { rk: 16, name: "Trea Turner",        team: "PHI", pos: "SS", g: 98,  ab: 388, r: 71,  h: 109, doubles: 21, triples: 6, hr: 16, rbi: 57,  sb: 24, bb: 33, so: 83,  avg: ".281", obp: ".336", slg: ".454", ops: ".790", war: "3.1" },
  { rk: 17, name: "Jose Ramirez",       team: "CLE", pos: "3B", g: 97,  ab: 367, r: 65,  h: 103, doubles: 28, triples: 2, hr: 24, rbi: 78,  sb: 18, bb: 44, so: 67,  avg: ".281", obp: ".358", slg: ".514", ops: ".872", war: "4.5" },
  { rk: 18, name: "Adolis Garcia",      team: "TEX", pos: "RF", g: 94,  ab: 357, r: 57,  h: 94,  doubles: 19, triples: 2, hr: 28, rbi: 74,  sb: 8,  bb: 29, so: 118, avg: ".263", obp: ".319", slg: ".510", ops: ".829", war: "2.8" },
  { rk: 19, name: "Matt McLain",        team: "CIN", pos: "SS", g: 95,  ab: 357, r: 58,  h: 98,  doubles: 23, triples: 3, hr: 16, rbi: 54,  sb: 14, bb: 38, so: 87,  avg: ".275", obp: ".344", slg: ".451", ops: ".795", war: "3.4" },
  { rk: 20, name: "Wyatt Langford",     team: "TEX", pos: "LF", g: 98,  ab: 367, r: 59,  h: 100, doubles: 20, triples: 4, hr: 19, rbi: 63,  sb: 16, bb: 41, so: 97,  avg: ".272", obp: ".348", slg: ".467", ops: ".815", war: "3.0" },
  { rk: 21, name: "Seiya Suzuki",       team: "CHC", pos: "RF", g: 96,  ab: 357, r: 53,  h: 98,  doubles: 24, triples: 1, hr: 17, rbi: 58,  sb: 7,  bb: 37, so: 83,  avg: ".275", obp: ".346", slg: ".453", ops: ".799", war: "2.7" },
  { rk: 22, name: "Spencer Torkelson",  team: "DET", pos: "1B", g: 97,  ab: 362, r: 56,  h: 96,  doubles: 21, triples: 0, hr: 23, rbi: 66,  sb: 1,  bb: 48, so: 101, avg: ".265", obp: ".353", slg: ".479", ops: ".832", war: "2.9" },
];

/* ─────────────────────────────────────────────
   Data — Fielding
───────────────────────────────────────────── */
const FIELDING: FieldingRow[] = [
  { rk: 1,  name: "Nico Hoerner",        team: "CHC", pos: "2B", g: 96,  gs: 94,  inn: "826.1", tc: 441, po: 198, a: 231, e: 3,  dp: 52, fldPct: ".993", rfg: "4.47", rf9: "4.69", drs: 14, oaa: 11 },
  { rk: 2,  name: "Nolan Arenado",       team: "STL", pos: "3B", g: 92,  gs: 91,  inn: "803.0", tc: 298, po: 74,  a: 214, e: 3,  dp: 22, fldPct: ".990", rfg: "3.13", rf9: "3.23", drs: 12, oaa: 10 },
  { rk: 3,  name: "Trea Turner",         team: "PHI", pos: "SS", g: 98,  gs: 97,  inn: "858.2", tc: 458, po: 168, a: 278, e: 6,  dp: 61, fldPct: ".987", rfg: "4.55", rf9: "4.68", drs: 11, oaa: 9  },
  { rk: 4,  name: "Cody Bellinger",      team: "NYY", pos: "CF", g: 88,  gs: 85,  inn: "751.1", tc: 231, po: 225, a: 4,   e: 2,  dp: 1,  fldPct: ".991", rfg: "2.60", rf9: "2.72", drs: 10, oaa: 12 },
  { rk: 5,  name: "Masataka Yoshida",    team: "BOS", pos: "LF", g: 91,  gs: 89,  inn: "783.0", tc: 188, po: 183, a: 3,   e: 2,  dp: 0,  fldPct: ".989", rfg: "2.04", rf9: "2.10", drs: 8,  oaa: 7  },
  { rk: 6,  name: "Adalberto Mondesi",   team: "KC",  pos: "SS", g: 88,  gs: 86,  inn: "761.2", tc: 412, po: 154, a: 249, e: 7,  dp: 55, fldPct: ".983", rfg: "4.58", rf9: "4.76", drs: 9,  oaa: 8  },
  { rk: 7,  name: "Ke'Bryan Hayes",      team: "PIT", pos: "3B", g: 94,  gs: 93,  inn: "824.1", tc: 304, po: 80,  a: 215, e: 4,  dp: 24, fldPct: ".987", rfg: "3.17", rf9: "3.27", drs: 13, oaa: 11 },
  { rk: 8,  name: "Garrett Mitchell",    team: "MIL", pos: "CF", g: 85,  gs: 82,  inn: "724.0", tc: 214, po: 210, a: 2,   e: 2,  dp: 0,  fldPct: ".991", rfg: "2.55", rf9: "2.61", drs: 9,  oaa: 10 },
  { rk: 9,  name: "Brendan Donovan",     team: "STL", pos: "2B", g: 90,  gs: 87,  inn: "768.2", tc: 398, po: 177, a: 212, e: 4,  dp: 47, fldPct: ".990", rfg: "4.32", rf9: "4.48", drs: 7,  oaa: 6  },
  { rk: 10, name: "Xander Bogaerts",     team: "SD",  pos: "SS", g: 91,  gs: 89,  inn: "787.1", tc: 427, po: 159, a: 257, e: 7,  dp: 59, fldPct: ".984", rfg: "4.57", rf9: "4.72", drs: 6,  oaa: 5  },
  { rk: 11, name: "Ha-Seong Kim",        team: "SD",  pos: "2B", g: 89,  gs: 87,  inn: "771.0", tc: 421, po: 189, a: 225, e: 4,  dp: 49, fldPct: ".990", rfg: "4.65", rf9: "4.80", drs: 11, oaa: 9  },
  { rk: 12, name: "Riley Greene",        team: "DET", pos: "CF", g: 92,  gs: 90,  inn: "795.1", tc: 236, po: 230, a: 4,   e: 2,  dp: 0,  fldPct: ".992", rfg: "2.54", rf9: "2.61", drs: 8,  oaa: 7  },
  { rk: 13, name: "Luis Garcia Jr.",     team: "HOU", pos: "2B", g: 87,  gs: 85,  inn: "752.2", tc: 388, po: 172, a: 208, e: 5,  dp: 44, fldPct: ".987", rfg: "4.36", rf9: "4.54", drs: 5,  oaa: 4  },
  { rk: 14, name: "Steven Kwan",         team: "CLE", pos: "LF", g: 96,  gs: 94,  inn: "828.0", tc: 193, po: 188, a: 3,   e: 2,  dp: 1,  fldPct: ".990", rfg: "1.99", rf9: "2.06", drs: 9,  oaa: 8  },
  { rk: 15, name: "Jake Burger",         team: "MIA", pos: "3B", g: 91,  gs: 89,  inn: "789.1", tc: 289, po: 72,  a: 207, e: 6,  dp: 19, fldPct: ".979", rfg: "3.07", rf9: "3.19", drs: 4,  oaa: 3  },
  { rk: 16, name: "Zach Neto",           team: "LAA", pos: "SS", g: 93,  gs: 91,  inn: "803.2", tc: 438, po: 162, a: 264, e: 8,  dp: 58, fldPct: ".982", rfg: "4.59", rf9: "4.74", drs: 6,  oaa: 5  },
  { rk: 17, name: "Jonathan India",      team: "CIN", pos: "2B", g: 88,  gs: 86,  inn: "762.0", tc: 379, po: 168, a: 203, e: 5,  dp: 43, fldPct: ".987", rfg: "4.22", rf9: "4.38", drs: 5,  oaa: 4  },
  { rk: 18, name: "Anthony Volpe",       team: "NYY", pos: "SS", g: 97,  gs: 96,  inn: "851.1", tc: 451, po: 166, a: 273, e: 8,  dp: 63, fldPct: ".982", rfg: "4.53", rf9: "4.67", drs: 7,  oaa: 6  },
  { rk: 19, name: "Daulton Varsho",      team: "TOR", pos: "CF", g: 87,  gs: 85,  inn: "749.0", tc: 219, po: 213, a: 4,   e: 2,  dp: 0,  fldPct: ".991", rfg: "2.49", rf9: "2.59", drs: 7,  oaa: 6  },
  { rk: 20, name: "Evan Carter",         team: "TEX", pos: "LF", g: 84,  gs: 81,  inn: "718.2", tc: 177, po: 173, a: 2,   e: 2,  dp: 0,  fldPct: ".989", rfg: "2.08", rf9: "2.18", drs: 5,  oaa: 4  },
  { rk: 21, name: "Colt Keith",          team: "DET", pos: "2B", g: 91,  gs: 89,  inn: "789.0", tc: 403, po: 181, a: 215, e: 5,  dp: 48, fldPct: ".988", rfg: "4.35", rf9: "4.49", drs: 6,  oaa: 5  },
  { rk: 22, name: "JT Realmuto",         team: "PHI", pos: "C",  g: 88,  gs: 84,  inn: "746.1", tc: 631, po: 595, a: 28,  e: 5,  dp: 5,  fldPct: ".992", rfg: "7.09", rf9: "7.27", drs: 10, oaa: 8  },
];

/* ─────────────────────────────────────────────
   Glossary data
───────────────────────────────────────────── */
const PITCHING_GLOSSARY = [
  { abbr: "POS", def: "Position" },
  { abbr: "GP", def: "Games Played" },
  { abbr: "GS", def: "Games Started" },
  { abbr: "QS", def: "Quality Starts" },
  { abbr: "ERA", def: "Earned Run Average" },
  { abbr: "W", def: "Wins" },
  { abbr: "L", def: "Losses" },
  { abbr: "SV", def: "Saves" },
  { abbr: "HLD", def: "Holds" },
  { abbr: "IP", def: "Innings Pitched" },
  { abbr: "H", def: "Hits" },
  { abbr: "ER", def: "Earned Runs" },
  { abbr: "HR", def: "Home Runs" },
  { abbr: "BB", def: "Walks" },
  { abbr: "K", def: "Strikeouts" },
  { abbr: "K/9", def: "Strikeouts Per 9 Innings" },
  { abbr: "WAR", def: "Wins Above Replacement" },
  { abbr: "WHIP", def: "Walks Plus Hits Per Inning Pitched" },
];

const BATTING_GLOSSARY = [
  { abbr: "POS", def: "Position" },
  { abbr: "G", def: "Games Played" },
  { abbr: "AB", def: "At Bats" },
  { abbr: "R", def: "Runs Scored" },
  { abbr: "H", def: "Hits" },
  { abbr: "2B", def: "Doubles" },
  { abbr: "3B", def: "Triples" },
  { abbr: "HR", def: "Home Runs" },
  { abbr: "RBI", def: "Runs Batted In" },
  { abbr: "SB", def: "Stolen Bases" },
  { abbr: "BB", def: "Walks" },
  { abbr: "SO", def: "Strikeouts" },
  { abbr: "AVG", def: "Batting Average" },
  { abbr: "OBP", def: "On-Base Percentage" },
  { abbr: "SLG", def: "Slugging Percentage" },
  { abbr: "OPS", def: "On-Base Plus Slugging" },
  { abbr: "WAR", def: "Wins Above Replacement" },
];

const FIELDING_GLOSSARY = [
  { abbr: "POS", def: "Position" },
  { abbr: "G", def: "Games Played" },
  { abbr: "GS", def: "Games Started" },
  { abbr: "INN", def: "Innings Played" },
  { abbr: "TC", def: "Total Chances" },
  { abbr: "PO", def: "Putouts" },
  { abbr: "A", def: "Assists" },
  { abbr: "E", def: "Errors" },
  { abbr: "DP", def: "Double Plays" },
  { abbr: "FLD%", def: "Fielding Percentage" },
  { abbr: "RF/G", def: "Range Factor Per Game" },
  { abbr: "RF/9", def: "Range Factor Per 9 Innings" },
  { abbr: "DRS", def: "Defensive Runs Saved" },
  { abbr: "OAA", def: "Outs Above Average" },
];

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const INITIAL_ROWS = 11;
const SEASONS = ["2026 Regular Season", "2025 Regular Season", "2024 Regular Season"];
const TEAMS = ["All MLB", "AL East", "AL Central", "AL West", "NL East", "NL Central", "NL West"];

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FilterDropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="mlb-stats__filter-wrap">
      <select
        className="mlb-stats__filter-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={value}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <span className="mlb-stats__filter-chevron" aria-hidden="true">
        <ChevronDown />
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Table sub-components
───────────────────────────────────────────── */
function PitchingTable({ rows }: { rows: PitchingRow[] }) {
  return (
    <div className="mlb-stats__table-scroll">
      <table className="mlb-stats__table">
        <thead>
          <tr>
            <th className="mlb-stats__th mlb-stats__th--rk">RK</th>
            <th className="mlb-stats__th mlb-stats__th--name">NAME</th>
            <th className="mlb-stats__th">TEAM</th>
            <th className="mlb-stats__th">POS</th>
            <th className="mlb-stats__th">GP</th>
            <th className="mlb-stats__th">GS</th>
            <th className="mlb-stats__th">QS</th>
            <th className="mlb-stats__th mlb-stats__th--accent">ERA</th>
            <th className="mlb-stats__th">W</th>
            <th className="mlb-stats__th">L</th>
            <th className="mlb-stats__th">SV</th>
            <th className="mlb-stats__th">HLD</th>
            <th className="mlb-stats__th">IP</th>
            <th className="mlb-stats__th">H</th>
            <th className="mlb-stats__th">ER</th>
            <th className="mlb-stats__th">HR</th>
            <th className="mlb-stats__th">BB</th>
            <th className="mlb-stats__th">K</th>
            <th className="mlb-stats__th">K/9</th>
            <th className="mlb-stats__th mlb-stats__th--accent">WAR</th>
            <th className="mlb-stats__th">WHIP</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.rk} className="mlb-stats__tr">
              <td className="mlb-stats__td mlb-stats__td--rk">{row.rk}</td>
              <td className="mlb-stats__td mlb-stats__td--name">
                <Link href={`/mlb/player/${nameToSlug(row.name)}`} className="mlb-stats__player-link">{row.name}</Link>
              </td>
              <td className="mlb-stats__td">{row.team}</td>
              <td className="mlb-stats__td">{row.pos}</td>
              <td className="mlb-stats__td">{row.gp}</td>
              <td className="mlb-stats__td">{row.gs}</td>
              <td className="mlb-stats__td">{row.qs}</td>
              <td className="mlb-stats__td mlb-stats__td--accent">{row.era}</td>
              <td className="mlb-stats__td">{row.w}</td>
              <td className="mlb-stats__td">{row.l}</td>
              <td className="mlb-stats__td">{row.sv}</td>
              <td className="mlb-stats__td">{row.hld}</td>
              <td className="mlb-stats__td">{row.ip}</td>
              <td className="mlb-stats__td">{row.h}</td>
              <td className="mlb-stats__td">{row.er}</td>
              <td className="mlb-stats__td">{row.hr}</td>
              <td className="mlb-stats__td">{row.bb}</td>
              <td className="mlb-stats__td">{row.k}</td>
              <td className="mlb-stats__td">{row.k9}</td>
              <td className="mlb-stats__td mlb-stats__td--accent">{row.war}</td>
              <td className="mlb-stats__td">{row.whip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BattingTable({ rows }: { rows: BattingRow[] }) {
  return (
    <div className="mlb-stats__table-scroll">
      <table className="mlb-stats__table">
        <thead>
          <tr>
            <th className="mlb-stats__th mlb-stats__th--rk">RK</th>
            <th className="mlb-stats__th mlb-stats__th--name">NAME</th>
            <th className="mlb-stats__th">TEAM</th>
            <th className="mlb-stats__th">POS</th>
            <th className="mlb-stats__th">G</th>
            <th className="mlb-stats__th">AB</th>
            <th className="mlb-stats__th">R</th>
            <th className="mlb-stats__th">H</th>
            <th className="mlb-stats__th">2B</th>
            <th className="mlb-stats__th">3B</th>
            <th className="mlb-stats__th">HR</th>
            <th className="mlb-stats__th">RBI</th>
            <th className="mlb-stats__th">SB</th>
            <th className="mlb-stats__th">BB</th>
            <th className="mlb-stats__th">SO</th>
            <th className="mlb-stats__th mlb-stats__th--accent">AVG</th>
            <th className="mlb-stats__th">OBP</th>
            <th className="mlb-stats__th">SLG</th>
            <th className="mlb-stats__th mlb-stats__th--accent">OPS</th>
            <th className="mlb-stats__th mlb-stats__th--accent">WAR</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.rk} className="mlb-stats__tr">
              <td className="mlb-stats__td mlb-stats__td--rk">{row.rk}</td>
              <td className="mlb-stats__td mlb-stats__td--name">
                <Link href={`/mlb/player/${nameToSlug(row.name)}`} className="mlb-stats__player-link">{row.name}</Link>
              </td>
              <td className="mlb-stats__td">{row.team}</td>
              <td className="mlb-stats__td">{row.pos}</td>
              <td className="mlb-stats__td">{row.g}</td>
              <td className="mlb-stats__td">{row.ab}</td>
              <td className="mlb-stats__td">{row.r}</td>
              <td className="mlb-stats__td">{row.h}</td>
              <td className="mlb-stats__td">{row.doubles}</td>
              <td className="mlb-stats__td">{row.triples}</td>
              <td className="mlb-stats__td">{row.hr}</td>
              <td className="mlb-stats__td">{row.rbi}</td>
              <td className="mlb-stats__td">{row.sb}</td>
              <td className="mlb-stats__td">{row.bb}</td>
              <td className="mlb-stats__td">{row.so}</td>
              <td className="mlb-stats__td mlb-stats__td--accent">{row.avg}</td>
              <td className="mlb-stats__td">{row.obp}</td>
              <td className="mlb-stats__td">{row.slg}</td>
              <td className="mlb-stats__td mlb-stats__td--accent">{row.ops}</td>
              <td className="mlb-stats__td mlb-stats__td--accent">{row.war}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FieldingTable({ rows }: { rows: FieldingRow[] }) {
  return (
    <div className="mlb-stats__table-scroll">
      <table className="mlb-stats__table">
        <thead>
          <tr>
            <th className="mlb-stats__th mlb-stats__th--rk">RK</th>
            <th className="mlb-stats__th mlb-stats__th--name">NAME</th>
            <th className="mlb-stats__th">TEAM</th>
            <th className="mlb-stats__th">POS</th>
            <th className="mlb-stats__th">G</th>
            <th className="mlb-stats__th">GS</th>
            <th className="mlb-stats__th">INN</th>
            <th className="mlb-stats__th">TC</th>
            <th className="mlb-stats__th">PO</th>
            <th className="mlb-stats__th">A</th>
            <th className="mlb-stats__th">E</th>
            <th className="mlb-stats__th">DP</th>
            <th className="mlb-stats__th mlb-stats__th--accent">FLD%</th>
            <th className="mlb-stats__th">RF/G</th>
            <th className="mlb-stats__th">RF/9</th>
            <th className="mlb-stats__th mlb-stats__th--accent">DRS</th>
            <th className="mlb-stats__th mlb-stats__th--accent">OAA</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.rk} className="mlb-stats__tr">
              <td className="mlb-stats__td mlb-stats__td--rk">{row.rk}</td>
              <td className="mlb-stats__td mlb-stats__td--name">
                <Link href={`/mlb/player/${nameToSlug(row.name)}`} className="mlb-stats__player-link">{row.name}</Link>
              </td>
              <td className="mlb-stats__td">{row.team}</td>
              <td className="mlb-stats__td">{row.pos}</td>
              <td className="mlb-stats__td">{row.g}</td>
              <td className="mlb-stats__td">{row.gs}</td>
              <td className="mlb-stats__td">{row.inn}</td>
              <td className="mlb-stats__td">{row.tc}</td>
              <td className="mlb-stats__td">{row.po}</td>
              <td className="mlb-stats__td">{row.a}</td>
              <td className="mlb-stats__td">{row.e}</td>
              <td className="mlb-stats__td">{row.dp}</td>
              <td className="mlb-stats__td mlb-stats__td--accent">{row.fldPct}</td>
              <td className="mlb-stats__td">{row.rfg}</td>
              <td className="mlb-stats__td">{row.rf9}</td>
              <td className="mlb-stats__td mlb-stats__td--accent">{row.drs}</td>
              <td className="mlb-stats__td mlb-stats__td--accent">{row.oaa}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main page component
───────────────────────────────────────────── */
export function MlbStatsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("pitching");
  const [showAll, setShowAll] = useState(false);
  const [season, setSeason] = useState(SEASONS[0]);
  const [teamFilter, setTeamFilter] = useState(TEAMS[0]);

  const tabLabel: Record<Tab, string> = {
    batting: "Batting",
    pitching: "Pitching",
    fielding: "Fielding",
  };

  const titleMap: Record<Tab, string> = {
    batting: "MLB Player Batting Stats 2026",
    pitching: "MLB Player Pitching Stats 2026",
    fielding: "MLB Player Fielding Stats 2026",
  };

  const allRows = {
    batting: BATTING,
    pitching: PITCHING,
    fielding: FIELDING,
  };

  const currentRows = allRows[activeTab];
  const visibleRows = showAll ? currentRows : currentRows.slice(0, INITIAL_ROWS);
  const glossary = activeTab === "batting" ? BATTING_GLOSSARY : activeTab === "pitching" ? PITCHING_GLOSSARY : FIELDING_GLOSSARY;

  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    setShowAll(false);
  }

  return (
    <div className="mlb-stats-page">
      {/* ── Page header ──────────────────────────────── */}
      <div className="mlb-stats__header">
        <h1 className="mlb-stats__title">{titleMap[activeTab]}</h1>
        <div className="mlb-stats__header-right">
          <FilterDropdown
            value="Team Statistics"
            options={["Team Statistics", "Individual Leaders"]}
            onChange={() => {}}
          />
        </div>
      </div>

      {/* ── Tab nav ──────────────────────────────────── */}
      <nav className="mlb-stats__tabs" aria-label="Stats categories">
        {(["batting", "pitching", "fielding"] as Tab[]).map((tab) => (
          <button
            key={tab}
            className={`mlb-stats__tab${activeTab === tab ? " mlb-stats__tab--active" : ""}`}
            onClick={() => handleTabChange(tab)}
            aria-pressed={activeTab === tab}
          >
            {tabLabel[tab]}
          </button>
        ))}
      </nav>

      {/* ── Filters row ──────────────────────────────── */}
      <div className="mlb-stats__filters">
        <FilterDropdown value={season} options={SEASONS} onChange={setSeason} />
        <FilterDropdown value={teamFilter} options={TEAMS} onChange={setTeamFilter} />
      </div>

      {/* ── Stats table ──────────────────────────────── */}
      <div className="mlb-stats__table-wrap">
        {activeTab === "pitching" && <PitchingTable rows={visibleRows as PitchingRow[]} />}
        {activeTab === "batting" && <BattingTable rows={visibleRows as BattingRow[]} />}
        {activeTab === "fielding" && <FieldingTable rows={visibleRows as FieldingRow[]} />}

        {/* Show more */}
        {!showAll && currentRows.length > INITIAL_ROWS && (
          <div className="mlb-stats__showmore-wrap">
            <button
              className="mlb-stats__showmore"
              onClick={() => setShowAll(true)}
              aria-label={`Show all ${currentRows.length} ${tabLabel[activeTab].toLowerCase()} stats`}
            >
              Show More
            </button>
          </div>
        )}
      </div>

      {/* ── Info + Glossary ──────────────────────────── */}
      <div className="mlb-stats__footer-box">
        <div className="mlb-stats__info-banner" role="note">
          <svg className="mlb-stats__info-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="8.25" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 8v5M9 6v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>
            Statistics are updated weekly.&nbsp;
            <span className="mlb-stats__info-em">Player statistics refresh every week using official MLB data sources.</span>
          </span>
        </div>

        <section className="mlb-stats__glossary" aria-label="Stats glossary">
          <h2 className="mlb-stats__glossary-title">GLOSSARY</h2>
          <dl className="mlb-stats__glossary-grid">
            {glossary.map(({ abbr, def }) => (
              <div key={abbr} className="mlb-stats__glossary-item">
                <dt className="mlb-stats__glossary-abbr">{abbr}:</dt>
                <dd className="mlb-stats__glossary-def">{def}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
