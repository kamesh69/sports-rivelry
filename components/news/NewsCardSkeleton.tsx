/** Skeleton placeholder matching NewsCard's layout, shown while articles are loading. */
export function NewsCardSkeleton() {
  return (
    <div className="nc-row nc-row--skeleton" aria-hidden="true">
      <div className="nc-row__body">
        <span className="mn-skeleton mn-skeleton-line mn-skeleton-line--tag" />
        <span className="mn-skeleton mn-skeleton-line mn-skeleton-line--title" />
        <span className="mn-skeleton mn-skeleton-line mn-skeleton-line--title-short" />
        <span className="mn-skeleton mn-skeleton-line mn-skeleton-line--summary" />
        <span className="mn-skeleton mn-skeleton-line mn-skeleton-line--summary-short" />
        <span className="mn-skeleton mn-skeleton-line mn-skeleton-line--meta" />
      </div>
      <div className="nc-row__media">
        <span className="mn-skeleton nc-row__media-skeleton" />
      </div>
    </div>
  );
}
