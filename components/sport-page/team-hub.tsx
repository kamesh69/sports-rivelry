"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { SportPageData } from "@/lib/types";
import { TeamBadge } from "@/components/sport-page/atoms";
import { getTeamRosterPath } from "@/lib/navigation";

export function TeamHub({
  teamHub,
  viewAllHref,
}: {
  teamHub: NonNullable<SportPageData["teamHub"]>;
  viewAllHref: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);

  const scrollNext = () => {
    trackRef.current?.scrollBy({ left: 260, behavior: "smooth" });
  };

  return (
    <section className="sp-section" aria-label="Team hub">
      <div className="sp-section-head sp-section-head--hub">
        <div className="sp-section-head__cluster">
          <h2 className="sp-section-head__title">Team Hub</h2>
          <div className="sp-tabs sp-tabs--inline" role="tablist">
            {teamHub.tabs.map((tab, index) => (
              <button
                key={tab}
                type="button"
                className={`sp-tab${index === activeTab ? " sp-tab--active" : ""}`}
                role="tab"
                aria-selected={index === activeTab}
                onClick={() => setActiveTab(index)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <Link href={viewAllHref} className="sp-viewall">
          View All
        </Link>
      </div>

      <div className="sp-teamhub__wrap">
        <div ref={trackRef} className="sp-teamhub__track">
          {teamHub.teams.map((entry) => {
            const card = (
              <>
                <TeamBadge team={entry.team} size="xl" />
                <span className="sp-teamcard__name">{entry.team.name}</span>
                <span className="sp-teamcard__meta">{entry.meta}</span>
                {entry.form?.length ? (
                  <div className="sp-teamcard__form" aria-label="Recent form">
                    {entry.form.map((result, index) => (
                      <span
                        key={`${entry.team.name}-${index}`}
                        className={`sp-form-letter sp-form-letter--${result.toLowerCase()}`}
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                ) : null}
              </>
            );

            if (entry.slug) {
              return (
                <Link
                  key={entry.team.name}
                  href={getTeamRosterPath(entry.slug)}
                  className="sp-teamcard sp-teamcard--link"
                  aria-label={`View ${entry.team.name}`}
                >
                  {card}
                </Link>
              );
            }

            return (
              <div key={entry.team.name} className="sp-teamcard">
                {card}
              </div>
            );
          })}
        </div>
        <button
          type="button"
          className="sp-teamhub__next"
          aria-label="Scroll teams"
          onClick={scrollNext}
        >
          ›
        </button>
      </div>
    </section>
  );
}
