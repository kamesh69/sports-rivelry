import { NCAAHeroSkeleton } from "@/components/ncaa/NCAAHero";
import { SportsSectionSkeleton } from "@/components/ncaa/SportCarousel";
import { ChampionshipSectionSkeleton } from "@/components/ncaa/ChampionshipSection";

/** Route-level loading skeleton shown while the NCAA landing page's initial shell streams in. */
export default function NcaaLoading() {
  return (
    <div className="ncaa-page">
      <NCAAHeroSkeleton />
      <div className="ncaa-shell ncaa-sections">
        <SportsSectionSkeleton />
        <ChampionshipSectionSkeleton />
      </div>
    </div>
  );
}
