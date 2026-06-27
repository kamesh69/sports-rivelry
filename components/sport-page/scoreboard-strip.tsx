import type { ScoreboardGame, ScoreTeam } from "@/lib/types";
import { TeamBadge } from "@/components/sport-page/atoms";

function ScoreRow({ team, opponent }: { team: ScoreTeam; opponent: ScoreTeam }) {
  const isWinner =
    team.isWinner !== false &&
    opponent.isWinner === false &&
    team.score !== undefined;

  return (
    <div className={`sp-gamechip__row${team.isWinner === false ? " sp-gamechip__row--lost" : ""}`}>
      <span className="sp-gamechip__team">
        <TeamBadge team={team} size="xs" />
        {team.shortName}
      </span>
      <span className="sp-gamechip__right">
        <span className="sp-gamechip__score">{team.score ?? ""}</span>
        {isWinner ? <span className="sp-gamechip__caret">▸</span> : null}
      </span>
    </div>
  );
}

export function ScoreboardStrip({
  label,
  games,
}: {
  label: string;
  games: ScoreboardGame[];
}) {
  if (!games.length) {
    return null;
  }

  return (
    <div className="sp-strip">
      <div className="sp-shell sp-strip__inner">
        <div className="sp-strip__label">{label}</div>
        <div className="sp-strip__games">
          {games.map((game, index) => (
            <div key={index} className="sp-gamechip">
              <span
                className={`sp-gamechip__status${game.isLive ? " sp-gamechip__status--live" : ""}`}
              >
                {game.detail ? `${game.status} · ${game.detail}` : game.status}
              </span>
              <ScoreRow team={game.away} opponent={game.home} />
              <ScoreRow team={game.home} opponent={game.away} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
