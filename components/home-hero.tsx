"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface HomeHeroProps {
  slides: Article[];
}

export function HomeHero({ slides }: HomeHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = slides.length;

  useEffect(() => {
    if (slideCount < 2) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slideCount);
    }, 5000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [slideCount]);

  if (!slides.length) {
    return null;
  }

  const goToSlide = (nextIndex: number) => {
    setActiveIndex((nextIndex + slideCount) % slideCount);
  };

  return (
    <section className="hero-carousel" aria-label="Featured stories">
      <div className="hero-carousel__viewport">
        <div
          className="hero-carousel__track"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slides.map((article, index) => (
            <article key={article.id} className="hero-carousel__slide">
              <Link href={`/${article.sport.slug}/${article.slug}`} className="hero-carousel__link">
                <Image
                  src={article.featuredImage.src}
                  alt={article.featuredImage.alt}
                  width={article.featuredImage.width}
                  height={article.featuredImage.height}
                  className="hero-carousel__image"
                  priority={index === 0}
                  sizes="100vw"
                />
                <div className="hero-carousel__overlay" />
                <div className="hero-carousel__content">
                  <span className="eyebrow hero-carousel__eyebrow">Top story</span>
                  <div className="hero-carousel__meta">
                    <span>{article.sport.name}</span>
                    {article.league ? <span>{article.league.name}</span> : null}
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                  <h2>{article.title}</h2>
                  <p>{article.deck}</p>
                  <span className="hero-carousel__cta">Read full story</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {slideCount > 1 ? (
        <>
          <div className="hero-carousel__controls">
            <button
              type="button"
              className="hero-carousel__button"
              onClick={() => goToSlide(activeIndex - 1)}
              aria-label="Show previous slide"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              className="hero-carousel__button"
              onClick={() => goToSlide(activeIndex + 1)}
              aria-label="Show next slide"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="hero-carousel__dots" role="tablist" aria-label="Carousel navigation">
            {slides.map((article, index) => (
              <button
                key={`${article.id}-dot`}
                type="button"
                className={`hero-carousel__dot${
                  index === activeIndex ? " hero-carousel__dot--active" : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Show slide ${index + 1}: ${article.title}`}
                aria-current={index === activeIndex}
              />
            ))}
          </div>
        </>
      ) : null}

      <div className="hero-carousel__summary">
        {slides.map((article, index) => (
          <button
            key={`${article.id}-summary`}
            type="button"
            className={`hero-carousel__summary-item${
              index === activeIndex ? " hero-carousel__summary-item--active" : ""
            }`}
            onClick={() => goToSlide(index)}
          >
            <span>{article.sport.name}</span>
            <strong>{article.title}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}
