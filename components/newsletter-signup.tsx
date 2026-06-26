"use client";

import { useActionState } from "react";
import {
  subscribeToNewsletter,
  type NewsletterState,
} from "@/lib/supabase/public-actions";

const initialState: NewsletterState = { status: "idle" };

interface NewsletterSignupProps {
  heading?: string;
  description?: string;
  source?: string;
}

export function NewsletterSignup({
  heading = "Never Miss a Moment",
  description = "Get the biggest stories, expert analysis and exclusive content delivered to your inbox.",
  source = "homepage",
}: NewsletterSignupProps) {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState);

  return (
    <section className="newsletter-signup" aria-labelledby="newsletter-signup-heading">
      <div className="newsletter-signup__copy">
        <h2 id="newsletter-signup-heading">{heading}</h2>
        <p>{description}</p>
      </div>
      <form action={formAction} className="newsletter-signup__form">
        <input type="hidden" name="source" value={source} />
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          placeholder="Enter your email"
          className="newsletter-signup__input"
        />
        <button type="submit" className="newsletter-signup__button" disabled={pending}>
          {pending ? "…" : "Subscribe"}
        </button>
      </form>
      {state.status !== "idle" ? (
        <p
          className={`newsletter-signup__message newsletter-signup__message--${state.status}`}
          role="status"
        >
          {state.message}
        </p>
      ) : null}
    </section>
  );
}
