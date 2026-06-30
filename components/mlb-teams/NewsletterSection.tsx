"use client";

import { useActionState } from "react";
import {
  subscribeToNewsletter,
  type NewsletterState,
} from "@/lib/supabase/public-actions";

const initialState: NewsletterState = { status: "idle" };

export function NewsletterSection() {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState);

  return (
    <div className="td-newsletter-bg">
      <div className="td-shell">
        <div className="td-newsletter__inner">
          <div className="td-newsletter__icon" aria-hidden="true">✉️</div>

          <div className="td-newsletter__copy">
            <h2 className="td-newsletter__heading">
              Stay Connected With Major League Baseball
            </h2>
            <p className="td-newsletter__sub">
              Receive weekly updates featuring schedules, standings, breaking news,
              player movement, and franchise stories.
            </p>
          </div>

          <form action={formAction} aria-label="Newsletter signup">
            <input type="hidden" name="source" value="mlb-teams-directory" />
            <div className="td-newsletter__form">
              <label className="sr-only" htmlFor="td-newsletter-email">
                Email address
              </label>
              <input
                id="td-newsletter-email"
                type="email"
                name="email"
                required
                placeholder="Enter your email address"
                className="td-newsletter__input"
                aria-required="true"
              />
              <button
                type="submit"
                className="td-newsletter__btn"
                disabled={pending}
                aria-label="Subscribe to newsletter"
              >
                {pending ? "…" : "Subscribe"}
              </button>
            </div>
            {state.status !== "idle" && (
              <p
                role="status"
                aria-live="polite"
                className={`td-newsletter__status td-newsletter__status--${state.status}`}
              >
                {state.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
