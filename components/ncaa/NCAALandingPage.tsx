import { Suspense } from "react";
import { NCAAHeroData, NCAAHeroSkeleton } from "@/components/ncaa/NCAAHero";
import { SportsSectionData, SportsSectionSkeleton } from "@/components/ncaa/SportCarousel";
import { ChampionshipSectionData, ChampionshipSectionSkeleton } from "@/components/ncaa/ChampionshipSection";
import { FeaturedStoriesData, FeaturedStoriesSkeleton } from "@/components/ncaa/FeaturedStories";
import { NewsRankingsSectionData, NewsRankingsSectionSkeleton } from "@/components/ncaa/NewsRankingsSection";
import { CollegeSpotlightData, CollegeSpotlightSkeleton } from "@/components/ncaa/CollegeSpotlight";
import { ConferenceSectionData, ConferenceSectionSkeleton } from "@/components/ncaa/ConferenceSection";
import { VideoHighlightsData, VideoHighlightsSkeleton } from "@/components/ncaa/VideoHighlights";
import { NewsletterSection } from "@/components/ncaa/NewsletterSection";

/**
 * NCAA landing page (`/ncaa`).
 *
 * Every data-driven section is its own `Suspense` boundary backed by an
 * async "*Data" loader that calls the service layer (`services/ncaa*.ts`).
 * This keeps sections independently streamable, gives each one a real
 * skeleton fallback, and means swapping mock data for a live API later only
 * touches the service layer — no component or page code needs to change.
 */
export function NCAALandingPage() {
  return (
    <div className="ncaa-page">
      <Suspense fallback={<NCAAHeroSkeleton />}>
        <NCAAHeroData />
      </Suspense>

      <div className="ncaa-shell ncaa-sections">
        <Suspense fallback={<SportsSectionSkeleton />}>
          <SportsSectionData />
        </Suspense>

        <Suspense fallback={<ChampionshipSectionSkeleton />}>
          <ChampionshipSectionData />
        </Suspense>

        <Suspense fallback={<FeaturedStoriesSkeleton />}>
          <FeaturedStoriesData />
        </Suspense>

        <Suspense fallback={<NewsRankingsSectionSkeleton />}>
          <NewsRankingsSectionData />
        </Suspense>

        <Suspense fallback={<CollegeSpotlightSkeleton />}>
          <CollegeSpotlightData />
        </Suspense>

        <Suspense fallback={<ConferenceSectionSkeleton />}>
          <ConferenceSectionData />
        </Suspense>

        <Suspense fallback={<VideoHighlightsSkeleton />}>
          <VideoHighlightsData />
        </Suspense>
      </div>

      <NewsletterSection />
    </div>
  );
}
