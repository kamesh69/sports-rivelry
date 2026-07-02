export function HeroSkeleton() {
  return (
    <div className="tr-hero tr-hero--skeleton" aria-hidden="true">
      <div className="tr-skeleton tr-hero__skeleton-bg" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="tr-roster-section" aria-hidden="true">
      <div className="tr-skeleton tr-skeleton-line tr-skeleton-line--title" />
      <div className="tr-table-wrap">
        <div className="tr-table-skeleton">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="tr-skeleton tr-table-skeleton__row" />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Full-page loading state: hero + a couple of table placeholders. */
export function RosterPageSkeleton() {
  return (
    <div className="tr-page" role="status" aria-live="polite" aria-label="Loading roster">
      <HeroSkeleton />
      <div className="tr-shell">
        <TableSkeleton rows={6} />
        <TableSkeleton rows={3} />
      </div>
    </div>
  );
}
