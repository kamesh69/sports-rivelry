"use client";

import { useRef } from "react";
import type { TimelineEvent } from "@/lib/mlb-team-types";

interface HistoricalTimelineProps {
  events: TimelineEvent[];
}

export function HistoricalTimeline({ events }: HistoricalTimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    trackRef.current?.scrollBy({ left: -240, behavior: "smooth" });
  };

  const scrollRight = () => {
    trackRef.current?.scrollBy({ left: 240, behavior: "smooth" });
  };

  return (
    <section className="td-timeline-section" aria-label="MLB historical timeline">
      <div className="td-section-head">
        <h2 className="td-section-title">MLB Historical Timeline</h2>
      </div>

      <div className="td-timeline-wrap">
        <button
          type="button"
          className="td-timeline-arrow td-timeline-arrow--left"
          onClick={scrollLeft}
          aria-label="Scroll timeline left"
        >
          ‹
        </button>

        <div
          ref={trackRef}
          className="td-timeline-track"
          role="list"
        >
          {events.map((event) => (
            <div
              key={event.year}
              className="td-timeline-item"
              role="listitem"
            >
              <span className="td-timeline-marker" aria-hidden="true" />
              <p className="td-timeline-label">{event.title}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="td-timeline-arrow td-timeline-arrow--right"
          onClick={scrollRight}
          aria-label="Scroll timeline right"
        >
          ›
        </button>
      </div>
    </section>
  );
}
