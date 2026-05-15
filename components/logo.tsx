import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="brand-lockup" aria-label="Sports Rivelry home">
      <span className="brand-mark" aria-hidden="true">
        SR
      </span>
      <span className="brand-copy">
        <strong>Sports Rivelry</strong>
        <small>Editorial-first sports intelligence</small>
      </span>
    </Link>
  );
}
