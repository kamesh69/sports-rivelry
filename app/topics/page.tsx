import Link from "next/link";
import { topicHubs } from "@/lib/mock-data";

export const revalidate = 60;

export default function TopicsIndexPage() {
  return (
    <div className="page-shell page-shell--detail">
      <section className="hub-hero">
        <span className="eyebrow">Topics</span>
        <h1>Search-oriented topic hubs</h1>
        <p>
          Topic pages keep evergreen coverage grouped around high-intent search themes and story
          arcs.
        </p>
      </section>
      <div className="search-results">
        {topicHubs.map((topic) => (
          <Link key={topic.slug} href={`/topics/${topic.slug}`} className="text-card">
            <span className="eyebrow">Topic</span>
            <h2>{topic.title}</h2>
            <p>{topic.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
