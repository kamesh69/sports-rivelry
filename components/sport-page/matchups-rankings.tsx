import type { Matchup, SportPageData, TeamStanding } from "@/lib/types";
import { SectionHead, TeamBadge } from "@/components/sport-page/atoms";

const TREND_SYMBOL: Record<TeamStanding["trend"], string> = {
  up: "▲",
  down: "▼",
  flat: "—",
};

export function MatchupsAndRankings({
  matchupsLabel,
  matchups,
  rankingsLabel,
  rankingsColumns,
  rankings,
  scheduleHref,
  rankingsHref,
}: {
  matchupsLabel: string;
  matchups: Matchup[];
  rankingsLabel: string;
  rankingsColumns: [string, string];
  rankings: TeamStanding[];
  scheduleHref: string;
  rankingsHref: string;
}) {
  return (
    <section className="sp-section" aria-label="Matchups and rankings">
      <div className="sp-twocol">
        <div>
          <SectionHead title={matchupsLabel} href={scheduleHref} actionLabel="Full Schedule" />
          <div className="sp-panel">
            {matchups.map((matchup, index) => (
              <div key={index} className="sp-matchup">
                <div
                  className={`sp-matchup__status${
                    matchup.isLive ? " sp-matchup__status--live" : ""
                  }`}
                >
                  {matchup.isLive ? <span className="sp-live-dot" /> : null}
                  {matchup.status}
                </div>
                <div className="sp-matchup__teams">
                  {matchup.teams.map((team) => (
                    <div key={team.shortName} className="sp-matchup__team">
                      <TeamBadge team={team} size="sm" />
                      <span>{team.name}</span>
                      <span>{team.score ?? ""}</span>
                    </div>
                  ))}
                </div>
                {matchup.info ? <div className="sp-matchup__info">{matchup.info}</div> : null}
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionHead title={rankingsLabel} href={rankingsHref} actionLabel="See Full Rankings" />
          <div className="sp-panel">
            <table className="sp-rank-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Team</th>
                  <th>Record</th>
                  <th>Trend</th>
                  <th>{rankingsColumns[0]}</th>
                  <th>{rankingsColumns[1]}</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((row) => (
                  <tr key={row.rank}>
                    <td className="sp-rank-table__rank">{row.rank}</td>
                    <td>
                      <span className="sp-rank-table__team">
                        <TeamBadge team={row.team} size="sm" />
                        {row.team.shortName}
                      </span>
                    </td>
                    <td>{row.record}</td>
                    <td>
                      <span className={`sp-trend sp-trend--${row.trend}`}>
                        {TREND_SYMBOL[row.trend]} {row.trendLabel}
                      </span>
                    </td>
                    <td>{row.statA}</td>
                    <td>{row.statB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
