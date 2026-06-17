import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Article, SportHub, TeamIdentity } from "@/lib/types";
import { formatDate, formatRelativeTime } from "@/lib/utils";

interface SportHubShowcaseProps {
  hub: SportHub;
  heroStories: Article[];
  latestStories: Article[];
  editorsPicks: Article[];
}

export function SportHubShowcase({
  hub,
  heroStories,
  latestStories,
  editorsPicks,
}: SportHubShowcaseProps) {
  const leadArticle = heroStories[0] || latestStories[0];
  const nextHref = hub.leagueSlugs[0] ? `/${hub.slug}/${hub.leagueSlugs[0]}` : `/${hub.slug}`;
  const headlineArticles = latestStories.filter((article) => article.id !== leadArticle?.id).slice(0, 8);
  const featureLead = editorsPicks[0] || heroStories[1] || latestStories[1] || leadArticle;
  const featureList = [...editorsPicks, ...heroStories, ...latestStories]
    .filter((article, index, all) => all.findIndex((entry) => entry.id === article.id) === index)
    .filter((article) => article.id !== featureLead?.id)
    .slice(0, 4);
  const moreStories = latestStories
    .filter((article) => article.id !== leadArticle?.id && article.id !== featureLead?.id)
    .slice(0, 5);

  if (!leadArticle) {
    return null;
  }

  return (
    <div className="sport-hub-showcase">
      <h1 className="sr-only">{hub.name}</h1>
      <section className="sport-page-lead" aria-labelledby={`${hub.slug}-lead-heading`}>
        <Link href={`/${leadArticle.sport.slug}/${leadArticle.slug}`} className="sport-page-lead__story">
          <Image
            src={leadArticle.featuredImage.src}
            alt={leadArticle.featuredImage.alt}
            width={leadArticle.featuredImage.width}
            height={leadArticle.featuredImage.height}
            className="sport-page-lead__image"
            priority
            sizes="(max-width: 1100px) 100vw, 58vw"
          />
          <h2 id={`${hub.slug}-lead-heading`}>{leadArticle.title}</h2>
          <p>{leadArticle.deck}</p>
          <span>
            {leadArticle.authors[0]?.name} | {formatRelativeTime(leadArticle.publishedAt)}
          </span>
        </Link>

        <aside className="sport-page-headlines" aria-labelledby={`${hub.slug}-headlines-heading`}>
          <h2 id={`${hub.slug}-headlines-heading`}>{hub.name} Headlines</h2>
          <div className="sport-page-headlines__list">
            {headlineArticles.map((article) => (
              <Link key={article.id} href={`/${article.sport.slug}/${article.slug}`}>
                {article.title}
              </Link>
            ))}
          </div>
        </aside>
      </section>

      {hub.featuredTeams?.length ? (
        <TeamLogoCarousel title={`Best of ${hub.name}`} teams={hub.featuredTeams} />
      ) : null}

      {featureLead ? (
        <section className="sport-page-features" aria-labelledby={`${hub.slug}-features-heading`}>
          <h2 id={`${hub.slug}-features-heading`}>Features</h2>
          <div className="sport-page-features__layout">
            <Link href={`/${featureLead.sport.slug}/${featureLead.slug}`} className="sport-page-feature-lead">
              <Image
                src={featureLead.featuredImage.src}
                alt={featureLead.featuredImage.alt}
                width={featureLead.featuredImage.width}
                height={featureLead.featuredImage.height}
                className="sport-page-feature-lead__image"
                sizes="(max-width: 1100px) 100vw, 52vw"
              />
              <h3>{featureLead.title}</h3>
              <p>{featureLead.excerpt}</p>
              <span>
                {featureLead.authors[0]?.name} | {formatDate(featureLead.publishedAt)}
              </span>
            </Link>

            <div className="sport-page-feature-list">
              {featureList.map((article) => (
                <Link key={article.id} href={`/${article.sport.slug}/${article.slug}`}>
                  <Image
                    src={article.featuredImage.src}
                    alt={article.featuredImage.alt}
                    width={360}
                    height={203}
                    className="sport-page-feature-list__image"
                    sizes="(max-width: 1100px) 36vw, 16vw"
                  />
                  <div>
                    <h3>{article.title}</h3>
                    <span>
                      {article.authors[0]?.name} | {formatDate(article.publishedAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="sport-page-more" aria-labelledby={`${hub.slug}-more-heading`}>
        <h2 id={`${hub.slug}-more-heading`}>More {hub.name}</h2>
        <div className="sport-page-more__list">
          {moreStories.map((article, index) => (
            <Link
              key={article.id}
              href={`/${article.sport.slug}/${article.slug}`}
              className="sport-page-more__item"
            >
              <Image
                src={article.featuredImage.src}
                alt={article.featuredImage.alt}
                width={360}
                height={203}
                className="sport-page-more__image"
                sizes="(max-width: 720px) 38vw, 18vw"
              />
              <div>
                <h3 className={index === 3 ? "sport-page-more__hot-title" : undefined}>
                  {article.title}
                </h3>
                <p>{article.excerpt}</p>
                <span>
                  {article.authors[0]?.name} | {formatDate(article.publishedAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
        <Link href={nextHref} className="sport-page-more__button">
          Next
        </Link>
      </section>
    </div>
  );
}

function TeamLogoCarousel({ title, teams }: { title: string; teams: TeamIdentity[] }) {
  return (
    <section className="team-logo-carousel" aria-labelledby="team-logo-carousel-heading">
      <h2 id="team-logo-carousel-heading">{title}</h2>
      <div className="team-logo-carousel__track">
        {teams.map((team) => (
          <div
            key={team.name}
            className="team-logo-card"
            style={{
              "--team-primary": team.primaryColor,
              "--team-accent": team.accentColor,
              "--team-text": team.textColor || "#ffffff",
            } as CSSProperties}
          >
            <span className="team-logo-card__mark">{team.shortName}</span>
            <span className="team-logo-card__name">{team.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
