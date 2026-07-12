import { MlbStatsPage } from "@/components/mlb-stats-page";
import { fetchMlbStatsTables } from "@/services/mlb-stats.service";

export async function MlbStatsPageLoader() {
  const tables = await fetchMlbStatsTables();

  return <MlbStatsPage tables={tables} />;
}
