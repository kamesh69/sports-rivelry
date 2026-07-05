"use client";

interface NcaaErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Route-level error boundary for the NCAA module, with a Retry action. */
export default function NcaaError({ reset }: NcaaErrorProps) {
  return (
    <div className="page-shell page-shell--detail">
      <div className="ncaa-error" role="alert">
        <span className="ncaa-error__icon" aria-hidden="true">
          ⚠️
        </span>
        <h1>We couldn&apos;t load NCAA coverage</h1>
        <p>Something went wrong while fetching this page. Please try again.</p>
        <button type="button" className="button button--primary" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </div>
  );
}
