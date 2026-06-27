"use client";

import Image from "next/image";
import { useActionState } from "react";
import type { MediaAsset } from "@/lib/types";
import {
  subscribeToNewsletter,
  type NewsletterState,
} from "@/lib/supabase/public-actions";

const initialState: NewsletterState = { status: "idle" };

export function SportNewsletterBand({
  heading,
  subheading,
  image,
  source,
}: {
  heading: string;
  subheading: string;
  image?: MediaAsset;
  source: string;
}) {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState);

  return (
    <section className="sp-newsband" aria-label="Newsletter signup">
      <div className="sp-shell sp-newsband__inner">
        <div className="sp-newsband__copy">
          <h2>{heading}</h2>
          <p>{subheading}</p>
          <form action={formAction} className="sp-newsband__form">
            <input type="hidden" name="source" value={source} />
            <label className="sr-only" htmlFor="sp-newsletter-email">
              Email address
            </label>
            <input
              id="sp-newsletter-email"
              type="email"
              name="email"
              required
              placeholder="Enter your email"
            />
            <button type="submit" disabled={pending}>
              {pending ? "…" : "Subscribe"}
            </button>
          </form>
          {state.status !== "idle" ? (
            <p role="status" className="sp-newsband__status">
              {state.message}
            </p>
          ) : null}
        </div>
        {image ? (
          <div className="sp-newsband__media">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
