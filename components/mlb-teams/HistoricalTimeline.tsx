"use client";

import { useRef } from "react";
import type { TimelineEvent } from "@/lib/mlb-team-types";

interface HistoricalTimelineProps {
  events: TimelineEvent[];
}

export function HistoricalTimeline({ events }: HistoricalTimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    trackRef.current?.scrollBy({ left: -220, behavior: "smooth" });
  };

  const scrollRight = () => {
    trackRef.current?.scrollBy({ left: 220, behavior: "smooth" });
  };

  return (
    <div className="td-timeline-bg">
      <div className="td-shell">
        <div className="td-section-head">
          <h2 className="td-section-title">MLB Historical Timeline</h2>
        </div>

        <div
          ref={trackRef}
          className="td-timeline-track"
          role="list"
          aria-label="MLB historical timeline"
        >
          {events.map((event) => (
            <div
              key={event.year}
              className="td-timeline-item"
              role="listitem"
            >
              <span className="td-timeline-year">{event.year}</span>
              <h3 className="td-timeline-title">{event.title}</h3>
              <p className="td-timeline-desc">{event.description}</p>
            </div>
          ))}
        </div>

        <div className="td-timeline-arrows" aria-hidden="true">
          <button
            type="button"
            className="td-carousel__arrow"
            onClick={scrollLeft}
            aria-label="Scroll timeline left"
          >
            ‹
          </button>
          <button
            type="button"
            className="td-carousel__arrow"
            onClick={scrollRight}
            aria-label="Scroll timeline right"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
