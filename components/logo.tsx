import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="brand-lockup" aria-label="Sports Rivalry home">
      <span className="brand-mark" aria-hidden="true">
        SR
      </span>
      <span className="brand-copy">
        <strong>Sports Rivalry</strong>
        <small>Rivalry-first sports coverage</small>
      </span>
    </Link>
  );
}
