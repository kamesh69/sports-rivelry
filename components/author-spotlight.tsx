import Image from "next/image";
import Link from "next/link";
import type { AuthorProfile } from "@/lib/types";

interface AuthorSpotlightProps {
  author: AuthorProfile;
}

export function AuthorSpotlight({ author }: AuthorSpotlightProps) {
  return (
    <article className="author-spotlight">
      <Image
        src={author.avatar.src}
        alt={author.avatar.alt}
        width={author.avatar.width}
        height={author.avatar.height}
        className="author-spotlight__avatar"
      />
      <div>
        <span className="eyebrow">{author.role}</span>
        <h3>
          <Link href={`/authors/${author.slug}`}>{author.name}</Link>
        </h3>
        <p>{author.expertise}</p>
      </div>
    </article>
  );
}
