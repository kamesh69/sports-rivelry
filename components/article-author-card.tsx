import Image from "next/image";
import Link from "next/link";
import type { AuthorProfile } from "@/lib/types";

interface ArticleAuthorCardProps {
  author: AuthorProfile;
}

export function ArticleAuthorCard({ author }: ArticleAuthorCardProps) {
  return (
    <section className="article-author-card" aria-labelledby="article-author-card-heading">
      <Image
        src={author.avatar.src}
        alt={author.avatar.alt}
        width={author.avatar.width}
        height={author.avatar.height}
        className="article-author-card__avatar"
      />
      <div className="article-author-card__body">
        <span className="eyebrow">{author.role}</span>
        <h2 id="article-author-card-heading">{author.name}</h2>
        <p>{author.bio}</p>
        <p className="author-expertise">{author.expertise}</p>
        <div className="article-author-card__links">
          <Link href={`/authors/${author.slug}`}>View author page</Link>
          {author.socials.slice(0, 2).map((link) => (
            <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
