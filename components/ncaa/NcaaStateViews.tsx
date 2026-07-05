interface NcaaEmptyStateProps {
  message?: string;
}

/** Friendly empty-state message shown when a section has no data yet. */
export function NcaaEmptyState({ message = "Nothing to show here yet. Check back soon." }: NcaaEmptyStateProps) {
  return (
    <div className="ncaa-empty" role="status">
      <span className="ncaa-empty__icon" aria-hidden="true">
        🏟️
      </span>
      <p>{message}</p>
    </div>
  );
}

interface NcaaSkeletonRowProps {
  count?: number;
  className?: string;
}

/** Generic row of skeleton blocks; each section pairs this with its own card width/height via className. */
export function NcaaSkeletonRow({ count = 4, className = "" }: NcaaSkeletonRowProps) {
  return (
    <div className={`ncaa-skeleton-row ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <span key={index} className="ncaa-skeleton-block" />
      ))}
    </div>
  );
}
