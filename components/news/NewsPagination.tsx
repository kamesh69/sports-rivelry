import Link from "next/link";

interface NewsPaginationProps {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
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

/** Reusable numbered pagination — Previous / 1 2 3 … N / Next. */
export function NewsPagination({
  currentPage,
  totalPages,
  buildHref,
}: NewsPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pageItems = buildPageItems(currentPage, totalPages);

  return (
    <nav className="mn-pagination" aria-label="News pagination">
      {currentPage === 1 ? (
        <span
          className="mn-pagination__btn mn-pagination__btn--word"
          aria-disabled="true"
        >
          Previous
        </span>
      ) : (
        <Link
          href={buildHref(currentPage - 1)}
          className="mn-pagination__btn mn-pagination__btn--word"
          aria-label="Previous page"
        >
          Previous
        </Link>
      )}

      <div className="mn-pagination__numbers">
        {pageItems.map((item, index) =>
          item === ELLIPSIS ? (
            <span key={`ellipsis-${index}`} className="mn-pagination__ellipsis" aria-hidden="true">
              {ELLIPSIS}
            </span>
          ) : (
            <Link
              key={item}
              href={buildHref(item)}
              className={`mn-pagination__btn${item === currentPage ? " mn-pagination__btn--active" : ""}`}
              aria-label={`Page ${item}`}
              aria-current={item === currentPage ? "page" : undefined}
            >
              {item}
            </Link>
          ),
        )}
      </div>

      {currentPage === totalPages ? (
        <span
          className="mn-pagination__btn mn-pagination__btn--word"
          aria-disabled="true"
        >
          Next
        </span>
      ) : (
        <Link
          href={buildHref(currentPage + 1)}
          className="mn-pagination__btn mn-pagination__btn--word"
          aria-label="Next page"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
