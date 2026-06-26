"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";
import type { Article } from "@/lib/types";

interface RecommendedReadsProps {
  articles: Article[];
}

export function RecommendedReads({ articles }: RecommendedReadsProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollNext = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".reel-card");
    const step = card ? card.offsetWidth + 14 : 280;
    track.scrollBy({ left: step, behavior: "smooth" });
  }, []);

  if (!articles.length) {
    return null;
  }

  const items = articles.slice(0, 8);

  return (
    <section className="recommended-reads" aria-labelledby="recommended-reads-heading">
      <div className="page-shell recommended-reads__shell">
        <div className="recommended-reads__header">
          <h2 id="recommended-reads-heading">Recommended Reads</h2>
        </div>

        <div className="recommended-reads__stage">
          <div ref={trackRef} className="recommended-reads__track">
            {items.map((article) => (
              <Link
                key={article.id}
                href={`/${article.sport.slug}/${article.slug}`}
                className="reel-card"
              >
                <Image
                  src={article.featuredImage.src}
                  alt={article.featuredImage.alt}
                  width={360}
                  height={640}
                  className="reel-card__image"
                  sizes="(max-width: 720px) 42vw, 220px"
                />
                <div className="reel-card__overlay" />
                <span className="reel-card__brand">SR</span>
                <p className="reel-card__title">{article.title}</p>
              </Link>
            ))}
          </div>

          {items.length > 4 ? (
            <button
              type="button"
              className="recommended-reads__next"
              onClick={scrollNext}
              aria-label="Show more recommended reads"
            >
              <span aria-hidden="true">›</span>
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
