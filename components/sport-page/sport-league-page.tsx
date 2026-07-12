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
import { MLB_NEWS_PATH } from "@/lib/navigation";

interface SportLeaguePageProps {
  hub: SportHub;
  data: SportPageData;
  articles: Article[];
  trending: Article[];
  featuredStories?: Article[];
  headlines?: Article[];
  latestStories?: Article[];
  trendingStories?: Article[];
}

export function SportLeaguePage({
  hub,
  data,
  articles,
  trending,
  featuredStories,
  headlines,
  latestStories,
  trendingStories,
}: SportLeaguePageProps) {
  const pool = dedupeByKey(articles, (article) => article.id);
  const curatedFeatured = dedupeByKey(featuredStories || pool, (article) => article.id);
  const curatedHeadlines = dedupeByKey(headlines || pool, (article) => article.id).slice(0, 10);
  const curatedTrending = dedupeByKey(
    trendingStories || [...pool, ...trending],
    (article) => article.id,
  ).slice(0, 5);
  const curatedLatest = dedupeByKey(latestStories || pool, (article) => article.id).slice(0, 5);
  const featuredLead = curatedFeatured[0];
  const featuredGrid = curatedFeatured.slice(1, 4);

  const sportHref = `/${hub.slug}`;
  const statsHref = hub.slug === "mlb" ? `/${hub.slug}/stats` : sportHref;
  const teamsHref = hub.slug === "mlb" ? `/${hub.slug}/teams` : sportHref;
  const newsHref = hub.slug === "mlb" ? MLB_NEWS_PATH : sportHref;

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
            headlines={curatedHeadlines}
            viewAllHref={newsHref}
          />
        ) : null}

        <TrendingToday articles={curatedTrending} viewAllHref={newsHref} />

        {data.teamHub ? <TeamHub teamHub={data.teamHub} viewAllHref={teamsHref} /> : null}

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
          viewAllHref={statsHref}
          sportSlug={hub.slug}
        />

        <MediaRow
          videos={data.videoHighlights}
          opinions={data.opinions}
          latest={curatedLatest}
          viewAllHref={newsHref}
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
