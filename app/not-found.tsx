import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell page-shell--detail">
      <section className="prose-panel">
        <span className="eyebrow">404</span>
        <h1>Page not found</h1>
        <p>The route exists in the architecture, but there is no matching content in the CMS.</p>
        <Link href="/" className="button button--primary">
          Back to homepage
        </Link>
      </section>
    </div>
  );
}
