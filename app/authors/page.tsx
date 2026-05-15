import { authors } from "@/lib/mock-data";
import { AuthorSpotlight } from "@/components/author-spotlight";
import { SectionHeading } from "@/components/section-heading";

export const revalidate = 60;

export default function AuthorsIndexPage() {
  return (
    <div className="page-shell page-shell--detail">
      <section className="hub-hero">
        <span className="eyebrow">Authors</span>
        <h1>Meet the Sports Rivelry newsroom</h1>
        <p>
          Author pages are a core SEO and trust signal, giving Google and readers clear
          expertise context.
        </p>
      </section>
      <section className="module-block">
        <SectionHeading title="Writers and editors" />
        <div className="author-grid">
          {authors.map((author) => (
            <AuthorSpotlight key={author.id} author={author} />
          ))}
        </div>
      </section>
    </div>
  );
}
