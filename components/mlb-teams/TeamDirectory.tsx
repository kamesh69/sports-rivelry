"use client";

import type { MLBTeam } from "@/lib/mlb-team-types";
import { TeamCard } from "@/components/mlb-teams/TeamCard";
import { TeamListItem } from "@/components/mlb-teams/TeamListItem";

type ViewMode = "grid" | "list";
type LeagueFilter = "All" | "American" | "National";
type DivisionFilter = "All" | "East" | "Central" | "West";

interface TeamDirectoryProps {
  teams: MLBTeam[];
  filteredTeams: MLBTeam[];
  viewMode: ViewMode;
  league: LeagueFilter;
  division: DivisionFilter;
  currentPage: number;
  pageSize: number;
  onViewModeChange: (mode: ViewMode) => void;
  onLeagueChange: (league: LeagueFilter) => void;
  onDivisionChange: (division: DivisionFilter) => void;
  onPageChange: (page: number) => void;
}

function SkeletonCard() {
  return (
    <div className="td-skeleton-card" aria-hidden="true">
      <div className="td-skeleton td-skeleton-card__img" />
      <div className="td-skeleton-card__body">
        <div className="td-skeleton td-skeleton-line td-skeleton-line--mid" />
        <div className="td-skeleton td-skeleton-line td-skeleton-line--short td-skeleton-line--sm" />
        <div className="td-skeleton td-skeleton-line td-skeleton-line--full td-skeleton-line--sm" />
      </div>
    </div>
  );
}

export function TeamDirectory({
  filteredTeams,
  viewMode,
  league,
  division,
  currentPage,
  pageSize,
  onViewModeChange,
  onLeagueChange,
  onDivisionChange,
  onPageChange,
}: TeamDirectoryProps) {
  const totalPages = Math.ceil(filteredTeams.length / pageSize);
  const pageStart = (currentPage - 1) * pageSize;
  const pageTeams = filteredTeams.slice(pageStart, pageStart + pageSize);

  const pageNumbers: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <section className="td-section" aria-label="Teams directory">
      <div className="td-section-head">
        <h2 className="td-section-title">Teams Directory</h2>
      </div>

      <div className="td-dir__controls">
        <div className="td-dir__filters" role="group" aria-label="Filter teams">
          <select
            className="td-dir__select"
            value={league}
            onChange={(e) => {
              onLeagueChange(e.target.value as LeagueFilter);
              onPageChange(1);
            }}
            aria-label="Filter by league"
          >
            <option value="All">All Leagues</option>
            <option value="American">American League</option>
            <option value="National">National League</option>
          </select>

          <select
            className="td-dir__select"
            value={division}
            onChange={(e) => {
              onDivisionChange(e.target.value as DivisionFilter);
              onPageChange(1);
            }}
            aria-label="Filter by division"
          >
            <option value="All">All Divisions</option>
            <option value="East">East</option>
            <option value="Central">Central</option>
            <option value="West">West</option>
          </select>

          <span className="td-dir__count">
            {filteredTeams.length} {filteredTeams.length === 1 ? "team" : "teams"}
          </span>
        </div>

        <div className="td-dir__toggle" role="group" aria-label="View mode">
          <button
            type="button"
            className={`td-dir__view-btn${viewMode === "grid" ? " td-dir__view-btn--active" : ""}`}
            onClick={() => onViewModeChange("grid")}
            aria-pressed={viewMode === "grid"}
            aria-label="Grid view"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
          </button>
          <button
            type="button"
            className={`td-dir__view-btn${viewMode === "list" ? " td-dir__view-btn--active" : ""}`}
            onClick={() => onViewModeChange("list")}
            aria-pressed={viewMode === "list"}
            aria-label="List view"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {filteredTeams.length === 0 ? (
        <div className="td-empty" role="status" aria-live="polite">
          <span className="td-empty__icon" aria-hidden="true">⚾</span>
          <p className="td-empty__title">No teams found</p>
          <p className="td-empty__desc">Try changing your filters or search keyword.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="td-dir__grid" role="list" aria-label="Teams grid">
          {pageTeams.map((team) => (
            <div key={team.id} role="listitem">
              <TeamCard team={team} />
            </div>
          ))}
        </div>
      ) : (
        <div className="td-dir__list" role="list" aria-label="Teams list">
          {pageTeams.map((team) => (
            <div key={team.id} role="listitem">
              <TeamListItem team={team} />
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="td-pagination" aria-label="Teams pagination">
          <button
            type="button"
            className="td-page-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            ‹
          </button>

          {pageNumbers.map((n) => (
            <button
              key={n}
              type="button"
              className={`td-page-btn${n === currentPage ? " td-page-btn--active" : ""}`}
              onClick={() => onPageChange(n)}
              aria-label={`Page ${n}`}
              aria-current={n === currentPage ? "page" : undefined}
            >
              {n}
            </button>
          ))}

          <button
            type="button"
            className="td-page-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            ›
          </button>
        </nav>
      )}
    </section>
  );
}

export { SkeletonCard };
