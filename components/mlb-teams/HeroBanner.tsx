"use client";

import { useRef } from "react";

interface HeroBannerProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const POPULAR_SEARCHES = ["Yankees", "Dodgers", "Cubs", "Red Sox", "Braves", "Astros"];

export function HeroBanner({ searchQuery, onSearchChange }: HeroBannerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChipClick(chip: string) {
    onSearchChange(chip);
    inputRef.current?.focus();
  }

  return (
    <section className="td-hero" aria-label="Teams Directory hero">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="td-hero__bg"
        src="https://picsum.photos/seed/mlb-hero/1800/700"
        alt=""
        aria-hidden="true"
      />

      <div className="td-hero__content">
        <h1 className="td-hero__title">MLB Teams Directory</h1>

        <p className="td-hero__desc">
          Browse every Major League Baseball franchise, discover team histories,
          championships, stadiums, divisions, and organizational information
          from one beautifully organized directory.
        </p>

        <div className="td-hero__search-wrap">
          <span className="td-hero__search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input
            ref={inputRef}
            type="search"
            className="td-hero__search"
            placeholder="Search teams, cities, stadiums, leagues..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search MLB teams"
          />
        </div>

        <div className="td-hero__chips" role="list" aria-label="Popular searches">
          <span className="td-hero__chips-label">Popular:</span>
          {POPULAR_SEARCHES.map((chip) => (
            <button
              key={chip}
              type="button"
              className="td-chip"
              role="listitem"
              onClick={() => handleChipClick(chip)}
              aria-label={`Search for ${chip}`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
