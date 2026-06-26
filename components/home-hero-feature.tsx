"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Article } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

interface HomeHeroFeatureProps {
  featured: Article;
  secondary: Article[];
}

export function HomeHeroFeature({ featured, secondary }: HomeHeroFeatureProps) {
  const thumbnails = secondary.slice(0, 3);
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = thumbnails.find((article) => article.id === activeId) ?? featured;
  const author = active.authors[0];

  return (
    <section className="hero-feature" aria-label="Top story">
      <Link
        href={`/${active.sport.slug}/${active.slug}`}
        className="hero-feature__main"
        aria-label={active.title}
      >
        <Image
          key={active.id}
          src={active.featuredImage.src}
          alt={active.featuredImage.alt}
          fill
          priority
          sizes="(max-width: 1100px) 100vw, 1280px"
          className="hero-feature__image"
        />
        <div className="hero-feature__overlay" />
        <div className="hero-feature__content">
          <span className="hero-feature__tag">{active.league?.name || active.sport.name}</span>
          <h1 className="hero-feature__title">{active.title}</h1>
          <p className="hero-feature__deck">{active.deck}</p>
          <span className="hero-feature__byline">
            {author?.name}
            {author ? " | " : ""}
            {formatRelativeTime(active.publishedAt)}
          </span>
        </div>
      </Link>

      {thumbnails.length > 0 ? (
        <ul className="hero-feature__thumbs" aria-label="More top stories">
          {thumbnails.map((article) => (
            <li
              key={article.id}
              className={`hero-feature__thumb${
                activeId === article.id ? " hero-feature__thumb--active" : ""
              }`}
              onMouseEnter={() => setActiveId(article.id)}
              onMouseLeave={() => setActiveId(null)}
              onFocus={() => setActiveId(article.id)}
              onBlur={() => setActiveId(null)}
            >
              <Link href={`/${article.sport.slug}/${article.slug}`}>
                <Image
                  src={article.featuredImage.src}
                  alt={article.featuredImage.alt}
                  width={240}
                  height={150}
                  sizes="240px"
                  className="hero-feature__thumb-image"
                />
                <span className="hero-feature__thumb-tag">
                  {article.league?.name || article.sport.name}
                </span>
                <span className="hero-feature__thumb-title">{article.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
