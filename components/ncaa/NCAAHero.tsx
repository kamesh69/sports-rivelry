import Link from "next/link";
import type { NcaaHeroContent } from "@/lib/ncaa-types";
import { getHeroContent } from "@/services/ncaa.service";
import { NcaaChampionshipSeriesLogo } from "@/components/ncaa/NcaaChampionshipLogos";

interface NCAAHeroProps {
  content: NcaaHeroContent;
}

/** Full-width NCAA hero: background image, dark overlay, headline/CTA, and Championship Series stats panel. */
export function NCAAHero({ content }: NCAAHeroProps) {
  return (
    <section className="ncaa-hero" aria-label="NCAA highlights">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ncaa-hero__bg" src={content.image.src} alt="" aria-hidden="true" />

      <div className="ncaa-hero__inner">
        <div className="ncaa-hero__content">
          <span className="ncaa-hero__eyebrow">{content.eyebrow}</span>
          <h1 className="ncaa-hero__title">{content.headline}</h1>
          <p className="ncaa-hero__desc">{content.description}</p>
          <Link href={content.ctaHref} className="ncaa-hero__cta">
            {content.ctaLabel}
            <span className="ncaa-hero__cta-arrow" aria-hidden="true">›</span>
          </Link>
        </div>

        <aside className="ncaa-hero__panel" aria-label="NCAA Championship Series">
          <div className="ncaa-hero__panel-head">
            <div className="ncaa-hero__panel-brand">
              <NcaaChampionshipSeriesLogo />
              <span className="ncaa-hero__panel-title">NCAA Championship Series</span>
            </div>
            <span className="ncaa-hero__panel-season">{content.seasonLabel}</span>
          </div>

          <div className="ncaa-hero__panel-stats" role="list">
            {content.stats.map((stat) => (
              <div key={stat.label} className="ncaa-hero__panel-stat" role="listitem">
                <span className="ncaa-hero__panel-stat-value">{stat.value}</span>
                <span className="ncaa-hero__panel-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          <p className="ncaa-hero__panel-tagline">{content.tagline}</p>
        </aside>
      </div>
    </section>
  );
}

/** Skeleton placeholder matching the hero's layout, shown while hero content streams in. */
export function NCAAHeroSkeleton() {
  return (
    <section className="ncaa-hero ncaa-hero--skeleton" aria-hidden="true">
      <div className="ncaa-hero__inner">
        <div className="ncaa-hero__content">
          <span className="ncaa-skeleton-block ncaa-skeleton-block--pill" />
          <span className="ncaa-skeleton-block ncaa-skeleton-block--title" />
          <span className="ncaa-skeleton-block ncaa-skeleton-block--text" />
          <span className="ncaa-skeleton-block ncaa-skeleton-block--cta" />
        </div>
        <div className="ncaa-hero__panel">
          <span className="ncaa-skeleton-block ncaa-skeleton-block--panel" />
        </div>
      </div>
    </section>
  );
}

/** Server-side data loader: fetches hero content from the service layer and renders the hero. */
export async function NCAAHeroData() {
  const content = await getHeroContent();
  return <NCAAHero content={content} />;
}
