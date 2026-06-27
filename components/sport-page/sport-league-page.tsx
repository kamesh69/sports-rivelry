import type { Article, SportHub, SportPageData } from "@/lib/types";
import { dedupeByKey } from "@/lib/utils";
import { SportHero } from "@/components/sport-page/sport-hero";
import { FeaturedStories } from "@/components/sport-page/featured-stories";
import { TrendingToday } from "@/components/sport-page/trending-today";
import { TeamHub } from "@/components/sport-page/team-hub";
import { MatchupsAndRankings } from "@/components/sport-page/matchups-rankings";
import { StatLeaders } from "@/components/sport-page/stat-leaders";
import { MediaRow } from "@/components/sport-page/media-row";
import { SportNewsletterBand } from "@/components/sport-page/sport-newsletter-band";

interface SportLeaguePageProps {
  hub: SportHub;
  data: SportPageData;
  articles: Article[];
  trending: Article[];
}

export function SportLeaguePage({ hub, data, articles, trending }: SportLeaguePageProps) {
  const pool = dedupeByKey(articles, (article) => article.id);
  const featuredLead = pool[0];
  const featuredGrid = pool.slice(1, 4);
  const headlines = pool.slice(0, 10);
  const trendingPool = dedupeByKey([...pool, ...trending], (article) => article.id).slice(0, 5);
  const latestNews = pool.slice(0, 5);

  const sportHref = `/${hub.slug}`;

  return (
    <div className="sport-theme">
      <SportHero
        image={data.hero.image}
        pillPrimary={data.hero.pillPrimary}
        pillSecondary={data.hero.pillSecondary}
        headline={data.hero.headline}
        deck={data.hero.deck}
        author={data.hero.author}
        date={data.hero.date}
        readTime={data.hero.readTime}
        href={data.hero.href}
        liveGame={data.liveGame}
        playerSpotlight={data.playerSpotlight}
        scoreboardLabel={data.scoreboardLabel}
        scoreboard={data.scoreboard}
      />

      <div className="sp-shell">
        {featuredLead ? (
          <FeaturedStories
            lead={featuredLead}
            grid={featuredGrid}
            headlines={headlines}
            viewAllHref={sportHref}
          />
        ) : null}

        <TrendingToday articles={trendingPool} viewAllHref={sportHref} />

        {data.teamHub ? <TeamHub teamHub={data.teamHub} viewAllHref={sportHref} /> : null}

        <MatchupsAndRankings
          matchupsLabel={data.matchupsLabel}
          matchups={data.matchups}
          rankingsLabel={data.rankingsLabel}
          rankingsColumns={data.rankingsColumns}
          rankings={data.rankings}
          scheduleHref={sportHref}
          rankingsHref={sportHref}
        />

        <StatLeaders
          label={data.analyticsLabel}
          leaders={data.statLeaders}
          viewAllHref={sportHref}
        />

        <MediaRow
          videos={data.videoHighlights}
          opinions={data.opinions}
          latest={latestNews}
          viewAllHref={sportHref}
        />
      </div>

      <SportNewsletterBand
        heading={data.newsletter.heading}
        subheading={data.newsletter.subheading}
        image={data.hero.image}
        source={`sport-${hub.slug}`}
      />
    </div>
  );
}
