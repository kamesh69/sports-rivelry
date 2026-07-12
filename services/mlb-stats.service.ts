import {
  BATTING,
  FIELDING,
  PITCHING,
} from "@/lib/mlb-stats-data";
import type {
  BattingRow,
  FieldingRow,
  MlbStatsTables,
  PitchingRow,
} from "@/lib/mlb-stats-types";
import { getMlbStatsTables } from "@/lib/cms";

export async function fetchMlbStatsTables(): Promise<MlbStatsTables> {
  const tables = await getMlbStatsTables();

  return {
    seasonLabel: tables.seasonLabel,
    batting: (tables.batting.length ? tables.batting : BATTING) as BattingRow[],
    pitching: (tables.pitching.length ? tables.pitching : PITCHING) as PitchingRow[],
    fielding: (tables.fielding.length ? tables.fielding : FIELDING) as FieldingRow[],
  };
}
