import type { Matchup, SportPageData, TeamStanding } from "@/lib/types";
import { SectionHead, TeamBadge } from "@/components/sport-page/atoms";

const TREND_SYMBOL: Record<TeamStanding["trend"], string> = {
  up: "▲",
  down: "▼",
  flat: "—",
};

function MatchupCard({ matchup }: { matchup: Matchup }) {
  const [away, home] = matchup.teams;
  const timeLabel = matchup.isLive ? matchup.clock || matchup.status : matchup.status;

  return (
    <div className="sp-matchup-card">
      <div className="sp-matchup-card__head">
        {matchup.isLive ? (
          <span className="sp-matchup-card__live">
            <span className="sp-live-dot" aria-hidden="true" />
            LIVE
          </span>
        ) : (
          <span />
        )}
        <span className="sp-matchup-card__time">{timeLabel}</span>
      </div>

      <div className="sp-matchup-card__teams">
        <div className="sp-matchup-card__team">
          <TeamBadge team={away} size="md" />
          <span className="sp-matchup-card__score">
            {away.score !== undefined ? away.score : away.shortName}
          </span>
        </div>
        {matchup.isLive ? <span className="sp-matchup-card__vs">vs</span> : null}
        <div className="sp-matchup-card__team">
          <TeamBadge team={home} size="md" />
          <span className="sp-matchup-card__score">
            {home.score !== undefined ? home.score : home.shortName}
          </span>
        </div>
      </div>

      <div className="sp-matchup-card__details">
        {matchup.seriesNote ? <p>{matchup.seriesNote}</p> : null}
        {matchup.venue ? <p>{matchup.venue}</p> : null}
        {matchup.network ? <p>{matchup.network}</p> : null}
        {!matchup.venue && !matchup.network && matchup.info ? <p>{matchup.info}</p> : null}
      </div>

      {matchup.spread || matchup.overUnder ? (
        <div className="sp-matchup-card__odds">
          {matchup.spread ? <span>{matchup.spread}</span> : null}
          {matchup.overUnder ? <span>{matchup.overUnder}</span> : null}
        </div>
      ) : null}
    </div>
  );
}

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
        <div className="sp-twocol__col">
          <SectionHead title={matchupsLabel} href={scheduleHref} actionLabel="Full Schedule" />
          <div className="sp-matchups-panel">
            <div className="sp-matchups-row">
              {matchups.map((matchup, index) => (
                <MatchupCard key={index} matchup={matchup} />
              ))}
            </div>
          </div>
        </div>

        <div className="sp-twocol__col">
          <SectionHead title={rankingsLabel} href={rankingsHref} actionLabel="See Full Rankings" />
          <div className="sp-panel sp-panel--rankings">
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
