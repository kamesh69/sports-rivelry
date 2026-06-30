interface LeagueOverviewProps {
  onLeagueFilter: (league: "American" | "National") => void;
}

export function LeagueOverview({ onLeagueFilter }: LeagueOverviewProps) {
  return (
    <section className="td-section" aria-label="League overview">
      <div className="td-section-head">
        <h2 className="td-section-title">League Overview</h2>
      </div>

      <div className="td-leagues__grid">
        <article className="td-league-card td-league-card--al" aria-label="American League">
          <div className="td-league-card__logo" aria-hidden="true">AL</div>
          <div className="td-league-card__body">
            <h3 className="td-league-card__title">American League</h3>
            <p className="td-league-card__sub">15 Teams · 3 Divisions</p>
            <p className="td-league-card__desc">
              Founded in 1901, the American League features powerhouse franchises with
              a rich tradition of excellence and innovation. Home to storied teams like
              the Yankees and Red Sox.
            </p>
            <button
              type="button"
              className="td-league-card__cta"
              onClick={() => onLeagueFilter("American")}
              aria-label="Explore all American League teams"
            >
              Explore All Teams →
            </button>
          </div>
        </article>

        <article className="td-league-card td-league-card--nl" aria-label="National League">
          <div className="td-league-card__logo" aria-hidden="true">NL</div>
          <div className="td-league-card__body">
            <h3 className="td-league-card__title">National League</h3>
            <p className="td-league-card__sub">15 Teams · 3 Divisions</p>
            <p className="td-league-card__desc">
              Founded in 1876, the National League is baseball&rsquo;s oldest major
              league. The NL represents baseball&rsquo;s heritage with legendary teams
              and historic rivalries that span over a century.
            </p>
            <button
              type="button"
              className="td-league-card__cta"
              onClick={() => onLeagueFilter("National")}
              aria-label="Explore all National League teams"
            >
              Explore All Teams →
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
