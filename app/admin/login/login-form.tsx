"use client";

import { useActionState } from "react";
import { signInAction, type AuthActionState } from "@/app/admin/actions";

const initialState: AuthActionState = {};

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, pending] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="admin-form">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <label className="admin-field">
        <span>Email</span>
        <input type="email" name="email" required autoComplete="email" />
      </label>
      <label className="admin-field">
        <span>Password</span>
        <input type="password" name="password" required autoComplete="current-password" />
      </label>
      {state.error ? <p className="admin-form__error">{state.error}</p> : null}
      <button type="submit" className="button button--primary" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
