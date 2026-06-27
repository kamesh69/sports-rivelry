import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";

interface ArticleNextStoryProps {
  article?: Article;
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="article-next-story__arrow">
      <path
        d="M3 8h8M9 5l3 3-3 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArticleNextStory({ article }: ArticleNextStoryProps) {
  if (!article) {
    return null;
  }

  return (
    <section className="article-next-story" aria-labelledby="article-next-story-heading">
      <span id="article-next-story-heading" className="article-sidebar__label">
        Next Story
      </span>
      <Link
        href={`/${article.sport.slug}/${article.slug}`}
        className="article-next-story__card"
      >
        <Image
          src={article.featuredImage.src}
          alt={article.featuredImage.alt}
          width={640}
          height={360}
          className="article-next-story__image"
          sizes="285px"
        />
        <div className="article-next-story__footer">
          <h3>{article.title}</h3>
          <ArrowIcon />
        </div>
      </Link>
    </section>
  );
}
