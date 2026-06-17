"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Article } from "@/lib/types";

interface HomeHeroProps {
  slides: Article[];
}

const SLIDE_WIDTH = 78;
const SLIDE_GAP = 1.5;
const SLIDE_OFFSET = (100 - SLIDE_WIDTH) / 2;

export function HomeHero({ slides }: HomeHeroProps) {
  const slideCount = slides.length;
  const loopEnabled = slideCount > 1;
  const [activeIndex, setActiveIndex] = useState(0);

  const goToTrackIndex = useCallback(
    (nextIndex: number) => {
      setActiveIndex(((nextIndex % slideCount) + slideCount) % slideCount);
    },
    [slideCount],
  );

  const goToRealIndex = useCallback(
    (realIndex: number) => {
      goToTrackIndex(realIndex);
    },
    [goToTrackIndex],
  );

  const goNext = useCallback(() => {
    goToTrackIndex(activeIndex + 1);
  }, [activeIndex, goToTrackIndex]);

  const goPrev = useCallback(() => {
    goToTrackIndex(activeIndex - 1);
  }, [activeIndex, goToTrackIndex]);

  useEffect(() => {
    if (!loopEnabled) {
      return undefined;
    }

    const timerId = window.setInterval(goNext, 6000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [goNext, loopEnabled]);

  if (!slides.length) {
    return null;
  }

  const primaryAuthor = (article: Article) => article.authors[0];

  return (
    <section className="hero-carousel" aria-label="Featured stories">
      <div className="hero-carousel__stage">
        <div className="hero-carousel__viewport">
          <div
            className="hero-carousel__track"
            style={{
              transform: `translateX(calc(${SLIDE_OFFSET}% - ${activeIndex} * (${SLIDE_WIDTH}% + ${SLIDE_GAP}rem)))`,
            }}
          >
            {slides.map((article, index) => {
              const author = primaryAuthor(article);
              const isActive = index === activeIndex;

              return (
                <article
                  key={article.id}
                  className={`hero-carousel__slide${isActive ? " hero-carousel__slide--active" : ""}`}
                  aria-hidden={!isActive}
                >
                  <Link
                    href={`/${article.sport.slug}/${article.slug}`}
                    className="hero-carousel__link"
                    tabIndex={isActive ? 0 : -1}
                  >
                    <Image
                      src={article.featuredImage.src}
                      alt={article.featuredImage.alt}
                      width={article.featuredImage.width}
                      height={article.featuredImage.height}
                      className="hero-carousel__image"
                      priority={index === 0}
                      sizes="(max-width: 720px) 100vw, 78vw"
                    />
                    <div className="hero-carousel__overlay" />
                    <div className="hero-carousel__content">
                      <span className="hero-carousel__tag">{article.sport.name}</span>
                      <h2>{article.title}</h2>
                      <div className="hero-carousel__author">
                        <Image
                          src={author.avatar.src}
                          alt={author.avatar.alt}
                          width={40}
                          height={40}
                          className="hero-carousel__author-avatar"
                        />
                        <span>{author.name}</span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>

        {loopEnabled ? (
          <>
            <button
              type="button"
              className="hero-carousel__nav hero-carousel__nav--prev"
              onClick={goPrev}
              aria-label="Show previous slide"
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              type="button"
              className="hero-carousel__nav hero-carousel__nav--next"
              onClick={goNext}
              aria-label="Show next slide"
            >
              <span aria-hidden="true">›</span>
            </button>
          </>
        ) : null}
      </div>

      {loopEnabled ? (
        <div className="hero-carousel__dots" role="tablist" aria-label="Carousel navigation">
          {slides.map((article, index) => (
            <button
              key={`${article.id}-dot`}
              type="button"
              className={`hero-carousel__dot${
                index === activeIndex ? " hero-carousel__dot--active" : ""
              }`}
              onClick={() => goToRealIndex(index)}
              aria-label={`Show slide ${index + 1}: ${article.title}`}
              aria-current={index === activeIndex}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
