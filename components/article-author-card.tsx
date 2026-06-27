import Image from "next/image";
import type { AuthorProfile } from "@/lib/types";
import { SocialIcon } from "@/components/social-icon";

interface ArticleAuthorCardProps {
  author: AuthorProfile;
}

export function ArticleAuthorCard({ author }: ArticleAuthorCardProps) {
  const xLink = author.socials.find((link) => link.platform === "x");

  return (
    <section className="article-author-card" aria-labelledby="article-author-card-heading">
      {xLink ? (
        <a
          href={xLink.url}
          className="article-author-card__social"
          target="_blank"
          rel="noreferrer"
          aria-label={`Follow ${author.name} on X`}
        >
          <SocialIcon platform="x" />
        </a>
      ) : null}
      <Image
        src={author.avatar.src}
        alt={author.avatar.alt}
        width={80}
        height={80}
        className="article-author-card__avatar"
      />
      <div className="article-author-card__body">
        <h2 id="article-author-card-heading">{author.name}</h2>
        <p className="article-author-card__role">{author.role}</p>
        <p className="article-author-card__bio">{author.bio}</p>
      </div>
    </section>
  );
}
