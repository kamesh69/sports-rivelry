import Image from "next/image";
import Link from "next/link";
import type { QuickHitsBlock } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

interface QuickHitsProps {
  block: QuickHitsBlock;
}

export function QuickHits({ block }: QuickHitsProps) {
  const { featured, secondary } = block;

  return (
    <section className="quick-hits" aria-labelledby="quick-hits-heading">
      <h2 id="quick-hits-heading" className="quick-hits__title">
        {block.config.title}
      </h2>

      <article className="quick-hits__featured">
        <Link
          href={`/${featured.sport.slug}/${featured.slug}`}
          className="quick-hits__featured-image-link"
        >
          <Image
            src={featured.featuredImage.src}
            alt={featured.featuredImage.alt}
            width={featured.featuredImage.width}
            height={featured.featuredImage.height}
            className="quick-hits__featured-image"
            priority
          />
        </Link>
        <div className="quick-hits__featured-body">
          <span className="quick-hits__category">{featured.sport.name}</span>
          <h3>
            <Link href={`/${featured.sport.slug}/${featured.slug}`}>{featured.title}</Link>
          </h3>
          <p className="quick-hits__byline">
            {featured.authors.map((author) => author.name).join(", ")} |{" "}
            {formatRelativeTime(featured.publishedAt)}
          </p>
        </div>
      </article>

      {secondary.length > 0 ? (
        <div className="quick-hits__secondary">
          {secondary.map((article) => (
            <article key={article.id} className="quick-hits__secondary-card">
              <Link
                href={`/${article.sport.slug}/${article.slug}`}
                className="quick-hits__secondary-image-link"
              >
                <Image
                  src={article.featuredImage.src}
                  alt={article.featuredImage.alt}
                  width={article.featuredImage.width}
                  height={article.featuredImage.height}
                  className="quick-hits__secondary-image"
                />
              </Link>
              <div className="quick-hits__secondary-body">
                <span className="quick-hits__category">{article.sport.name}</span>
                <h4>
                  <Link href={`/${article.sport.slug}/${article.slug}`}>{article.title}</Link>
                </h4>
                <p className="quick-hits__byline">
                  {article.authors.map((author) => author.name).join(", ")} |{" "}
                  {formatRelativeTime(article.publishedAt)}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
