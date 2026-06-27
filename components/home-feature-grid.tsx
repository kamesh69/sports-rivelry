import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

interface HomeFeatureGridProps {
  featured: Article;
  sideArticles: Article[];
  headlines: Article[];
}

export function HomeFeatureGrid({ featured, sideArticles, headlines }: HomeFeatureGridProps) {
  const sideStories = sideArticles.slice(0, 2);

  return (
    <section className="home-feature-grid" aria-label="Featured rivalry stories">
      <div className="home-feature-grid__side">
        {sideStories.map((article) => (
          <FeatureMiniCard key={article.id} article={article} />
        ))}
      </div>

      <Link href={`/${featured.sport.slug}/${featured.slug}`} className="home-feature-grid__main">
        <Image
          src={featured.featuredImage.src}
          alt={featured.featuredImage.alt}
          width={featured.featuredImage.width}
          height={featured.featuredImage.height}
          className="home-feature-grid__main-image"
          priority
          sizes="(max-width: 1100px) 100vw, 46vw"
        />
        <div className="home-feature-grid__main-copy">
          <h2>{featured.title}</h2>
          <p>{featured.deck}</p>
          <span>
            {featured.authors[0]?.name} | {formatRelativeTime(featured.publishedAt)}
          </span>
        </div>
      </Link>

      <aside className="home-feature-grid__headlines" aria-labelledby="home-top-headlines">
        <h2 id="home-top-headlines">Top Headlines</h2>
        <ul className="home-feature-grid__headline-list">
          {headlines.slice(0, 10).map((article) => (
            <li key={article.id} className="home-feature-grid__headline-item">
              <Link
                href={`/${article.sport.slug}/${article.slug}`}
                className="home-feature-grid__headline"
              >
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}

function FeatureMiniCard({ article }: { article: Article }) {
  return (
    <Link href={`/${article.sport.slug}/${article.slug}`} className="home-feature-mini">
      <Image
        src={article.featuredImage.src}
        alt={article.featuredImage.alt}
        width={640}
        height={360}
        className="home-feature-mini__image"
        sizes="(max-width: 1100px) 100vw, 22vw"
      />
      <h3>{article.title}</h3>
      <span>
        {article.authors[0]?.name} | {formatRelativeTime(article.publishedAt)}
      </span>
    </Link>
  );
}
