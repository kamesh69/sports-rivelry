import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";

interface HomeShowcaseProps {
  featured: Article;
  sideArticles: Article[];
}

export function HomeShowcase({ featured, sideArticles }: HomeShowcaseProps) {
  const featuredAuthor = featured.authors[0];
  const spotlightArticles = sideArticles.slice(0, 4);

  return (
    <section className="home-showcase" aria-label="Top spotlight">
      <div className="home-showcase__frame">
        <Link href={`/${featured.sport.slug}/${featured.slug}`} className="home-showcase__feature">
          <Image
            src={featured.featuredImage.src}
            alt={featured.featuredImage.alt}
            width={featured.featuredImage.width}
            height={featured.featuredImage.height}
            className="home-showcase__image"
            priority
            sizes="(max-width: 720px) 100vw, 72vw"
          />
          <div className="home-showcase__overlay" />
          <div className="home-showcase__watch">
            <span className="home-showcase__watch-label">Editor&apos;s watch</span>
            <strong>{featured.sport.name}</strong>
            <span>{featured.league?.name || "Top story"}</span>
          </div>
          <div className="home-showcase__content">
            <span className="home-showcase__eyebrow">Match reaction</span>
            <h1>{featured.title}</h1>
            <p>{featured.deck || featured.excerpt}</p>
            <div className="home-showcase__cta-row">
              <span className="home-showcase__cta">Read more</span>
              <div className="home-showcase__author">
                <Image
                  src={featuredAuthor.avatar.src}
                  alt={featuredAuthor.avatar.alt}
                  width={44}
                  height={44}
                  className="home-showcase__author-avatar"
                />
                <div>
                  <strong>{featuredAuthor.name}</strong>
                  <span>{featured.readTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {spotlightArticles.length ? (
          <aside className="home-showcase__rail" aria-label="More featured stories">
            {spotlightArticles.map((article, index) => (
              <Link
                key={article.id}
                href={`/${article.sport.slug}/${article.slug}`}
                className={`home-showcase__rail-item${index === 0 ? " home-showcase__rail-item--active" : ""}`}
              >
                <Image
                  src={article.featuredImage.src}
                  alt={article.featuredImage.alt}
                  width={article.featuredImage.width}
                  height={article.featuredImage.height}
                  className="home-showcase__rail-image"
                  sizes="(max-width: 1100px) 30vw, 12vw"
                />
                <div className="home-showcase__rail-copy">
                  <span>{article.sport.name}</span>
                  <strong>{article.title}</strong>
                </div>
              </Link>
            ))}
          </aside>
        ) : null}
      </div>
    </section>
  );
}
