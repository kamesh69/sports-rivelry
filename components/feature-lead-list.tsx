import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

interface FeatureLeadListProps {
  title: string;
  href: string;
  moreLabel?: string;
  articles: Article[];
}

export function FeatureLeadList({ title, href, moreLabel, articles }: FeatureLeadListProps) {
  const [lead, ...rest] = articles;

  if (!lead) {
    return null;
  }

  const listItems = rest.slice(0, 4);
  const leadHref = `/${lead.sport.slug}/${lead.slug}`;

  return (
    <section className="feature-lead" aria-label={title}>
      <div className="feature-lead__header">
        <h2 className="feature-lead__title">{title}</h2>
        <Link href={href} className="feature-lead__more">
          {moreLabel || `More ${title}`}
        </Link>
      </div>

      <div className="feature-lead__layout">
        <Link href={leadHref} className="feature-lead__lead">
          <Image
            src={lead.featuredImage.src}
            alt={lead.featuredImage.alt}
            width={lead.featuredImage.width}
            height={lead.featuredImage.height}
            className="feature-lead__lead-image"
            sizes="(max-width: 1100px) 100vw, 62vw"
          />
          <h3 className="feature-lead__lead-title">{lead.title}</h3>
          <p className="feature-lead__lead-deck">{lead.deck}</p>
          <span className="feature-lead__byline">
            {lead.authors[0]?.name} | {formatRelativeTime(lead.publishedAt)}
          </span>
        </Link>

        <ul className="feature-lead__list feature-lead__list--balanced">
          {listItems.map((article) => (
            <li key={article.id} className="feature-lead__item">
              <Link href={`/${article.sport.slug}/${article.slug}`}>
                <Image
                  src={article.featuredImage.src}
                  alt={article.featuredImage.alt}
                  width={120}
                  height={75}
                  className="feature-lead__item-image"
                  sizes="120px"
                />
                <span className="feature-lead__item-copy">
                  <strong>{article.title}</strong>
                  <span className="feature-lead__byline">
                    {article.authors[0]?.name} | {formatRelativeTime(article.publishedAt)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
