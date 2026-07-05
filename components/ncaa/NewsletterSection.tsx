"use client";

import { useActionState } from "react";
import {
  subscribeToNewsletter,
  type NewsletterState,
} from "@/lib/supabase/public-actions";

const initialState: NewsletterState = { status: "idle" };

/** NCAA newsletter subscription band. Reuses the site-wide `subscribeToNewsletter` action, mirroring `components/mlb-teams/NewsletterSection.tsx`. */
export function NewsletterSection() {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState);

  return (
    <section className="ncaa-band ncaa-band--newsletter" aria-labelledby="ncaa-newsletter-heading">
      <div className="ncaa-shell ncaa-newsletter__inner">
        <div className="ncaa-newsletter__icon" aria-hidden="true">
          ✉️
        </div>

        <div className="ncaa-newsletter__copy">
          <h2 id="ncaa-newsletter-heading" className="ncaa-newsletter__heading">
            Get NCAA News Delivered to You
          </h2>
          <p className="ncaa-newsletter__sub">Stay up to date on scores, rankings, news and more.</p>
        </div>

        <form action={formAction} className="ncaa-newsletter__form-wrap" aria-label="NCAA newsletter signup">
          <input type="hidden" name="source" value="ncaa-landing" />
          <div className="ncaa-newsletter__form">
            <label className="sr-only" htmlFor="ncaa-newsletter-email">
              Email address
            </label>
            <input
              id="ncaa-newsletter-email"
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="ncaa-newsletter__input"
              aria-required="true"
            />
            <button
              type="submit"
              className="button button--primary ncaa-newsletter__btn"
              disabled={pending}
              aria-label="Subscribe to NCAA newsletter"
            >
              {pending ? "…" : "Subscribe"}
            </button>
          </div>
          {state.status !== "idle" ? (
            <p
              role="status"
              aria-live="polite"
              className={`ncaa-newsletter__status ncaa-newsletter__status--${state.status}`}
            >
              {state.message}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
