import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface HomeCardRowProps {
  title: string;
  href: string;
  moreLabel?: string;
  articles: Article[];
}

export function HomeCardRow({ title, href, moreLabel, articles }: HomeCardRowProps) {
  if (!articles.length) {
    return null;
  }

  return (
    <section className="card-row" aria-label={title}>
      <div className="card-row__header">
        <h2 className="card-row__title">{title}</h2>
        <Link href={href} className="card-row__more">
          {moreLabel || `More ${title}`}
        </Link>
      </div>
      <div className="card-row__track">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/${article.sport.slug}/${article.slug}`}
            className="card-row__card"
          >
            <Image
              src={article.featuredImage.src}
              alt={article.featuredImage.alt}
              width={320}
              height={200}
              className="card-row__image"
              sizes="(max-width: 720px) 60vw, 18vw"
            />
            <h3 className="card-row__card-title">{article.title}</h3>
            <span className="card-row__byline">
              {article.authors[0]?.name} | {formatDate(article.publishedAt)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
