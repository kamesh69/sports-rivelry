import Image from "next/image";
import Link from "next/link";
import type {
  LiveGame,
  MediaAsset,
  PlayerStatLine,
  ScoreboardGame,
  ScoreTeam,
} from "@/lib/types";
import { TeamBadge } from "@/components/sport-page/atoms";
import { ScoreboardStrip } from "@/components/sport-page/scoreboard-strip";

interface SportHeroProps {
  image: MediaAsset;
  pillPrimary: string;
  pillSecondary?: string;
  headline: string;
  deck: string;
  author: string;
  date: string;
  readTime: number;
  href: string;
  liveGame?: LiveGame;
  playerSpotlight?: PlayerStatLine;
  scoreboardLabel: string;
  scoreboard: ScoreboardGame[];
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function SportHero({
  image,
  pillPrimary,
  pillSecondary,
  headline,
  deck,
  author,
  date,
  readTime,
  href,
  liveGame,
  playerSpotlight,
  scoreboardLabel,
  scoreboard,
}: SportHeroProps) {
  return (
    <section className="sp-heroblock" aria-label="Top story">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        className="sp-heroblock__bg"
        sizes="100vw"
      />

      <div className="sp-shell">
        <div className="sp-hero">
          <div className="sp-hero__body">
            <div className="sp-pill-row">
              <span className="sp-pill">{pillPrimary}</span>
              {pillSecondary ? <span className="sp-pill-note">{pillSecondary}</span> : null}
            </div>
            <h1 className="sp-hero__title">{headline}</h1>
            <p className="sp-hero__deck">{deck}</p>
            <div className="sp-hero__meta">
              <span className="sp-avatar">{initials(author)}</span>
              <span className="sp-hero__byline">
                <strong>{author}</strong>
                <br />
                <span>
                  {date} · {readTime} min read
                </span>
              </span>
            </div>
            <Link href={href} className="sp-btn">
              Read Full Story
              <span className="sp-btn__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>

          <div className="sp-hero__aside">
            {liveGame ? <LiveScoreCard game={liveGame} /> : null}
            {playerSpotlight ? <PlayerSpotlightCard player={playerSpotlight} /> : null}
          </div>
        </div>
      </div>

      <ScoreboardStrip label={scoreboardLabel} games={scoreboard} />
    </section>
  );
}

function ScoreRow({ team }: { team: ScoreTeam }) {
  return (
    <div className={`sp-scoreteam${team.isWinner === false ? " sp-scoreteam--lost" : ""}`}>
      <TeamBadge team={team} />
      <span className="sp-scoreteam__name">
        {team.shortName}
        {team.record ? <small>{team.record}</small> : null}
      </span>
      <span className="sp-scoreteam__score">{team.score ?? "-"}</span>
    </div>
  );
}

export function LiveScoreCard({ game }: { game: LiveGame }) {
  return (
    <div className="sp-livecard">
      <div className="sp-livecard__top">
        {game.isLive ? (
          <span className="sp-live-badge">
            <span className="sp-live-dot" />
            {game.status}
          </span>
        ) : (
          <span className="sp-live-badge" style={{ color: "var(--sp-muted)" }}>
            {game.status}
          </span>
        )}
        {game.clock ? <span className="sp-livecard__clock">{game.clock}</span> : null}
      </div>
      <div className="sp-livecard__rows">
        <ScoreRow team={game.away} />
        <ScoreRow team={game.home} />
      </div>
      {game.note ? <p className="sp-livecard__note">{game.note}</p> : null}
    </div>
  );
}

export function PlayerSpotlightCard({ player }: { player: PlayerStatLine }) {
  return (
    <div className="sp-spotlight">
      <div className="sp-spotlight__head">
        <span className="sp-spotlight__photo">{player.monogram}</span>
        <h3 className="sp-spotlight__name">
          {player.player}
          <small>{player.meta}</small>
        </h3>
      </div>
      <div className="sp-spotlight__stats">
        {player.stats.map((stat) => (
          <div key={stat.label} className="sp-stat">
            <span className="sp-stat__value">{stat.value}</span>
            <span className="sp-stat__label">{stat.label}</span>
          </div>
        ))}
      </div>
      {player.footnote ? <p className="sp-spotlight__foot">{player.footnote}</p> : null}
    </div>
  );
}
