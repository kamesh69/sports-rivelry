"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Article } from "@/lib/types";

interface HomeHeroProps {
  slides: Article[];
}

const SLIDE_WIDTH = 78;
const SLIDE_GAP = 1.5;
const SLIDE_OFFSET = (100 - SLIDE_WIDTH) / 2;

type CarouselSlide = Article & {
  carouselKey: string;
  realIndex: number;
  isClone?: boolean;
};

export function HomeHero({ slides }: HomeHeroProps) {
  const slideCount = slides.length;
  const loopEnabled = slideCount > 1;
  const trackRef = useRef<HTMLDivElement>(null);

  const extendedSlides = useMemo<CarouselSlide[]>(() => {
    if (!loopEnabled) {
      return slides.map((article, index) => ({
        ...article,
        carouselKey: article.id,
        realIndex: index,
      }));
    }

    const last = slides[slideCount - 1];
    const first = slides[0];

    return [
      { ...last, carouselKey: `${last.id}-clone-start`, realIndex: slideCount - 1, isClone: true },
      ...slides.map((article, index) => ({
        ...article,
        carouselKey: article.id,
        realIndex: index,
      })),
      { ...first, carouselKey: `${first.id}-clone-end`, realIndex: 0, isClone: true },
    ];
  }, [loopEnabled, slideCount, slides]);

  const [trackIndex, setTrackIndex] = useState(loopEnabled ? 1 : 0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const activeIndex = loopEnabled
    ? trackIndex === 0
      ? slideCount - 1
      : trackIndex === slideCount + 1
        ? 0
        : trackIndex - 1
    : 0;

  const settleLoop = useCallback(() => {
    if (!loopEnabled || !transitionEnabled) {
      return;
    }

    if (trackIndex === 0) {
      setTransitionEnabled(false);
      setTrackIndex(slideCount);
      return;
    }

    if (trackIndex === slideCount + 1) {
      setTransitionEnabled(false);
      setTrackIndex(1);
    }
  }, [loopEnabled, slideCount, trackIndex, transitionEnabled]);

  useEffect(() => {
    if (transitionEnabled) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      setTransitionEnabled(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [transitionEnabled, trackIndex]);

  const goToTrackIndex = useCallback(
    (nextIndex: number) => {
      if (!loopEnabled) {
        setTrackIndex(Math.max(0, Math.min(nextIndex, slideCount - 1)));
        return;
      }

      setTransitionEnabled(true);
      setTrackIndex(nextIndex);
    },
    [loopEnabled, slideCount],
  );

  const goToRealIndex = useCallback(
    (realIndex: number) => {
      goToTrackIndex(realIndex + 1);
    },
    [goToTrackIndex],
  );

  const goNext = useCallback(() => {
    goToTrackIndex(trackIndex + 1);
  }, [goToTrackIndex, trackIndex]);

  const goPrev = useCallback(() => {
    goToTrackIndex(trackIndex - 1);
  }, [goToTrackIndex, trackIndex]);

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
            ref={trackRef}
            className={`hero-carousel__track${transitionEnabled ? "" : " hero-carousel__track--instant"}`}
            style={{
              transform: `translateX(calc(${SLIDE_OFFSET}% - ${trackIndex} * (${SLIDE_WIDTH}% + ${SLIDE_GAP}rem)))`,
            }}
            onTransitionEnd={settleLoop}
          >
            {extendedSlides.map((article, index) => {
              const author = primaryAuthor(article);
              const isActive = index === trackIndex;

              return (
                <article
                  key={article.carouselKey}
                  className={`hero-carousel__slide${isActive ? " hero-carousel__slide--active" : ""}`}
                  aria-hidden={!isActive}
                >
                  <Link
                    href={`/${article.sport.slug}/${article.slug}`}
                    className="hero-carousel__link"
                    tabIndex={isActive && !article.isClone ? 0 : -1}
                  >
                    <Image
                      src={article.featuredImage.src}
                      alt={article.featuredImage.alt}
                      width={article.featuredImage.width}
                      height={article.featuredImage.height}
                      className="hero-carousel__image"
                      priority={article.realIndex === 0 && !article.isClone}
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
