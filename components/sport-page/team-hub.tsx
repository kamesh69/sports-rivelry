import type { SportPageData } from "@/lib/types";
import { SectionHead, TeamBadge } from "@/components/sport-page/atoms";

export function TeamHub({
  teamHub,
  viewAllHref,
}: {
  teamHub: NonNullable<SportPageData["teamHub"]>;
  viewAllHref: string;
}) {
  return (
    <section className="sp-section" aria-label="Team hub">
      <SectionHead title="Team Hub" href={viewAllHref}>
        <div className="sp-tabs" role="tablist">
          {teamHub.tabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`sp-tab${index === 0 ? " sp-tab--active" : ""}`}
              role="tab"
              aria-selected={index === 0}
            >
              {tab}
            </button>
          ))}
        </div>
      </SectionHead>
      <div className="sp-teamhub__track">
        {teamHub.teams.map((entry) => (
          <div key={entry.team.name} className="sp-teamcard">
            <TeamBadge team={entry.team} size="lg" />
            <span className="sp-teamcard__name">{entry.team.name}</span>
            <span className="sp-teamcard__meta">{entry.meta}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
