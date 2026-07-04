"use client";

interface NewsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ELLIPSIS = "…" as const;
type PageItem = number | typeof ELLIPSIS;

/** Builds a "1 2 3 4 5 … 10" style page list, always keeping first/last and a window around current. */
function buildPageItems(current: number, total: number, siblingCount = 2): PageItem[] {
  const candidates = new Set<number>([1, total]);

  for (let i = current - siblingCount; i <= current + siblingCount; i++) {
    if (i > 0 && i <= total) {
      candidates.add(i);
    }
  }

  const sorted = Array.from(candidates).sort((a, b) => a - b);
  const items: PageItem[] = [];
  let previous: number | null = null;

  for (const page of sorted) {
    if (previous !== null) {
      if (page - previous === 2) {
        items.push(previous + 1);
      } else if (page - previous > 1) {
        items.push(ELLIPSIS);
      }
    }
    items.push(page);
    previous = page;
  }

  return items;
}

/** Reusable numbered pagination — Previous / 1 2 3 … N / Next, first/last disabled at the boundaries. */
export function NewsPagination({ currentPage, totalPages, onPageChange }: NewsPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pageItems = buildPageItems(currentPage, totalPages);

  return (
    <nav className="mn-pagination" aria-label="News pagination">
      <button
        type="button"
        className="mn-pagination__btn mn-pagination__btn--word"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        Previous
      </button>

      <div className="mn-pagination__numbers">
        {pageItems.map((item, index) =>
          item === ELLIPSIS ? (
            <span key={`ellipsis-${index}`} className="mn-pagination__ellipsis" aria-hidden="true">
              {ELLIPSIS}
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`mn-pagination__btn${item === currentPage ? " mn-pagination__btn--active" : ""}`}
              onClick={() => onPageChange(item)}
              aria-label={`Page ${item}`}
              aria-current={item === currentPage ? "page" : undefined}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        className="mn-pagination__btn mn-pagination__btn--word"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}
