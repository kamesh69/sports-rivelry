import Link from "next/link";
import { searchSite } from "@/lib/cms";

interface SearchPageProps {
  searchParams?: Promise<{
    q?: string;
  }>;
}

export const revalidate = 60;

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = (await searchParams) || {};
  const query = params.q || "";
  const results = query ? await searchSite(query) : [];

  return (
    <div className="page-shell page-shell--detail">
      <section className="hub-hero">
        <span className="eyebrow">Search</span>
        <h1>Search the newsroom</h1>
        <p>Search is server-rendered so important result pages remain crawlable and linkable.</p>
      </section>

      <form className="search-form" action="/search" method="get">
        <label htmlFor="q" className="sr-only">
          Search query
        </label>
        <input
          id="q"
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search rivalries, leagues, athletes, or authors"
        />
        <button type="submit" className="button button--primary">
          Search
        </button>
      </form>

      <div className="search-results">
        {query && results.length === 0 ? <p>No results found for “{query}”.</p> : null}
        {results.map((result) => (
          <Link key={`${result.type}:${result.href}`} href={result.href} className="text-card">
            <span className="eyebrow">{result.type}</span>
            <h2>{result.title}</h2>
            <p>{result.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
