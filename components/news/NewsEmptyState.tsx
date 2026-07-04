/** Shown when filters/search return zero results. */
export function NewsEmptyState() {
  return (
    <div className="mn-empty" role="status" aria-live="polite">
      <span className="mn-empty__icon" aria-hidden="true">
        ⚾
      </span>
      <p className="mn-empty__title">No articles found.</p>
      <p className="mn-empty__desc">Try changing your search or filters.</p>
    </div>
  );
}
