import Link from "next/link";
import { newsletters } from "@/lib/mock-data";

export const revalidate = 60;

export default function NewslettersIndexPage() {
  return (
    <div className="page-shell page-shell--detail">
      <section className="hub-hero">
        <span className="eyebrow">Newsletters</span>
        <h1>Email products built for retention</h1>
        <p>
          Newsletter pages let editors control recurring products as landing pages, archive points,
          and conversion modules.
        </p>
      </section>
      <div className="search-results">
        {newsletters.map((issue) => (
          <Link key={issue.slug} href={`/newsletters/${issue.slug}`} className="text-card">
            <span className="eyebrow">Newsletter</span>
            <h2>{issue.title}</h2>
            <p>{issue.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
